import { useMemo, useState } from "react";
import { competitionService, draftService } from "../services/api";
import { FORMATIONS } from "../utils/formations";

const getPresentationRating = (name) => 82 + [...name].reduce((total, character) => total + character.charCodeAt(0), 0) % 14;
const defaultPlayer = (name, position) => ({ name, position, overall: getPresentationRating(name) });

function normalizeCompetitionPayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return normalizeCompetitionPayload(payload.data);
  }
  if (payload.result && typeof payload.result === "object" && !Array.isArray(payload.result)) {
    return normalizeCompetitionPayload(payload.result);
  }
  return payload;
}

function normalizeSeasonResult(payload) {
  const result = normalizeCompetitionPayload(payload);
  if (!result || typeof result !== "object") return null;

  const goals = result.goals && typeof result.goals === "object" ? result.goals : {};
  const userTableRow = Array.isArray(result.table)
    ? result.table.find((row) => row.team === (result.teamName || "TactiCore XI"))
    : null;
  // #region agent log
  fetch('http://127.0.0.1:7848/ingest/aac2d5c6-87a7-429e-9f99-f1df9e70d234',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c1a092'},body:JSON.stringify({sessionId:'c1a092',runId:'pre-fix',hypothesisId:'B',location:'useDraft.js:normalizeSeasonResult',message:'season normalize input',data:{resultKeys:Object.keys(result),topLevel:{wins:result.wins,draws:result.draws,losses:result.losses,played:result.played},topLevelTypes:{wins:typeof result.wins,draws:typeof result.draws,losses:typeof result.losses},isFinite:{wins:Number.isFinite(result.wins),draws:Number.isFinite(result.draws),losses:Number.isFinite(result.losses)},tableRow:userTableRow?{wins:userTableRow.wins,draws:userTableRow.draws,losses:userTableRow.losses,played:userTableRow.played}:null,matchesCount:Array.isArray(result.matches)?result.matches.length:null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return {
    ...result,
    teamName: result.teamName || "TactiCore XI",
    played: Number.isFinite(result.played) ? result.played : 38,
    position: Number.isFinite(result.position) ? result.position : 20,
    wins: Number.isFinite(result.wins) ? result.wins : 0,
    draws: Number.isFinite(result.draws) ? result.draws : 0,
    losses: Number.isFinite(result.losses) ? result.losses : 0,
    goalsFor: Number.isFinite(result.goalsFor) ? result.goalsFor : (Number.isFinite(goals.scored) ? goals.scored : 0),
    goalsAgainst: Number.isFinite(result.goalsAgainst) ? result.goalsAgainst : (Number.isFinite(goals.conceded) ? goals.conceded : 0),
    points: Number.isFinite(result.points) ? result.points : 0,
    table: Array.isArray(result.table) ? result.table : [],
    matches: Array.isArray(result.matches) ? result.matches : [],
    topScorer: result.topScorer ?? null,
    topAssister: result.topAssister ?? null,
    seasonRating: result.seasonRating ?? null,
  };
}

function normalizeWorldCupResult(payload, previous = null) {
  const result = normalizeCompetitionPayload(payload);
  if (!result || typeof result !== "object") return previous;

  // #region agent log
  fetch('http://127.0.0.1:7848/ingest/aac2d5c6-87a7-429e-9f99-f1df9e70d234',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c1a092'},body:JSON.stringify({sessionId:'c1a092',runId:'pre-fix',hypothesisId:'D',location:'useDraft.js:normalizeWorldCupResult',message:'world cup normalize input',data:{resultKeys:Object.keys(result),incomingUserRecord:result.userRecord,previousUserRecord:previous?.userRecord,phase:result.phase,groupMatchday:result.groupMatchday},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return {
    ...(previous || {}),
    ...result,
    userRecord: {
      ...(previous?.userRecord || {}),
      ...(result.userRecord || {}),
    },
    awards: {
      ...(previous?.awards || {}),
      ...(result.awards || {}),
    },
    groups: result.groups || previous?.groups || {},
    bracket: Array.isArray(result.bracket) ? result.bracket : (previous?.bracket || []),
    history: Array.isArray(result.history) ? result.history : (previous?.history || []),
    qualifiedTeams: Array.isArray(result.qualifiedTeams) ? result.qualifiedTeams : (previous?.qualifiedTeams || []),
  };
}

export function useDraft() {
  const [mode, setMode] = useState("premier");
  const [formation, setFormation] = useState("4-3-3");
  const [players, setPlayers] = useState({});
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seasonResult, setSeasonResult] = useState(null);
  const [worldCup, setWorldCup] = useState(null);

  const slots = FORMATIONS[formation];
  const filled = Object.keys(players).length;
  const team = useMemo(() => ({ name: "TactiCore XI", players: Object.values(players) }), [players]);

  const clearDraft = () => { setPlayers({}); setOffer(null); setSeasonResult(null); setWorldCup(null); setError(""); };
  const changeMode = (next) => { if (next !== mode) { setMode(next); clearDraft(); } };
  const changeFormation = (next) => { setFormation(next); clearDraft(); };
  const spin = async (slot) => {
    setLoading(true); setError("");
    try { setOffer({ ...(await draftService.spin(slot.apiPosition, mode)), slotId: slot.id }); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  const select = async (name) => {
    if (!offer) return;
    const player = defaultPlayer(name, offer.position);
    setLoading(true); setError("");
    try { await draftService.select(offer.position, player); setPlayers((current) => ({ ...current, [offer.slotId]: player })); setOffer(null); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  const reset = async () => { try { await draftService.reset(); } catch { /* local reset still restores the builder */ } clearDraft(); };
  const simulateSeason = async () => {
    setLoading(true); setError("");
    try {
      const response = await competitionService.simulateSeason(team);
      const normalized = normalizeSeasonResult(response);
      // #region agent log
      fetch('http://127.0.0.1:7848/ingest/aac2d5c6-87a7-429e-9f99-f1df9e70d234',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c1a092'},body:JSON.stringify({sessionId:'c1a092',runId:'pre-fix',hypothesisId:'C',location:'useDraft.js:simulateSeason',message:'season state stored',data:{stored:{wins:normalized?.wins,draws:normalized?.draws,losses:normalized?.losses,played:normalized?.played,points:normalized?.points}},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setSeasonResult(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const startWorldCup = async () => {
    setLoading(true); setError("");
    try {
      const response = await competitionService.startWorldCup(team);
      setWorldCup(normalizeWorldCupResult(response));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const nextWorldCupMatch = async () => {
    setLoading(true); setError("");
    try {
      const response = await competitionService.nextWorldCupMatch();
      setWorldCup((current) => {
        const normalized = normalizeWorldCupResult(response, current);
        // #region agent log
        fetch('http://127.0.0.1:7848/ingest/aac2d5c6-87a7-429e-9f99-f1df9e70d234',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c1a092'},body:JSON.stringify({sessionId:'c1a092',runId:'pre-fix',hypothesisId:'D',location:'useDraft.js:nextWorldCupMatch',message:'world cup state stored',data:{storedUserRecord:normalized?.userRecord,phase:normalized?.phase,groupMatchday:normalized?.groupMatchday},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        return normalized;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { mode, setMode: changeMode, formation, changeFormation, slots, players, offer, loading, error, filled, team, spin, select, reset, seasonResult, simulateSeason, worldCup, startWorldCup, nextWorldCupMatch };
}
