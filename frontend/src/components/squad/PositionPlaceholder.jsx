function PositionPlaceholder({ label, onClick }) { return <button className="position-placeholder" onClick={onClick} aria-label={`Draft a ${label}`}><span>{label}</span></button>; }
export default PositionPlaceholder;
