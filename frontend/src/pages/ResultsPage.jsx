import LeagueTable from "../components/results/LeagueTable";
import WorldCupBracket from "../components/results/WorldCupBracket";

function ResultsPage({ mode, seasonResult, worldCup, onBuildAgain }) {
  const isWorldCup = mode === "worldcup";
  const ready = isWorldCup ? worldCup?.finished : seasonResult;
  if (!ready) return <div className="results-page page-wrap"><span className="eyebrow">Competition results</span><section className="results-empty"><h1>No final whistle yet.</h1><p>Take your completed squad into a competition to create its story.</p><button className="primary-button" onClick={onBuildAgain}>Return to squad</button></section></div>;

  if (isWorldCup && worldCup.eliminated) {
    const { wins = 0, draws = 0, losses = 0 } = worldCup.userRecord || {};
    return <div className="results-page page-wrap"><section className="season-result-hero"><div><span className="eyebrow">FIFA World Cup</span><h1>Tournament over</h1><p>{worldCup.eliminationReason || "Your World Cup run has ended."}</p></div><div className="result-points"><strong>{wins}-{draws}-{losses}</strong><span>Your record</span></div></section><aside className="season-statistics"><span className="eyebrow">Squad statistics</span><h2>The campaign</h2><div className="result-stats"><span><strong>{wins}</strong>Wins</span><span><strong>{draws}</strong>Draws</span><span><strong>{losses}</strong>Losses</span></div>{worldCup.awards?.goldenBoot && <div className="award-line"><span>Top scorer</span><strong>{worldCup.awards.goldenBoot.name}</strong></div>}{worldCup.awards?.topAssister && <div className="award-line"><span>Top assister</span><strong>{worldCup.awards.topAssister.name}</strong></div>}</aside><button className="primary-button" onClick={onBuildAgain}>Build another XI <span>→</span></button></div>;
  }

  if (isWorldCup) return <div className="results-page page-wrap"><section className="champion-banner"><span className="eyebrow">FIFA World Cup</span><p>Champions of the world</p><h1>{worldCup.champion}</h1><span className="champion-mark">★</span></section><div className="worldcup-results-grid"><WorldCupBracket bracket={worldCup.bracket} /><section className="group-summary"><span className="eyebrow">Your tournament</span><h2>World Cup run</h2><div className="result-stats"><span><strong>{worldCup.userRecord?.wins ?? 0}</strong>Wins</span><span><strong>{worldCup.userRecord?.draws ?? 0}</strong>Draws</span><span><strong>{worldCup.userRecord?.losses ?? 0}</strong>Losses</span></div>{worldCup.awards?.goldenBoot && <div className="award-line"><span>Golden Boot</span><strong>{worldCup.awards.goldenBoot.name}</strong></div>}</section></div><button className="primary-button" onClick={onBuildAgain}>Build another XI <span>→</span></button></div>;

  const teamName = seasonResult.teamName || "TactiCore XI";
  const focusedTable = (seasonResult.table || []).filter((row) => Math.abs(row.position - seasonResult.position) <= 2);

  return <div className="results-page page-wrap"><section className="season-result-hero"><div><span className="eyebrow">Premier League season complete</span><h1>{seasonResult.position}<sup>{seasonResult.position === 1 ? "st" : seasonResult.position === 2 ? "nd" : seasonResult.position === 3 ? "rd" : "th"}</sup> place</h1><p>{seasonResult.points} points from a {seasonResult.played || 38}-match campaign with {teamName}.</p></div><div className="result-points"><strong>{seasonResult.points}</strong><span>Points</span></div></section><div className="season-results-grid"><LeagueTable table={focusedTable} teamName={teamName} /><aside className="season-statistics"><span className="eyebrow">Squad statistics</span><h2>The campaign</h2><div className="result-stats"><span><strong>{seasonResult.wins}</strong>Wins</span><span><strong>{seasonResult.draws}</strong>Draws</span><span><strong>{seasonResult.losses}</strong>Losses</span><span><strong>{seasonResult.goalsFor}–{seasonResult.goalsAgainst}</strong>Goals</span></div><div className="award-line"><span>Top scorer</span><strong>{seasonResult.topScorer?.name || "No goals recorded"}</strong></div><div className="award-line"><span>Top assister</span><strong>{seasonResult.topAssister?.name || "No assists recorded"}</strong></div></aside></div><button className="primary-button" onClick={onBuildAgain}>Build another XI <span>→</span></button></div>;
}

export default ResultsPage;
