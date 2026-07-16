"""WebSocket connection manager for webterm."""

import asyncio
import gzip
import json
import socket
from typing import Optional

from fastapi import WebSocket, WebSocketDisconnect

from webterm.core.session import Session, session_manager
from webterm.core.stats import get_system_stats
from webterm.logger import get_logger

logger = get_logger("websocket")

STATS_INTERVAL = 2.0  # seconds between stats updates
STATS_INTERVAL_HIGH_LATENCY = 5.0
OUTPUT_BATCH_WINDOW = 0.006  # seconds to coalesce PTY output burst
OUTPUT_BATCH_MAX_BYTES = 96 * 1024
OUTPUT_BATCH_WINDOW_MIN = 0.002
OUTPUT_BATCH_WINDOW_MAX = 0.024
SEND_COALESCE_WINDOW = 0.003
SEND_COALESCE_WINDOW_HIGH_LATENCY = 0.006
PROTOCOL_VERSION = 3
BIN_OUTPUT_FRAME = 0x01
BIN_OUTPUT_GZIP_FRAME = 0x02
BIN_INPUT_FRAME = 0x10
BIN_INPUT_GZIP_FRAME = 0x11
GZIP_OUTPUT_MIN_BYTES = 1024
GZIP_OUTPUT_MAX_BYTES = 256 * 1024
GZIP_SAVINGS_MIN_BYTES = 96
GZIP_EXECUTOR_MIN_BYTES = 32 * 1024


class WebSocketManager:
    """Manages WebSocket connections and bridges them to PTY sessions."""

    def __init__(self):
        """Initialize the WebSocket manager."""
        self._detailed_stats: dict[WebSocket, bool] = {}
        self._binary_protocol: dict[WebSocket, bool] = {}
        self._compression_protocol: dict[WebSocket, bool] = {}
        self._output_batch_window: dict[WebSocket, float] = {}
        self._output_queues: dict[WebSocket, asyncio.Queue[bytes]] = {}
        self._high_latency_mode: dict[WebSocket, bool] = {}

    @staticmethod
    def _unwrap_transport(send_callable, depth: int = 0):
        """Walk through nested ASGI middleware closures to find the transport.

        Starlette/FastAPI wrap the ASGI ``send`` callable through several
        layers of exception-handling closures. Each layer simply forwards to
        an inner ``send`` captured as a free variable, so we recursively
        inspect closure cells until we find a bound method exposing a
        ``.transport`` (the underlying asyncio transport set by uvicorn's
        websocket protocol implementation).
        """
        if send_callable is None or depth > 10:
            return None

        bound_self = getattr(send_callable, "__self__", None)
        transport = getattr(bound_self, "transport", None)
        if transport is not None:
            return transport

        closure = getattr(send_callable, "__closure__", None)
        code = getattr(send_callable, "__code__", None)
        if not closure or not code:
            return None

        for cell in closure:
            try:
                value = cell.cell_contents
            except ValueError:
                continue
            if callable(value):
                found = WebSocketManager._unwrap_transport(value, depth + 1)
                if found is not None:
                    return found
        return None

    @classmethod
    def _disable_nagle(cls, websocket: WebSocket) -> None:
        """Disable Nagle's algorithm (TCP_NODELAY) on the underlying socket.

        Neither uvicorn nor the websockets/wsproto ASGI server implementations
        disable Nagle's algorithm by default. Left enabled, small interactive
        frames (single keystroke echoes) can incur delayed-ACK related stalls
        of tens of milliseconds, unlike SSH which always disables it. This is
        best-effort and relies on server-implementation internals, so any
        failure is silently ignored (falls back to default socket behavior).
        """
        try:
            transport = cls._unwrap_transport(websocket._send)
            sock = transport.get_extra_info("socket") if transport is not None else None
            if sock is not None:
                sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
        except Exception:
            pass

    async def handle_connection(self, websocket: WebSocket, requested_session_id: Optional[str] = None) -> None:
        """Handle a WebSocket connection.

        Args:
            websocket: The WebSocket connection
            requested_session_id: Optional existing session ID to resume
        """
        await websocket.accept()
        self._disable_nagle(websocket)
        session: Optional[Session] = None
        resumed = False

        try:
            # Attempt to resume an existing session first.
            if requested_session_id:
                session = await session_manager.get_session(requested_session_id)
                resumed = session is not None
                if resumed:
                    # The client's local screen is blank after a reconnect, but
                    # resize() is a no-op if dimensions haven't changed, so no
                    # SIGWINCH would otherwise be sent. Force a repaint on the
                    # next resize message the client sends after connecting.
                    session.pending_redraw = True

            # Fall back to creating a new session.
            if not session:
                session = await session_manager.create_session()

            if not session:
                await self._send_error(websocket, "Failed to create session (limit reached)")
                await websocket.close()
                return

            logger.info(
                f"WebSocket connected, session {session.id} ({'resumed' if resumed else 'new'})"
            )

            await websocket.send_json({"type": "session", "id": session.id, "resumed": resumed})

            # Initialize detailed stats state for this connection
            self._detailed_stats[websocket] = False
            self._binary_protocol[websocket] = False
            self._compression_protocol[websocket] = False
            self._output_batch_window[websocket] = OUTPUT_BATCH_WINDOW
            self._high_latency_mode[websocket] = False

            output_queue: asyncio.Queue[bytes] = asyncio.Queue(maxsize=128)
            self._output_queues[websocket] = output_queue

            # Start reading from PTY and forwarding to WebSocket
            read_task = asyncio.create_task(self._read_pty_loop(websocket, session, output_queue))
            # Output sender is isolated so heavy output doesn't block input handling.
            send_task = asyncio.create_task(self._send_output_loop(websocket, output_queue))
            # Start sending system stats periodically
            stats_task = asyncio.create_task(self._stats_loop(websocket))

            try:
                # Handle incoming WebSocket messages
                await self._handle_messages(websocket, session)
            finally:
                read_task.cancel()
                send_task.cancel()
                stats_task.cancel()
                try:
                    await read_task
                except asyncio.CancelledError:
                    pass
                try:
                    await send_task
                except asyncio.CancelledError:
                    pass
                try:
                    await stats_task
                except asyncio.CancelledError:
                    pass

        except WebSocketDisconnect:
            logger.info("WebSocket disconnected")
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
            await self._send_error(websocket, str(e))
        finally:
            # Clean up detailed stats state
            self._detailed_stats.pop(websocket, None)
            self._binary_protocol.pop(websocket, None)
            self._compression_protocol.pop(websocket, None)
            self._output_batch_window.pop(websocket, None)
            self._output_queues.pop(websocket, None)
            self._high_latency_mode.pop(websocket, None)
            if session:
                # Keep session alive across transient disconnects so users can
                # resume long-running interactive apps (e.g. nvim/tmux).
                # Expired or dead sessions are cleaned up by existing managers.
                if not session.pty.is_running:
                    await session_manager.remove_session(session.id)

    async def _read_pty_loop(self, websocket: WebSocket, session: Session, output_queue: asyncio.Queue[bytes]) -> None:
        """Read from PTY and send to WebSocket.

        Args:
            websocket: The WebSocket connection
            session: The terminal session
        """
        while session.pty.is_running:
            try:
                data = await session.pty.read()
                if data:
                    # Coalesce bursty PTY output into one frame to reduce JSON/ws overhead.
                    chunks = [data]
                    total = len(data)
                    loop = asyncio.get_running_loop()
                    batch_window = self._output_batch_window.get(websocket, OUTPUT_BATCH_WINDOW)
                    deadline = loop.time() + batch_window

                    while total < OUTPUT_BATCH_MAX_BYTES and loop.time() < deadline:
                        extra = session.pty.read_nowait()
                        if not extra:
                            break
                        chunks.append(extra)
                        total += len(extra)

                    payload = b"".join(chunks)
                    await self._enqueue_output(output_queue, payload)
                else:
                    await asyncio.sleep(0.002)
            except Exception as e:
                logger.error(f"PTY read error: {e}")
                break

        # The PTY died (process exited, or the session was reaped by the idle
        # timeout cleanup task) while the websocket was still open. Without an
        # explicit close here the client's socket stays "open" forever with no
        # way to detect that input/output is going nowhere, appearing frozen
        # until the page is manually reloaded. Close the websocket so the
        # client's onclose handler fires and triggers its own reconnect logic.
        await self._send_error(websocket, "Session terminated")
        try:
            await websocket.close()
        except Exception:
            pass

    async def _enqueue_output(self, output_queue: asyncio.Queue[bytes], payload: bytes) -> None:
        """Queue PTY output for websocket sending.

        When queue is full, drop oldest chunk and keep newest output to reduce tail latency.
        """
        if not payload:
            return

        try:
            output_queue.put_nowait(payload)
        except asyncio.QueueFull:
            try:
                # Favor freshest terminal state over stale backlog under congestion.
                output_queue.get_nowait()
                output_queue.put_nowait(payload)
            except Exception:
                # If still congested, drop this burst chunk and continue.
                pass

    async def _send_output_loop(self, websocket: WebSocket, output_queue: asyncio.Queue[bytes]) -> None:
        """Send queued output to websocket and adapt batching window by observed send latency."""
        loop = asyncio.get_running_loop()

        while True:
            payload = await output_queue.get()

            # Coalesce queued chunks to reduce websocket frame count under load.
            while len(payload) < OUTPUT_BATCH_MAX_BYTES:
                try:
                    extra = output_queue.get_nowait()
                except asyncio.QueueEmpty:
                    break
                payload += extra

            # Only wait for more data if a burst was already in flight (queue had
            # backlog above). For an isolated chunk (e.g. a single keystroke echo)
            # sending immediately avoids adding artificial latency.
            if not output_queue.empty():
                high_latency = self._high_latency_mode.get(websocket, False)
                coalesce_window = SEND_COALESCE_WINDOW_HIGH_LATENCY if high_latency else SEND_COALESCE_WINDOW
                deadline = loop.time() + coalesce_window

                while len(payload) < OUTPUT_BATCH_MAX_BYTES:
                    timeout = deadline - loop.time()
                    if timeout <= 0:
                        break
                    try:
                        extra = await asyncio.wait_for(output_queue.get(), timeout=timeout)
                    except TimeoutError:
                        break
                    payload += extra

                # Drain anything else that arrived nowait during the wait above.
                while len(payload) < OUTPUT_BATCH_MAX_BYTES:
                    try:
                        extra = output_queue.get_nowait()
                    except asyncio.QueueEmpty:
                        break
                    payload += extra

            started = loop.time()
            await self._send_output(websocket, payload)
            send_latency = loop.time() - started
            self._adapt_output_batch_window(websocket, send_latency)

    def _adapt_output_batch_window(self, websocket: WebSocket, send_latency: float) -> None:
        """Adapt PTY read-side batching window by websocket send latency."""
        current = self._output_batch_window.get(websocket, OUTPUT_BATCH_WINDOW)
        high_latency = self._high_latency_mode.get(websocket, False)

        window_min = 0.004 if high_latency else OUTPUT_BATCH_WINDOW_MIN
        window_max = 0.02 if high_latency else OUTPUT_BATCH_WINDOW_MAX

        if send_latency > 0.008:
            current = min(window_max, current + 0.001)
        elif send_latency < 0.003:
            current = max(window_min, current - 0.0005)

        self._output_batch_window[websocket] = current

    async def _handle_messages(self, websocket: WebSocket, session: Session) -> None:
        """Handle incoming WebSocket messages.

        Args:
            websocket: The WebSocket connection
            session: The terminal session
        """
        while True:
            try:
                message = await websocket.receive()
                message_type = message.get("type")

                if message_type == "websocket.disconnect":
                    raise WebSocketDisconnect

                text_payload = message.get("text")
                if text_payload is not None:
                    await self._handle_text_message(websocket, session, text_payload)
                    continue

                binary_payload = message.get("bytes")
                if binary_payload is not None:
                    await self._handle_binary_message(websocket, session, binary_payload)

            except json.JSONDecodeError:
                logger.warning("Invalid JSON received")
            except WebSocketDisconnect:
                raise
            except Exception as e:
                logger.error(f"Message handling error: {e}")

    async def _handle_text_message(self, websocket: WebSocket, session: Session, raw: str) -> None:
        """Handle text (JSON) websocket messages."""
        message = json.loads(raw)
        msg_type = message.get("type")

        if msg_type == "input":
            data = message.get("data", "")
            await session.pty.write(data.encode("utf-8"))
            session.touch()

        elif msg_type == "resize":
            rows = message.get("rows", 24)
            cols = message.get("cols", 80)
            session.pty.resize(rows, cols)
            if session.pending_redraw:
                session.pending_redraw = False
                session.pty.force_redraw()
            session.touch()

        elif msg_type == "stats_detail":
            # Toggle or set detailed stats mode
            enabled = message.get("enabled")
            if enabled is None:
                # Toggle
                self._detailed_stats[websocket] = not self._detailed_stats.get(websocket, False)
            else:
                self._detailed_stats[websocket] = bool(enabled)
            # Send immediate stats update with new detail level
            await self._send_stats(websocket)

        elif msg_type == "get_cwd":
            # Get current working directory of the terminal
            cwd = session.pty.get_cwd()
            await websocket.send_json({"type": "cwd", "path": cwd})

        elif msg_type == "hello":
            binary_requested = bool(message.get("binary", False))
            compression_requested = bool(message.get("compress", False))
            self._binary_protocol[websocket] = binary_requested
            self._compression_protocol[websocket] = binary_requested and compression_requested
            await websocket.send_json(
                {
                    "type": "protocol",
                    "version": PROTOCOL_VERSION,
                    "binary": binary_requested,
                    "compress": self._compression_protocol[websocket],
                }
            )

        elif msg_type == "ping":
            # RTT probe for client-side adaptive input batching.
            await websocket.send_json({"type": "pong", "t": message.get("t")})

        elif msg_type == "latency_mode":
            self._high_latency_mode[websocket] = bool(message.get("high", False))

        else:
            logger.warning(f"Unknown message type: {msg_type}")

    async def _handle_binary_message(self, websocket: WebSocket, session: Session, payload: bytes) -> None:
        """Handle binary websocket messages.

        Binary frame format:
        - byte 0: frame type
        - byte 1..n: payload
        """
        if not payload:
            return

        frame_type = payload[0]
        frame_payload = payload[1:]

        if frame_type == BIN_INPUT_FRAME:
            if frame_payload:
                await session.pty.write(frame_payload)
            session.touch()
        elif frame_type == BIN_INPUT_GZIP_FRAME:
            if frame_payload:
                try:
                    decompressed = gzip.decompress(frame_payload)
                except Exception:
                    logger.warning("Invalid gzip input frame received")
                    return
                if decompressed:
                    await session.pty.write(decompressed)
            session.touch()
        else:
            logger.warning(f"Unknown binary frame type: {frame_type}")

    async def _maybe_compress_output(self, data: bytes) -> Optional[bytes]:
        """Compress output payload if it yields meaningful savings.

        Large payloads are compressed in a thread executor to avoid blocking
        the single-threaded event loop (and thus other sessions' latency)
        during heavy output bursts.
        """
        size = len(data)
        if size < GZIP_OUTPUT_MIN_BYTES or size > GZIP_OUTPUT_MAX_BYTES:
            return None

        if size >= GZIP_EXECUTOR_MIN_BYTES:
            loop = asyncio.get_running_loop()
            compressed = await loop.run_in_executor(None, gzip.compress, data, 1)
        else:
            compressed = gzip.compress(data, compresslevel=1)

        if len(compressed) + GZIP_SAVINGS_MIN_BYTES >= size:
            return None

        return compressed

    async def _send_output(self, websocket: WebSocket, data: bytes) -> None:
        """Send terminal output to WebSocket.

        Args:
            websocket: The WebSocket connection
            data: Output data to send
        """
        try:
            if self._binary_protocol.get(websocket, False):
                compressed = None
                if self._compression_protocol.get(websocket, False):
                    compressed = await self._maybe_compress_output(data)

                if compressed is not None:
                    await websocket.send_bytes(bytes([BIN_OUTPUT_GZIP_FRAME]) + compressed)
                else:
                    await websocket.send_bytes(bytes([BIN_OUTPUT_FRAME]) + data)
            else:
                await websocket.send_json({"type": "output", "data": data.decode("utf-8", errors="replace")})
        except Exception:
            pass

    async def _send_error(self, websocket: WebSocket, message: str) -> None:
        """Send error message to WebSocket.

        Args:
            websocket: The WebSocket connection
            message: Error message
        """
        try:
            await websocket.send_json({"type": "error", "message": message})
        except Exception:
            pass

    async def _stats_loop(self, websocket: WebSocket) -> None:
        """Send system stats periodically.

        Args:
            websocket: The WebSocket connection
        """
        while True:
            try:
                # During heavy output bursts, let terminal frames take priority.
                queue = self._output_queues.get(websocket)
                if queue and queue.qsize() > 0:
                    await asyncio.sleep(STATS_INTERVAL_HIGH_LATENCY if self._high_latency_mode.get(websocket, False) else STATS_INTERVAL)
                    continue

                await self._send_stats(websocket)
                await asyncio.sleep(STATS_INTERVAL_HIGH_LATENCY if self._high_latency_mode.get(websocket, False) else STATS_INTERVAL)
            except Exception:
                break

    async def _send_stats(self, websocket: WebSocket) -> None:
        """Send system stats to WebSocket.

        Args:
            websocket: The WebSocket connection
        """
        try:
            detailed = self._detailed_stats.get(websocket, False)
            stats = get_system_stats(detailed=detailed)
            await websocket.send_json({"type": "stats", **stats})
        except Exception:
            pass


# Global WebSocket manager instance
ws_manager = WebSocketManager()
