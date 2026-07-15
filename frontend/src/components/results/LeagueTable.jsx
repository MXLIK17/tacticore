function LeagueTable({ table, teamName }) {
  return <section className="league-table"><div className="table-heading"><div><span className="eyebrow">Final standings</span><h2>Premier League table</h2></div><span>PL</span></div><div className="table-columns"><span>Pos</span><span>Team</span><span>Pl</span><span>GD</span><span>Pts</span></div>{table.map((row) => <div key={row.team} className={row.team === teamName ? "table-row is-user" : "table-row"}><span>{row.position}</span><strong>{row.team}</strong><span>{row.played}</span><span>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</span><b>{row.points}</b></div>)}</section>;
}
export default LeagueTable;
