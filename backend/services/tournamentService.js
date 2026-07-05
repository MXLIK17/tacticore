const tournament = require("../models/tournamentModel");
const { simulateMatch } = require("./matchService");
const { normalizeTeam } = require("./teamAdapterService");

/**
 * Generate AI team
 */
function generateAITeams(n = 19) {
    const teams = [];

    const positions = [
        "GK",
        "CB", "CB", "CB", "CB",
        "LB", "RB",
        "CM", "CM", "CM",
        "ST", "ST"
    ];

    for (let i = 0; i < n; i++) {
        const slots = {};

        positions.forEach(pos => {
            slots[pos + Math.random()] = {
                id: `${pos}-${Math.random()}`,
                name: `AI ${pos}`,
                speed: Math.random() * 100,
                shooting: Math.random() * 100,
                passing: Math.random() * 100,
                defense: Math.random() * 100,
                stamina: Math.random() * 100
            };
        });

        teams.push({
            name: `AI Team ${i + 1}`,
            slots
        });
    }

    return teams;
}

/**
 * Create fixtures (round-robin simplified)
 */
function generateFixtures(teams) {
    const fixtures = [];

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            fixtures.push({
                home: normalizeTeam(teams[i]),
                away: normalizeTeam(teams[j])
            });
        }
    }

    return fixtures;
}

/**
 * START PREMIER LEAGUE
 */
function startPremierLeague(userTeam) {
    const safeUserTeam = normalizeTeam(userTeam);
    const aiTeams = generateAITeams(10); // reduced for performance

    tournament.type = "premier-league";
    tournament.teams = [safeUserTeam, ...aiTeams];
    tournament.currentMatchIndex = 0;
    tournament.completed = false;

    tournament.standings = {};

    tournament.teams.forEach((_, index) => {
        tournament.standings[index] = {
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0
        };
    });

    tournament.fixtures = generateFixtures(tournament.teams);

    return tournament;
}

/**
 * PLAY NEXT MATCH
 */
function playNextMatch() {
    if (!tournament.fixtures.length) {
        throw new Error("No tournament started");
    }

    if (tournament.completed) {
        return {
            message: "Tournament already completed",
            tournament
        };
    }

    const match = tournament.fixtures[tournament.currentMatchIndex];

    const result = simulateMatch(match.home, match.away);

    updateStandings(match, result);

    tournament.currentMatchIndex++;

    if (tournament.currentMatchIndex >= tournament.fixtures.length) {
        tournament.completed = true;
    }

    return {
        match,
        result,
        progress: {
            current: tournament.currentMatchIndex,
            total: tournament.fixtures.length
        },
        tournament
    };
}

/**
 * UPDATE STANDINGS
 */
function updateStandings(match, result) {
    const homeIndex = tournament.teams.findIndex(t => t.name === match.home.name);
    const awayIndex = tournament.teams.findIndex(t => t.name === match.away.name);

    if (homeIndex === -1 || awayIndex === -1) return;

    tournament.standings[homeIndex].goalsFor += result.homeScore;
    tournament.standings[homeIndex].goalsAgainst += result.awayScore;

    tournament.standings[awayIndex].goalsFor += result.awayScore;
    tournament.standings[awayIndex].goalsAgainst += result.homeScore;

    if (result.result === "home") {
        tournament.standings[homeIndex].points += 3;
    } else if (result.result === "away") {
        tournament.standings[awayIndex].points += 3;
    } else {
        tournament.standings[homeIndex].points += 1;
        tournament.standings[awayIndex].points += 1;
    }
}

/**
 * RESET TOURNAMENT
 */
function resetTournament() {
    tournament.type = null;
    tournament.teams = [];
    tournament.currentMatchIndex = 0;
    tournament.fixtures = [];
    tournament.standings = {};
    tournament.completed = false;

    return tournament;
}

module.exports = {
    startPremierLeague,
    playNextMatch,
    resetTournament
};