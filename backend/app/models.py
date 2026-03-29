from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import uuid4


class JobStatus(str, Enum):
    ASSIGNED = "assigned"
    WORKING = "working"
    COMPLETE = "complete"
    FAILED = "failed"


@dataclass
class AgentEvent:
    event_type: str
    payload: dict[str, Any]
    ts: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class Job:
    prompt: str
    id: str = field(default_factory=lambda: str(uuid4()))
    status: JobStatus = JobStatus.ASSIGNED
    events: list[AgentEvent] = field(default_factory=list)
    final_output: str | None = None
    error: str | None = None

    def push(self, event_type: str, **payload: Any) -> None:
        self.events.append(AgentEvent(event_type=event_type, payload=payload))
