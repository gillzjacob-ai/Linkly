const state = {
  jobId: null,
  eventSource: null,
  nodes: [
    { id: "research", name: "Research Agent", x: 10, y: 14, status: "assigned" },
    { id: "ops", name: "Ops Agent", x: 70, y: 14, status: "assigned" },
    { id: "writer", name: "Writer Agent", x: 40, y: 72, status: "assigned" },
  ],
  messageEls: new Map(),
  counts: { messages: 0, activity: 0, artifacts: 0 },
};

const el = {
  canvas: document.getElementById("canvas"),
  runForm: document.getElementById("runForm"),
  clearBtn: document.getElementById("clearBtn"),
  prompt: document.getElementById("prompt"),
  apiBase: document.getElementById("apiBase"),
  thread: document.getElementById("thread"),
  activity: document.getElementById("activity"),
  artifacts: document.getElementById("artifacts"),
  status: document.getElementById("clusterStatus"),
  jobId: document.getElementById("jobId"),
  msgCount: document.getElementById("msgCount"),
  actCount: document.getElementById("actCount"),
  artifactCount: document.getElementById("artifactCount"),
  threadTpl: document.getElementById("threadItemTemplate"),
  activityTpl: document.getElementById("activityItemTemplate"),
  artifactTpl: document.getElementById("artifactItemTemplate"),
};

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function resetPanels() {
  el.thread.innerHTML = "";
  el.activity.innerHTML = "";
  el.artifacts.innerHTML = "";
  state.messageEls.clear();
  state.counts = { messages: 0, activity: 0, artifacts: 0 };
  refreshCounts();
}

function refreshCounts() {
  el.msgCount.textContent = String(state.counts.messages);
  el.actCount.textContent = String(state.counts.activity);
  el.artifactCount.textContent = String(state.counts.artifacts);
}

function setClusterStatus(status) {
  el.status.className = `chip ${status}`;
  el.status.textContent = status;
}

function paintNodes() {
  const oldNodes = el.canvas.querySelectorAll(".agent-node");
  oldNodes.forEach((node) => node.remove());

  state.nodes.forEach((agent) => {
    const node = document.createElement("article");
    node.className = "agent-node";
    node.style.left = `${agent.x}%`;
    node.style.top = `${agent.y}%`;
    node.innerHTML = `<h4>${agent.name}</h4><small>${agent.status}</small>`;
    el.canvas.appendChild(node);
  });
}

function updateNodes(status) {
  state.nodes = state.nodes.map((node) => ({ ...node, status }));
  paintNodes();
}

function addMessageStart(messageId, ts) {
  if (state.messageEls.has(messageId)) return;

  const fragment = el.threadTpl.content.cloneNode(true);
  const article = fragment.querySelector(".message-item");
  article.dataset.messageId = messageId;
  article.querySelector("time").textContent = ts ? new Date(ts).toLocaleTimeString() : now();
  el.thread.appendChild(fragment);

  const appended = el.thread.querySelector(`[data-message-id="${messageId}"]`);
  state.messageEls.set(messageId, appended);
  state.counts.messages += 1;
  refreshCounts();
}

function addMessageDelta(messageId, delta) {
  const article = state.messageEls.get(messageId);
  if (!article) return;
  article.querySelector("p").textContent += delta;
}

function addActivity(name, payload, ts) {
  const fragment = el.activityTpl.content.cloneNode(true);
  fragment.querySelector(".name").textContent = name;
  fragment.querySelector("time").textContent = ts ? new Date(ts).toLocaleTimeString() : now();
  fragment.querySelector(".payload").textContent = JSON.stringify(payload, null, 2);
  el.activity.prepend(fragment);
  state.counts.activity += 1;
  refreshCounts();
}

function addArtifact(name, kind, ts) {
  const fragment = el.artifactTpl.content.cloneNode(true);
  fragment.querySelector(".artifact-name").textContent = name;
  fragment.querySelector(".artifact-kind").textContent = kind || "artifact";
  fragment.querySelector("time").textContent = ts ? new Date(ts).toLocaleTimeString() : now();
  el.artifacts.prepend(fragment);
  state.counts.artifacts += 1;
  refreshCounts();
}

function handleEvent(event) {
  const data = JSON.parse(event.data);

  if (data.type === "thread.message.start") addMessageStart(data.message_id, data.ts);
  if (data.type === "thread.message.delta") addMessageDelta(data.message_id, data.delta || "");
  if (data.type === "activity.tool.start") addActivity(`Tool: ${data.tool_name}`, data.tool_input ?? {}, data.ts);
  if (data.type === "artifact.created") addArtifact(data.name, data.kind, data.ts);
  if (data.type === "agent.turn.complete") addActivity("Turn complete", {}, data.ts);
}

function closeStream() {
  if (!state.eventSource) return;
  state.eventSource.close();
  state.eventSource = null;
}

async function runTask(prompt) {
  closeStream();
  resetPanels();
  setClusterStatus("working");
  updateNodes("working");

  const base = el.apiBase.value.replace(/\/$/, "");
  const response = await fetch(`${base}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    setClusterStatus("failed");
    addActivity("Request failed", { status: response.status }, new Date().toISOString());
    updateNodes("failed");
    return;
  }

  const payload = await response.json();
  state.jobId = payload.job_id;
  el.jobId.textContent = state.jobId;

  state.eventSource = new EventSource(`${base}/stream/${state.jobId}`);
  state.eventSource.addEventListener("agent_event", handleEvent);
  state.eventSource.addEventListener("done", () => {
    setClusterStatus("complete");
    updateNodes("complete");
    closeStream();
  });
  state.eventSource.addEventListener("error", () => {
    setClusterStatus("failed");
    updateNodes("failed");
    addActivity("SSE stream error", {}, new Date().toISOString());
    closeStream();
  });
}

el.runForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await runTask(el.prompt.value.trim());
});

el.clearBtn.addEventListener("click", () => {
  closeStream();
  resetPanels();
  setClusterStatus("assigned");
  updateNodes("assigned");
  el.jobId.textContent = "-";
});

paintNodes();
