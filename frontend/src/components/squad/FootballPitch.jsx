import PlayerMarker from "./PlayerMarker";
import PositionPlaceholder from "./PositionPlaceholder";

function FootballPitch({ slots, players, onSlotClick }) {
  return <section className="pitch" aria-label="Squad formation on football pitch">
    <div className="pitch-atmosphere" aria-hidden="true"><span /><span /><span /></div>
    <div className="pitch-lines" aria-hidden="true"><span className="centre-line" /><span className="centre-circle" /><span className="penalty penalty-top" /><span className="penalty penalty-bottom" /><span className="goal goal-top" /><span className="goal goal-bottom" /></div>
    {slots.map((slot) => <div className="pitch-position" key={slot.id} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>{players[slot.id] ? <PlayerMarker player={players[slot.id]} onClick={() => onSlotClick(slot)} /> : <PositionPlaceholder label={slot.label} onClick={() => onSlotClick(slot)} />}</div>)}
  </section>;
}
export default FootballPitch;
