import Jersey from "./Jersey";
import RatingBadge from "./RatingBadge";
import { getInitials } from "../../utils/formations";

function PlayerMarker({ player, onClick }) {
  return <button className="player-marker" onClick={onClick} aria-label={`${player.name}, overall ${player.overall}. Change player`}>
    <span className="jersey-wrap"><Jersey initials={getInitials(player.name)} /><RatingBadge rating={player.overall} /></span>
    <span className="player-name">{player.name}</span>
  </button>;
}
export default PlayerMarker;
