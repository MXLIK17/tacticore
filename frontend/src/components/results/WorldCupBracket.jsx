const stages = ["Round of 16", "Quarter-finals", "Semi-finals", "Third-place match", "Final"];

function WorldCupBracket({ bracket }) {
  return <section className="worldcup-bracket"><div className="table-heading"><div><span className="eyebrow">Tournament path</span><h2>World Cup bracket</h2></div><span>WC</span></div><div className="bracket-stages">{stages.map((stage) => <div className="bracket-stage" key={stage}><span className="bracket-title">{stage}</span>{bracket.filter((match) => match.stage === stage).map((match) => <article key={`${stage}-${match.teamA}-${match.teamB}`}><span>{match.teamA}</span><b>{match.score}</b><span>{match.teamB}</span><small>{match.penalties ? `${match.winner} won on penalties` : `${match.winner} won`}</small></article>)}</div>)}</div></section>;
}
export default WorldCupBracket;
