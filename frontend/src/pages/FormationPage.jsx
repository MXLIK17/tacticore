import FootballPitch from "../components/squad/FootballPitch";
import FormationSelector from "../components/squad/FormationSelector";
import { FORMATIONS } from "../utils/formations";

const formationNotes = {
  "4-3-3": "Width in attack with a balanced midfield triangle.",
  "4-4-2": "A classic, direct shape with two players leading the line.",
  "3-5-2": "Control the centre of the pitch and attack in pairs.",
};

function FormationPage({ formation, onChange, onContinue, onBack }) {
  const previewSlots = FORMATIONS[formation];
  return <div className="formation-page page-wrap">
    <section className="formation-copy">
      <span className="eyebrow">Step 02 · Choose your shape</span>
      <h1>Set the stage<br />for your XI.</h1>
      <p>Your formation decides the tactical canvas for every selection that follows.</p>
      <FormationSelector value={formation} onChange={onChange} />
      <div className="formation-note"><span>Selected shape</span><strong>{formation}</strong><p>{formationNotes[formation]}</p></div>
      <div className="formation-actions"><button className="secondary-button" onClick={onBack}>Back</button><button className="primary-button" onClick={onContinue}>Start drafting <span>→</span></button></div>
    </section>
    <div className="formation-preview"><span className="preview-label">Tactical board preview</span><FootballPitch slots={previewSlots} players={{}} onSlotClick={() => {}} /></div>
  </div>;
}

export default FormationPage;
