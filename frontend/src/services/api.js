const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Something went wrong. Please try again.");
  }
  return payload.data;
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
