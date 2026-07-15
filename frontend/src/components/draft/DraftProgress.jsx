function DraftProgress({ filled, slots }) {
  return <section className="draft-progress" aria-label="Draft progress">
    <div className="progress-summary"><span className="eyebrow">Draft progress</span><strong>{filled}<small> / {slots.length}</small></strong></div>
    <div className="progress-track"><span style={{ width: `${(filled / slots.length) * 100}%` }} /></div>
    <div className="position-strip">{slots.map((slot) => <span key={slot.id} className={slot.filled ? "is-filled" : ""}>{slot.label}</span>)}</div>
  </section>;
}
export default DraftProgress;
