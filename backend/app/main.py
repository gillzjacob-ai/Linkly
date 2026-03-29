from __future__ import annotations

import asyncio
import json
from typing import AsyncIterator

from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .anthropic_stream_parser import ParserState, map_event
from .models import JobStatus
from .store import store

app = FastAPI(title="Clustor API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    prompt: str


def _mock_anthropic_events(prompt: str) -> list[dict]:
    return [
        {"type": "content_block_start", "index": 0, "content_block": {"type": "text"}},
        {
            "type": "content_block_delta",
            "index": 0,
            "delta": {"type": "text_delta", "text": f"Got it — I will tackle: {prompt[:100]}"},
        },
        {"type": "content_block_stop", "index": 0},
        {
            "type": "content_block_start",
            "index": 1,
            "content_block": {
                "type": "tool_use",
                "id": "tool-1",
                "name": "web_search",
                "input": {"query": "competitive landscape multi-agent platforms"},
            },
        },
        {"type": "content_block_start", "index": 2, "content_block": {"type": "text"}},
        {
            "type": "content_block_delta",
            "index": 2,
            "delta": {
                "type": "text_delta",
                "text": "I found a consistent pattern: users value transparent activity trails and iterative follow-up.",
            },
        },
        {"type": "content_block_stop", "index": 2},
        {"type": "content_block_start", "index": 3, "content_block": {"type": "text"}},
        {
            "type": "content_block_delta",
            "index": 3,
            "delta": {
                "type": "text_delta",
                "text": "Next I will synthesize architecture and produce implementation-ready tasks.",
            },
        },
        {"type": "content_block_stop", "index": 3},
        {"type": "message_stop"},
    ]


async def run_job(job_id: str) -> None:
    job = await store.get(job_id)
    if not job:
        return
    job.status = JobStatus.WORKING
    state = ParserState()
    try:
        for raw_event in _mock_anthropic_events(job.prompt):
            ui_events = map_event(state, raw_event)
            for ev in ui_events:
                job.push(ev["event_type"], **ev)
            await asyncio.sleep(0.15)
        job.final_output = (
            "Clustor MVP generated an event-driven chat stream, activity rail, and spatial node state lifecycle."
        )
        job.push("artifact.created", name="execution_report.md", kind="markdown")
        job.status = JobStatus.COMPLETE
    except Exception as exc:  # pragma: no cover
        job.status = JobStatus.FAILED
        job.error = str(exc)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat")
async def chat(req: ChatRequest, background_tasks: BackgroundTasks) -> dict[str, str]:
    job = await store.create(req.prompt)
    background_tasks.add_task(run_job, job.id)
    return {"job_id": job.id, "status": job.status.value}


@app.get("/result/{job_id}")
async def result(job_id: str) -> dict:
    job = await store.get(job_id)
    if not job:
        raise HTTPException(404, "job not found")
    return {
        "job_id": job.id,
        "status": job.status.value,
        "events": [{"type": e.event_type, **e.payload, "ts": e.ts} for e in job.events],
        "final_output": job.final_output,
        "error": job.error,
    }


@app.get("/stream/{job_id}")
async def stream(job_id: str) -> StreamingResponse:
    async def event_source() -> AsyncIterator[str]:
        cursor = 0
        while True:
            job = await store.get(job_id)
            if not job:
                yield "event: error\ndata: {\"error\":\"job not found\"}\n\n"
                break

            while cursor < len(job.events):
                payload = {
                    "type": job.events[cursor].event_type,
                    **job.events[cursor].payload,
                    "ts": job.events[cursor].ts,
                }
                yield f"event: agent_event\ndata: {json.dumps(payload)}\n\n"
                cursor += 1

            if job.status in {JobStatus.COMPLETE, JobStatus.FAILED}:
                yield "event: done\ndata: {}\n\n"
                break
            await asyncio.sleep(0.2)

    return StreamingResponse(event_source(), media_type="text/event-stream")
