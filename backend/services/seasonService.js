const { simulateMatch } = require("./matchService");
const { createPlayerStats, recordGoal, getTopScorer, getTopAssister } = require("./statService");
const premierLeagueTeams = require("../data/teams/premierLeagueTeams");
const { calculateTeamRating } = require("./teamAdapterService");
const { normalizeDraftPlayers } = require("./playerResolver");

const LEAGUE_FILLER_TEAMS = [
    "Aston Villa 1981", "Blackburn Rovers 1995", "Everton 1985", "Leeds United 1992",
    "Nottingham Forest 1978", "West Ham United 1986", "Sheffield Wednesday 1993",
    "Southampton 1984", "Ipswich Town 1981", "Derby County 1975", "Wolves 1959"
].map((name, index) => ({
    name,
    attack: 76 + (index % 5) * 2,
    midfield: 75 + (index % 4) * 2,
    defense: 76 + (index % 6) * 2,
    goalkeeper: 77 + (index % 5) * 2
}));

function prepareTeamForSimulation(team) {
    if (team && Number.isFinite(team.attack) && Number.isFinite(team.midfield) && Number.isFinite(team.defense) && Number.isFinite(team.goalkeeper)) {
        return team;
    }
    if (!team?.players || team.players.length === 0) return team;

    const slots = {};
    team.players.forEach((player, index) => { slots[index] = player; });
    const ratings = calculateTeamRating(slots);
    return { ...team, attack: ratings.attack, midfield: ratings.midfield, defense: ratings.defense, goalkeeper: ratings.goalkeeper };
}

function convertDraftPlayers(players) {
    return normalizeDraftPlayers(players);
}

function createLeagueTeams(userTeam) {
    const opponents = [...premierLeagueTeams, ...LEAGUE_FILLER_TEAMS];
    return [userTeam, ...opponents].map((team, index) => ({ ...team, id: `team-${index}` }));
}

// Circle-method schedule: every pair meets once per half, then venues are reversed.
function generateDoubleRoundRobin(teams) {
    const rotation = [...teams];
    const rounds = [];
    const half = teams.length / 2;

    for (let round = 0; round < teams.length - 1; round++) {
        const fixtures = [];
        for (let index = 0; index < half; index++) {
            const first = rotation[index];
            const second = rotation[rotation.length - 1 - index];
            fixtures.push((round + index) % 2 === 0 ? { home: first, away: second } : { home: second, away: first });
        }
        rounds.push(fixtures);
        rotation.splice(1, 0, rotation.pop());
    }

    return [
        ...rounds,
        ...rounds.map((round) => round.map(({ home, away }) => ({ home: away, away: home })))
    ];
}

function createStandings(teams) {
    return Object.fromEntries(teams.map((team) => [team.id, {
        team: team.name, played: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0
    }]));
}

function recordResult(standings, home, away, result) {
    const homeRow = standings[home.id];
    const awayRow = standings[away.id];
    homeRow.played++; awayRow.played++;
    homeRow.goalsFor += result.homeGoals; homeRow.goalsAgainst += result.awayGoals;
    awayRow.goalsFor += result.awayGoals; awayRow.goalsAgainst += result.homeGoals;

    if (result.homeGoals > result.awayGoals) { homeRow.wins++; awayRow.losses++; homeRow.points += 3; }
    else if (result.awayGoals > result.homeGoals) { awayRow.wins++; homeRow.losses++; awayRow.points += 3; }
    else { homeRow.draws++; awayRow.draws++; homeRow.points++; awayRow.points++; }

    homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst;
    awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst;
}

function sortTable(standings) {
    return Object.values(standings).sort((a, b) =>
        b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.team.localeCompare(b.team)
    ).map((row, index) => ({ position: index + 1, ...row }));
}

function simulateSeason(myTeam) {
    const preparedTeam = prepareTeamForSimulation(myTeam);
    const userPlayers = convertDraftPlayers(preparedTeam.players || []);
    const userTeam = { ...preparedTeam, name: preparedTeam.name || "TactiCore XI", players: userPlayers };
    const teams = createLeagueTeams(userTeam);
    const standings = createStandings(teams);
    const playerStats = createPlayerStats(userPlayers);
    const matches = [];

    generateDoubleRoundRobin(teams).forEach((round) => round.forEach(({ home, away }) => {
        const result = simulateMatch(home, away);
        recordResult(standings, home, away, result);

        if (home.id === "team-0" || away.id === "team-0") {
            const userAtHome = home.id === "team-0";
            const scorers = userAtHome ? result.homeScorers : result.awayScorers;
            const assists = userAtHome ? result.homeAssists : result.awayAssists;
            scorers.forEach((scorer, index) => {
                if (scorer) recordGoal(playerStats, scorer.name, assists[index]?.name || null);
            });
            matches.push({ opponent: userAtHome ? away.name : home.name, venue: userAtHome ? "Home" : "Away", score: `${userAtHome ? result.homeGoals : result.awayGoals}-${userAtHome ? result.awayGoals : result.homeGoals}`, outcome: userAtHome ? result.result : result.result === "HOME_WIN" ? "AWAY_WIN" : result.result === "AWAY_WIN" ? "HOME_WIN" : "DRAW" });
        }
    }));

    const table = sortTable(standings);
    const userRow = table.find((row) => row.team === userTeam.name);
    const seasonRating = userRow.points >= 90 ? "A+" : userRow.points >= 80 ? "A" : userRow.points >= 70 ? "B" : userRow.points >= 60 ? "C" : userRow.points >= 50 ? "D" : "E";
    return {
        teamName: userTeam.name,
        played: userRow.played,
        position: userRow.position,
        wins: userRow.wins,
        draws: userRow.draws,
        losses: userRow.losses,
        goalsFor: userRow.goalsFor,
        goalsAgainst: userRow.goalsAgainst,
        goalDifference: userRow.goalDifference,
        points: userRow.points,
        table,
        matches,
        topScorer: getTopScorer(playerStats),
        topAssister: getTopAssister(playerStats),
        seasonRating
    };
}

module.exports = { simulateSeason, generateDoubleRoundRobin, createStandings, recordResult, sortTable };
