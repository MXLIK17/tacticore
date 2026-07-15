const assert = require("assert");
const { simulateMatch, calculateExpectedGoals } = require("./services/matchService");
const { calculateTeamRating } = require("./services/teamAdapterService");
const { createPlayerStats, getTopScorer, getTopAssister } = require("./services/statService");

const home = { name: "Home XI", attack: 88, midfield: 86, defense: 84, goalkeeper: 85, players: [{ name: "Home Striker", position: "ST" }] };
const away = { name: "Away XI", attack: 84, midfield: 83, defense: 85, goalkeeper: 86, players: [{ name: "Away Striker", position: "ST" }] };

assert.ok(Number.isFinite(calculateExpectedGoals(home, away, true)), "Home xG must be finite");
assert.ok(Number.isFinite(calculateExpectedGoals(away, home)), "Away xG must be finite");

const partialPlayer = { name: "Partial Midfielder", position: "CM", shooting: 72, passing: 86, dribbling: 82, defending: 65, physical: 70 };
Object.values(calculateTeamRating({ CM1: partialPlayer })).forEach((rating) => assert.ok(Number.isFinite(rating), "Team ratings must never be NaN"));
const emptyStats = createPlayerStats([home.players[0]]);
assert.strictEqual(getTopScorer(emptyStats), null, "A top scorer cannot exist before a goal");
assert.strictEqual(getTopAssister(emptyStats), null, "A top assister cannot exist before an assist");

let totalGoals = 0;
let scorelessMatches = 0;
const examples = [];
for (let index = 0; index < 1000; index++) {
    const result = simulateMatch(home, away);
    totalGoals += result.homeGoals + result.awayGoals;
    if (result.homeGoals === 0 && result.awayGoals === 0) scorelessMatches++;
    if (examples.length < 5 && result.homeGoals + result.awayGoals > 0) examples.push(`${home.name} ${result.homeGoals}-${result.awayGoals} ${away.name}`);
}

const averageGoals = totalGoals / 1000;
assert.ok(averageGoals > 1.8 && averageGoals < 3.1, `Expected 2–3 total goals per match, received ${averageGoals}`);
assert.ok(scorelessMatches < 180, "0-0 draws should be uncommon");
assert.ok(examples.length > 0, "Goal generation must produce scoring matches");

console.log("Example simulated matches:");
examples.forEach((score) => console.log(score));
console.log(`Average goals: ${averageGoals.toFixed(2)}; 0-0 draws: ${scorelessMatches}/1000`);
