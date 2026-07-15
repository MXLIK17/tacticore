const formations = ["4-3-3", "4-4-2", "3-5-2"];
function FormationSelector({ value, onChange }) { return <div className="formation-selector" role="group" aria-label="Formation">{formations.map((formation) => <button key={formation} className={value === formation ? "is-selected" : ""} onClick={() => onChange(formation)}>{formation}</button>)}</div>; }
export default FormationSelector;
