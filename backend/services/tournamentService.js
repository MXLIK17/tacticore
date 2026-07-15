const tournament = require("../models/tournamentModel");
const { simulateMatch } = require("./matchService");
const { normalizeTeam, calculateTeamRating } = require("./teamAdapterService");
const { generateDoubleRoundRobin, createStandings, recordResult, sortTable } = require("./seasonService");

function generateAITeams(count) {
    return Array.from({ length: count }, (_, index) => ({
        id: `team-${index + 1}`,
        name: `League XI ${index + 1}`,
        attack: 74 + (index * 3) % 17,
        midfield: 75 + (index * 5) % 16,
        defense: 74 + (index * 7) % 17,
        goalkeeper: 76 + (index * 2) % 15,
        players: []
    }));
}

function ensureTeamRatings(team) {
    if (team.attack != null) return team;
    if (!team.players || team.players.length === 0) return { ...team, attack: 75, midfield: 75, defense: 75, goalkeeper: 75 };
    const slots = {};
    team.players.forEach((player, index) => { slots[index] = player; });
    return { ...team, ...calculateTeamRating(slots) };
}

function startPremierLeague(userTeam) {
    const safeUserTeam = { ...ensureTeamRatings(normalizeTeam(userTeam)), id: "team-0" };
    tournament.type = "premier-league";
    tournament.teams = [safeUserTeam, ...generateAITeams(19)];
    tournament.currentMatchIndex = 0;
    tournament.completed = false;
    tournament.standings = createStandings(tournament.teams);
    tournament.rounds = generateDoubleRoundRobin(tournament.teams);
    tournament.fixtures = tournament.rounds.flat();
    return { ...tournament, table: sortTable(tournament.standings) };
}

function playNextMatch() {
    if (!tournament.fixtures.length) throw new Error("No tournament started");
    if (tournament.completed) return { message: "Tournament already completed", tournament, table: sortTable(tournament.standings) };

    const match = tournament.fixtures[tournament.currentMatchIndex];
    const result = simulateMatch(match.home, match.away);
    recordResult(tournament.standings, match.home, match.away, result);
    tournament.currentMatchIndex++;
    tournament.completed = tournament.currentMatchIndex >= tournament.fixtures.length;
    return { match, result, progress: { current: tournament.currentMatchIndex, total: tournament.fixtures.length }, tournament, table: sortTable(tournament.standings) };
}

function resetTournament() {
    tournament.type = null; tournament.teams = []; tournament.currentMatchIndex = 0;
    tournament.fixtures = []; tournament.rounds = []; tournament.standings = {}; tournament.completed = false;
    return tournament;
}

module.exports = { startPremierLeague, playNextMatch, resetTournament };
