function DraftOffer({ offer, loading, onSelect, onDismiss }) {
  if (!offer) return <div className="draft-empty"><div className="archive-mark">TC</div><span className="eyebrow">The archive is ready</span><h2>Pick your next<br />position.</h2><p>Select a marker on the pitch to reveal a historic team and make the next call.</p></div>;
  return <section className="draft-offer"><div className="offer-heading"><div><span className="eyebrow">{offer.tier} pool · {offer.position}</span><h2>{offer.team}</h2></div><button className="text-button" onClick={onDismiss}>Return</button></div><p>One player earns a place in your starting XI.</p><div className="offer-players">{offer.players.map((player, index) => <button key={player} disabled={loading} onClick={() => onSelect(player)}><span className="offer-number">0{index + 1}</span><strong>{player}</strong><span className="draft-action">Choose <b>→</b></span></button>)}</div></section>;
}
export default DraftOffer;
