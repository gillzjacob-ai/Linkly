from __future__ import annotations

from asyncio import Lock
from typing import Dict

from .models import Job


class JobStore:
    def __init__(self) -> None:
        self._jobs: Dict[str, Job] = {}
        self._lock = Lock()

    async def create(self, prompt: str) -> Job:
        job = Job(prompt=prompt)
        async with self._lock:
            self._jobs[job.id] = job
        return job

    async def get(self, job_id: str) -> Job | None:
        async with self._lock:
            return self._jobs.get(job_id)


store = JobStore()
