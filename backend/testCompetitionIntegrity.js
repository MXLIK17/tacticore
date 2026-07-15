const assert = require("assert");
const { simulateSeason } = require("./services/seasonService");
const tournamentService = require("./services/tournamentService");
const worldCupService = require("./services/worldCupService");

const userTeam = {
    name: "Integrity XI",
    attack: 86,
    midfield: 85,
    defense: 84,
    goalkeeper: 85,
    players: []
};

const season = simulateSeason(userTeam);
assert.strictEqual(season.matches.length, 38, "User must play exactly 38 league matches");
assert.strictEqual(season.wins + season.draws + season.losses, 38, "League record must total 38");
assert.strictEqual(season.points, season.wins * 3 + season.draws, "League points must match the record");
assert.strictEqual(season.table.length, 20, "League table must contain 20 teams");
season.table.forEach((row) => {
    assert.strictEqual(row.played, 38, `${row.team} must play 38 matches`);
    assert.strictEqual(row.wins + row.draws + row.losses, 38, `${row.team} has an invalid record`);
    assert.strictEqual(row.points, row.wins * 3 + row.draws, `${row.team} has invalid points`);
    assert.strictEqual(row.goalDifference, row.goalsFor - row.goalsAgainst, `${row.team} has an invalid goal difference`);
});

const league = tournamentService.startPremierLeague(userTeam);
assert.strictEqual(league.fixtures.length, 380, "A 20-team double round robin must contain 380 fixtures");
assert.strictEqual(new Set(league.fixtures.map((fixture) => `${fixture.home.id}:${fixture.away.id}`)).size, 380, "League fixtures must not repeat");

worldCupService.startWorldCup(userTeam);
let worldCup;
for (let step = 0; step < 8; step++) worldCup = worldCupService.playNextWorldCupMatch();
assert.strictEqual(worldCup.finished, true, "World Cup must finish after all stages");
assert.ok(worldCup.champion, "World Cup must produce one champion");
assert.strictEqual(worldCup.qualifiedTeams.length, 16, "Exactly 16 teams must qualify from the groups");
assert.strictEqual(new Set(worldCup.qualifiedTeams).size, 16, "Qualified teams must be unique");
assert.strictEqual(worldCup.bracket.filter((match) => match.stage === "Final").length, 1, "Tournament must contain one final");
assert.strictEqual(worldCup.bracket.filter((match) => match.stage === "Third-place match").length, 1, "Tournament must contain one third-place match");

console.log("Competition integrity checks passed.");
