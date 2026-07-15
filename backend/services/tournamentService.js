const tournament = require("../models/tournamentModel");
const { simulateMatch } = require("./matchService");
const {
    normalizeTeam,
    calculateTeamRating
} = require("./teamAdapterService");

function generateAITeams(n = 10) {
    const teams = [];

    for (let i = 0; i < n; i++) {
        teams.push({
            name: `AI Team ${i + 1}`,
            attack: 75 + Math.floor(Math.random() * 15),
            midfield: 75 + Math.floor(Math.random() * 15),
            defense: 75 + Math.floor(Math.random() * 15),
            goalkeeper: 75 + Math.floor(Math.random() * 15),
            players: []
        });
    }

    return teams;
}

function ensureTeamRatings(team) {
    if (team.attack != null) {
        return team;
    }

    if (team.players && team.players.length > 0) {
        const slotMap = {};

        team.players.forEach((player, index) => {
            slotMap[index] = player;
        });

        const ratings = calculateTeamRating(slotMap);

        return {
            ...team,
            attack: ratings.attack,
            midfield: ratings.midfield,
            defense: ratings.defense,
            goalkeeper: ratings.goalkeeper
        };
    }

    return {
        ...team,
        attack: 75,
        midfield: 75,
        defense: 75,
        goalkeeper: 75
    };
}

function generateFixtures(teams) {
    const fixtures = [];

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            fixtures.push({
                home: teams[i],
                away: teams[j]
            });
        }
    }

    return fixtures;
}

function startPremierLeague(userTeam) {
    const safeUserTeam = ensureTeamRatings(
        normalizeTeam(userTeam)
    );
    const aiTeams = generateAITeams(10);

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

function updateStandings(match, result) {
    const homeIndex = tournament.teams.findIndex(
        (team) => team.name === match.home.name
    );
    const awayIndex = tournament.teams.findIndex(
        (team) => team.name === match.away.name
    );

    if (homeIndex === -1 || awayIndex === -1) {
        return;
    }

    tournament.standings[homeIndex].goalsFor += result.homeGoals;
    tournament.standings[homeIndex].goalsAgainst += result.awayGoals;
    tournament.standings[awayIndex].goalsFor += result.awayGoals;
    tournament.standings[awayIndex].goalsAgainst += result.homeGoals;

    if (result.result === "HOME_WIN") {
        tournament.standings[homeIndex].points += 3;
    } else if (result.result === "AWAY_WIN") {
        tournament.standings[awayIndex].points += 3;
    } else {
        tournament.standings[homeIndex].points += 1;
        tournament.standings[awayIndex].points += 1;
    }
}

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
