import DraftOffer from "../components/draft/DraftOffer";
import FootballPitch from "../components/squad/FootballPitch";

function DraftPage({ slots, players, offer, loading, error, spin, select, onBack }) { return <div className="draft-page page-wrap"><section className="page-heading compact"><div><span className="eyebrow">Squad draft</span><h1>Make the call.</h1></div><button className="secondary-button" onClick={onBack}>Back to pitch</button></section><div className="draft-layout"><FootballPitch slots={slots} players={players} onSlotClick={spin} /><div>{loading && <p className="loading-message">Contacting the archive…</p>}{error && <p className="error-message">{error}</p>}<DraftOffer offer={offer} loading={loading} onSelect={select} onDismiss={() => onBack()} /></div></div></div>; }
export default DraftPage;
