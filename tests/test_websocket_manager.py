"""Tests for websocket transport optimizations."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest

from webterm.api.websocket import (
    BIN_INPUT_GZIP_FRAME,
    BIN_OUTPUT_FRAME,
    BIN_OUTPUT_GZIP_FRAME,
    WebSocketManager,
)


class TestWebSocketCompression:
    """Coverage for gzip transport behavior."""

    def setup_method(self):
        self.manager = WebSocketManager()

    @pytest.mark.asyncio
    async def test_send_output_uses_gzip_when_negotiated(self):
        websocket = AsyncMock()
        payload = ("x" * 4096).encode("utf-8")

        self.manager._binary_protocol[websocket] = True
        self.manager._compression_protocol[websocket] = True

        await self.manager._send_output(websocket, payload)

        websocket.send_bytes.assert_awaited_once()
        sent_frame = websocket.send_bytes.await_args.args[0]
        assert sent_frame[0] == BIN_OUTPUT_GZIP_FRAME

    @pytest.mark.asyncio
    async def test_send_output_falls_back_to_raw_binary(self):
        websocket = AsyncMock()
        payload = b"echo hi\n"

        self.manager._binary_protocol[websocket] = True
        self.manager._compression_protocol[websocket] = True

        await self.manager._send_output(websocket, payload)

        websocket.send_bytes.assert_awaited_once()
        sent_frame = websocket.send_bytes.await_args.args[0]
        assert sent_frame[0] == BIN_OUTPUT_FRAME

    @pytest.mark.asyncio
    async def test_handle_binary_gzip_input_decompresses(self):
        websocket = AsyncMock()
        session = SimpleNamespace(pty=SimpleNamespace(write=AsyncMock()), touch=Mock())

        import gzip

        raw = b"ls -la\n"
        frame = bytes([BIN_INPUT_GZIP_FRAME]) + gzip.compress(raw, compresslevel=1)

        await self.manager._handle_binary_message(websocket, session, frame)

        session.pty.write.assert_awaited_once_with(raw)
        session.touch.assert_called_once()
