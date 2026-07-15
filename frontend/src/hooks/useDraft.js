import { useMemo, useState } from "react";
import { competitionService, draftService } from "../services/api";
import { FORMATIONS } from "../utils/formations";

const getPresentationRating = (name) => 82 + [...name].reduce((total, character) => total + character.charCodeAt(0), 0) % 14;
const defaultPlayer = (name, position) => ({ name, position, overall: getPresentationRating(name) });

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
  const simulateSeason = async () => { setLoading(true); setError(""); try { setSeasonResult(await competitionService.simulateSeason(team)); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  const startWorldCup = async () => { setLoading(true); setError(""); try { setWorldCup(await competitionService.startWorldCup(team)); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  const nextWorldCupMatch = async () => { setLoading(true); try { setWorldCup(await competitionService.nextWorldCupMatch()); } catch (err) { setError(err.message); } finally { setLoading(false); } };

  return { mode, setMode: changeMode, formation, changeFormation, slots, players, offer, loading, error, filled, team, spin, select, reset, seasonResult, simulateSeason, worldCup, startWorldCup, nextWorldCupMatch };
}
