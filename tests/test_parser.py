from backend.app.anthropic_stream_parser import ParserState, map_event


def test_text_blocks_become_separate_messages():
    state = ParserState()
    out1 = map_event(state, {"type": "content_block_start", "index": 0, "content_block": {"type": "text"}})
    out2 = map_event(state, {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}})
    out3 = map_event(state, {"type": "content_block_start", "index": 1, "content_block": {"type": "text"}})

    assert out1[0]["event_type"] == "thread.message.start"
    assert out2[0]["event_type"] == "thread.message.delta"
    assert out2[0]["message_id"] == "msg-0"
    assert out3[0]["message_id"] == "msg-1"


def test_tool_use_becomes_activity():
    state = ParserState()
    out = map_event(
        state,
        {
            "type": "content_block_start",
            "content_block": {"type": "tool_use", "name": "web_search", "input": {"q": "x"}, "id": "1"},
        },
    )
    assert out[0]["event_type"] == "activity.tool.start"
    assert out[0]["tool_name"] == "web_search"
