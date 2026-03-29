# Clustor (MVP Scaffold)

Clustor is a supervised multi-agent platform where users oversee autonomous agents from a spatial canvas.

This repository now contains an implementation-focused MVP scaffold of the core product loop:

- **Async job dispatch** (`POST /chat`)
- **Event stream transport** (`GET /stream/{job_id}` via SSE)
- **Agent event architecture mapping** from Anthropic-style streaming events to UI surfaces
- **Spatial canvas UI** with thread messages, activity rail, and status chips

## Repository Layout

- `backend/app/main.py` — FastAPI service with async jobs, result polling, and SSE stream
- `backend/app/anthropic_stream_parser.py` — maps Anthropic SSE events into Clustor UI events
- `backend/app/models.py` — job + event models
- `backend/app/store.py` — in-memory async store
- `frontend/index.html` — lightweight spatial canvas + live event rendering
- `tests/` — parser and API tests

## Local Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt pytest
uvicorn backend.app.main:app --reload
```

Open `frontend/index.html` in a browser and run a task.

## API Contract (MVP)

### `POST /chat`
Creates a new agent job and starts background execution.

Request:
```json
{ "prompt": "Build a GTM plan for Clustor" }
```

Response:
```json
{ "job_id": "...", "status": "assigned" }
```

### `GET /stream/{job_id}`
SSE stream of agent events.

Primary event types:
- `thread.message.start`
- `thread.message.delta`
- `thread.message.stop`
- `activity.tool.start`
- `artifact.created`
- `agent.turn.complete`

### `GET /result/{job_id}`
Returns final status + complete event log.

## Notes

This is a strong MVP foundation for the "agents feel alive" blocker because it preserves text block boundaries and separates tool activity from conversational thread messages.


## Frontend Run

Use a static server so module imports work:

```bash
python -m http.server 4173 --directory frontend
```

Then open `http://localhost:4173`.
