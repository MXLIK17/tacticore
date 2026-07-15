import FootballPitch from "../components/squad/FootballPitch";
import FormationSelector from "../components/squad/FormationSelector";

function SquadPage({ mode, formation, changeFormation, slots, players, filled, spin, loading, error, onDraft, onSimulate }) {
  const handleSlot = (slot) => { spin(slot); onDraft(); };
  return <div className="squad-page page-wrap"><section className="page-heading"><div><span className="eyebrow">{mode === "premier" ? "Premier League draft" : "World Cup draft"}</span><h1>Your starting XI</h1></div><div className="squad-meta"><span>{filled} <small>/ 11 drafted</small></span><FormationSelector value={formation} onChange={changeFormation} /></div></section><div className="squad-layout"><FootballPitch slots={slots} players={players} onSlotClick={handleSlot} /><aside className="squad-sidebar"><span className="eyebrow">Squad status</span><h2>{filled === 11 ? "Your XI is ready" : `${11 - filled} positions to fill`}</h2><p>{filled === 11 ? "Take your team into competition when you are ready." : "Select a circle on the pitch to reveal a historic team."}</p>{error && <p className="error-message">{error}</p>}<button className="primary-button" disabled={loading} onClick={onDraft}>{filled === 11 ? "Review your draft" : "Continue drafting"}</button><button className="secondary-button" disabled={filled !== 11} onClick={onSimulate}>Simulate competition</button></aside></div></div>;
}
export default SquadPage;
