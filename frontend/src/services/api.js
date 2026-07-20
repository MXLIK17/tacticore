const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

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
  // #region agent log
  fetch('http://127.0.0.1:7848/ingest/aac2d5c6-87a7-429e-9f99-f1df9e70d234',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c1a092'},body:JSON.stringify({sessionId:'c1a092',runId:'pre-fix',hypothesisId:'A',location:'api.js:request',message:'api payload unwrap',data:{path,rawKeys:payload&&typeof payload==='object'?Object.keys(payload):[],dataKeys:payload?.data&&typeof payload.data==='object'&&!Array.isArray(payload.data)?Object.keys(payload.data):[],rawDataStats:{wins:payload?.data?.wins,draws:payload?.data?.draws,losses:payload?.data?.losses,userRecord:payload?.data?.userRecord},nestedResultKeys:payload?.data?.result&&typeof payload.data.result==='object'?Object.keys(payload.data.result):[],nestedSeasonResultKeys:payload?.data?.seasonResult&&typeof payload.data.seasonResult==='object'?Object.keys(payload.data.seasonResult):[],unwrappedKeys:normalizedPayload&&typeof normalizedPayload==='object'&&!Array.isArray(normalizedPayload)?Object.keys(normalizedPayload):[],unwrappedStats:{wins:normalizedPayload?.wins,draws:normalizedPayload?.draws,losses:normalizedPayload?.losses,userRecord:normalizedPayload?.userRecord},unwrappedTypes:{wins:typeof normalizedPayload?.wins,draws:typeof normalizedPayload?.draws,losses:typeof normalizedPayload?.losses}},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
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
