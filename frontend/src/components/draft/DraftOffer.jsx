function DraftOffer({ offer, loading, onSelect, onDismiss }) {
  if (!offer) return <div className="draft-empty"><span className="eyebrow">Draft room</span><h2>Choose a position on the pitch</h2><p>Reveal a historic side, then make one player your own.</p></div>;
  return <section className="draft-offer"><div className="offer-heading"><div><span className="eyebrow">{offer.tier} pool · {offer.position}</span><h2>{offer.team}</h2></div><button className="text-button" onClick={onDismiss}>Close</button></div><p>Select one player to occupy this position.</p><div className="offer-players">{offer.players.map((player) => <button key={player} disabled={loading} onClick={() => onSelect(player)}>{player}<span>Draft</span></button>)}</div></section>;
}
export default DraftOffer;
