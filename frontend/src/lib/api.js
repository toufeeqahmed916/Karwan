// ALL network calls live here. Pages never call fetch directly (TEAM_PLAN section 4).
// Mock mode: VITE_USE_MOCKS=true. Flip a single feature to the real API with MOCK_OFF below.
import requestsMock from "../mocks/requests.json";
import depotsMock from "../mocks/depots.json";
import dashboardMock from "../mocks/dashboard.json";
import weightsMock from "../mocks/weights.json";
import { rescoreAll, scoreRequest } from "./mockScore.js";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

// Turn mocks off per feature as Person C finishes endpoints, e.g. new Set(["requests"])
const MOCK_OFF = new Set([]);
const mocked = (feature) => USE_MOCKS && !MOCK_OFF.has(feature);

async function http(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(json.error?.message || "Request failed");
    e.code = json.error?.code;
    throw e;
  }
  return json.data;
}
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const clone = (x) => JSON.parse(JSON.stringify(x));

// In-memory mock state (resets on page reload)
const db = {
  requests: clone(requestsMock),
  depots: clone(depotsMock),
  weights: clone(weightsMock),
};

/* ---------- Requests ---------- */
export async function getRequests(filters = {}) {
  if (!mocked("requests")) {
    const q = new URLSearchParams(filters).toString();
    return http("/requests" + (q ? "?" + q : ""));
  }
  await wait();
  let list = rescoreAll(db.requests, db.weights);
  if (filters.status) list = list.filter((r) => r.status === filters.status);
  if (filters.urgency) list = list.filter((r) => r.urgency === filters.urgency);
  return clone(list);
}

export async function createRequest(body) {
  if (!mocked("requests")) return http("/requests", { method: "POST", body });
  await wait();
  const bad = (m) => Object.assign(new Error(m), { code: "VALIDATION_ERROR" });
  if (body.lat == null || body.lng == null) throw bad("Pick a location on the map");
  if (!(body.population > 0)) throw bad("Population must be greater than 0");
  if (!body.items?.length) throw bad("Add at least one supply");
  const r = {
    id: "req_" + Math.random().toString(36).slice(2, 8),
    ...body, status: "pending", hoursWaiting: 0, createdAt: new Date().toISOString(),
    items: body.items.map((i) => ({ ...i, qtyAllocated: 0 })), fulfilmentPct: 0,
  };
  db.requests.push(r);
  const maxPop = Math.max(...db.requests.map((x) => x.population));
  r.score = scoreRequest(r, db.weights, maxPop);
  return clone(r);
}

export async function getRequest(id) {
  if (!mocked("requests")) return http("/requests/" + id);
  await wait(100);
  const r = db.requests.find((x) => x.id === id);
  if (!r) throw Object.assign(new Error("Request not found"), { code: "NOT_FOUND" });
  const scored = rescoreAll(db.requests, db.weights).find((x) => x.id === id);
  return clone({ ...scored, tracking: [] });
}

/* ---------- Weights ---------- */
export async function getWeights() {
  if (!mocked("weights")) return http("/settings/weights");
  return clone(db.weights);
}
export async function putWeights(weights) {
  if (!mocked("weights")) return http("/settings/weights", { method: "PUT", body: weights });
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 1) > 0.15) throw Object.assign(new Error("Weights must add up to 100%"), { code: "VALIDATION_ERROR" });
  db.weights = Object.fromEntries(Object.entries(weights).map(([k, v]) => [k, v / sum]));
  return { weights: clone(db.weights), requests: clone(rescoreAll(db.requests, db.weights)) };
}

/* ---------- Depots / dashboard (read only for now; used by the map and form) ---------- */
export async function getDepots() {
  if (!mocked("depots")) return http("/depots");
  await wait(100);
  return clone(db.depots);
}
export async function getDashboard() {
  if (!mocked("dashboard")) return http("/dashboard");
  await wait(100);
  return clone(dashboardMock);
}

/* ---------- Demo reset ---------- */
export async function resetDemo() {
  if (!mocked("reset")) return http("/seed/reset", { method: "POST", body: {} });
  db.requests = clone(requestsMock);
  db.depots = clone(depotsMock);
  db.weights = clone(weightsMock);
  return { ok: true };
}
