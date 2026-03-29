"""Translate Anthropic-style SSE stream events into Clustor UI events.

Core rule: each text content block is emitted as a distinct message thread entry.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class ParserState:
    open_text_block_index: int | None = None


def map_event(state: ParserState, event: dict[str, Any]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    et = event.get("type")

    if et == "content_block_start":
        block = event.get("content_block", {})
        if block.get("type") == "text":
            idx = event.get("index", 0)
            state.open_text_block_index = idx
            out.append(
                {
                    "event_type": "thread.message.start",
                    "message_id": f"msg-{idx}",
                    "role": "assistant",
                    "content": "",
                }
            )
        elif block.get("type") == "tool_use":
            out.append(
                {
                    "event_type": "activity.tool.start",
                    "tool_name": block.get("name"),
                    "tool_input": block.get("input", {}),
                    "tool_use_id": block.get("id"),
                }
            )

    elif et == "content_block_delta":
        delta = event.get("delta", {})
        if delta.get("type") == "text_delta":
            idx = event.get("index", state.open_text_block_index or 0)
            out.append(
                {
                    "event_type": "thread.message.delta",
                    "message_id": f"msg-{idx}",
                    "delta": delta.get("text", ""),
                }
            )

    elif et == "content_block_stop":
        idx = event.get("index", state.open_text_block_index or 0)
        out.append(
            {
                "event_type": "thread.message.stop",
                "message_id": f"msg-{idx}",
            }
        )

    elif et == "message_stop":
        out.append({"event_type": "agent.turn.complete"})

    return out
