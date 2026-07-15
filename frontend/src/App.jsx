import { useState } from "react";
import AppShell from "./components/layout/AppShell";
import { useDraft } from "./hooks/useDraft";
import DraftPage from "./pages/DraftPage";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import SimulationPage from "./pages/SimulationPage";
import SquadPage from "./pages/SquadPage";

function App() {
  const [page, setPage] = useState("home");
  const draft = useDraft();

  const openSquad = () => setPage("squad");
  const openDraft = () => setPage("draft");

  const pages = {
    home: <HomePage mode={draft.mode} onModeChange={draft.setMode} onStart={openSquad} />,
    squad: <SquadPage {...draft} onDraft={openDraft} onSimulate={() => setPage("simulation")} />,
    draft: <DraftPage {...draft} onBack={openSquad} />,
    simulation: <SimulationPage {...draft} onResults={() => setPage("results")} />,
    results: <ResultsPage {...draft} onBuildAgain={openSquad} />,
  };

  return (
    <AppShell activePage={page} onNavigate={setPage} mode={draft.mode}>
      {pages[page]}
    </AppShell>
  );
}

export default App;
