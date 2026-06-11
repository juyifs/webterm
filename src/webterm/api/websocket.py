"""WebSocket connection manager for webterm."""

import asyncio
import json
from typing import Optional

from fastapi import WebSocket, WebSocketDisconnect

from webterm.core.session import Session, session_manager
from webterm.core.stats import get_system_stats
from webterm.logger import get_logger

logger = get_logger("websocket")

STATS_INTERVAL = 2.0  # seconds between stats updates
OUTPUT_BATCH_WINDOW = 0.004  # seconds to coalesce PTY output burst
OUTPUT_BATCH_MAX_BYTES = 64 * 1024
OUTPUT_BATCH_WINDOW_MIN = 0.002
OUTPUT_BATCH_WINDOW_MAX = 0.012
PROTOCOL_VERSION = 2
BIN_OUTPUT_FRAME = 0x01
BIN_INPUT_FRAME = 0x10


class WebSocketManager:
    """Manages WebSocket connections and bridges them to PTY sessions."""

    def __init__(self):
        """Initialize the WebSocket manager."""
        self._detailed_stats: dict[WebSocket, bool] = {}
        self._binary_protocol: dict[WebSocket, bool] = {}
        self._output_batch_window: dict[WebSocket, float] = {}

    async def handle_connection(self, websocket: WebSocket) -> None:
        """Handle a WebSocket connection.

        Args:
            websocket: The WebSocket connection
        """
        await websocket.accept()
        session: Optional[Session] = None

        try:
            # Create a new session
            session = await session_manager.create_session()
            if not session:
                await self._send_error(websocket, "Failed to create session (limit reached)")
                await websocket.close()
                return

            logger.info(f"WebSocket connected, session {session.id}")

            # Initialize detailed stats state for this connection
            self._detailed_stats[websocket] = False
            self._binary_protocol[websocket] = False
            self._output_batch_window[websocket] = OUTPUT_BATCH_WINDOW

            output_queue: asyncio.Queue[bytes] = asyncio.Queue(maxsize=128)

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
            self._output_batch_window.pop(websocket, None)
            if session:
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

        await self._send_error(websocket, "Session terminated")

    async def _enqueue_output(self, output_queue: asyncio.Queue[bytes], payload: bytes) -> None:
        """Queue PTY output for websocket sending.

        When queue is full, append to the newest queued chunk to avoid blocking input path.
        """
        if not payload:
            return

        try:
            output_queue.put_nowait(payload)
        except asyncio.QueueFull:
            try:
                latest = output_queue.get_nowait()
                merged = latest + payload
                output_queue.put_nowait(merged)
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

            started = loop.time()
            await self._send_output(websocket, payload)
            send_latency = loop.time() - started
            self._adapt_output_batch_window(websocket, send_latency)

    def _adapt_output_batch_window(self, websocket: WebSocket, send_latency: float) -> None:
        """Adapt PTY read-side batching window by websocket send latency."""
        current = self._output_batch_window.get(websocket, OUTPUT_BATCH_WINDOW)

        if send_latency > 0.008:
            current = min(OUTPUT_BATCH_WINDOW_MAX, current + 0.001)
        elif send_latency < 0.003:
            current = max(OUTPUT_BATCH_WINDOW_MIN, current - 0.0005)

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
            self._binary_protocol[websocket] = binary_requested
            await websocket.send_json(
                {
                    "type": "protocol",
                    "version": PROTOCOL_VERSION,
                    "binary": binary_requested,
                }
            )

        elif msg_type == "ping":
            # RTT probe for client-side adaptive input batching.
            await websocket.send_json({"type": "pong", "t": message.get("t")})

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
        else:
            logger.warning(f"Unknown binary frame type: {frame_type}")

    async def _send_output(self, websocket: WebSocket, data: bytes) -> None:
        """Send terminal output to WebSocket.

        Args:
            websocket: The WebSocket connection
            data: Output data to send
        """
        try:
            if self._binary_protocol.get(websocket, False):
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
                await self._send_stats(websocket)
                await asyncio.sleep(STATS_INTERVAL)
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
