const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function unwrapPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return unwrapPayload(payload.data);
  }
  if (payload.result && typeof payload.result === "object" && !Array.isArray(payload.result)) {
    return unwrapPayload(payload.result);
  }
  if (payload.seasonResult && typeof payload.seasonResult === "object" && !Array.isArray(payload.seasonResult)) {
    return unwrapPayload(payload.seasonResult);
  }
  if (payload.worldCup && typeof payload.worldCup === "object" && !Array.isArray(payload.worldCup)) {
    return unwrapPayload(payload.worldCup);
  }
  return payload;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  const normalizedPayload = unwrapPayload(payload);
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Something went wrong. Please try again.");
  }

  return normalizedPayload;
}

export const draftService = {
  spin: (position, mode) => request("/api/draft/spin", { method: "POST", body: JSON.stringify({ position, mode }) }),
  select: (position, player) => request("/api/draft/select", { method: "POST", body: JSON.stringify({ position, player }) }),
  reset: () => request("/api/draft/reset", { method: "POST" }),
};

export const competitionService = {
  simulateSeason: (team) => request("/api/season/simulate", { method: "POST", body: JSON.stringify({ team }) }),
  startWorldCup: (team) => request("/api/tournament/worldcup/start", { method: "POST", body: JSON.stringify({ team }) }),
  nextWorldCupMatch: () => request("/api/tournament/worldcup/next", { method: "POST" }),
};
