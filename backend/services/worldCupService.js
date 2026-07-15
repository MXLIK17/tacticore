const { simulateMatch } = require("./matchService");
const worldCupTeams = require("../data/teams/worldCupTeams");
const { calculateTeamRating } = require("./teamAdapterService");

const GROUP_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"];
const GROUP_ROUNDS = [
    [[0, 1], [2, 3]],
    [[0, 2], [3, 1]],
    [[0, 3], [1, 2]]
];
const ADDITIONAL_TEAMS = [
    "Uruguay 1930", "England 1966", "Netherlands 1988", "Denmark 1992", "France 2018", "Croatia 2018",
    "Belgium 1986", "Mexico 1970", "Hungary 1954", "Sweden 1958", "Soviet Union 1960", "Czechoslovakia 1976",
    "Colombia 2014", "Chile 1962", "Peru 1970", "Poland 1974", "Turkey 2002", "South Korea 2002",
    "Morocco 1986", "Cameroon 1990", "Nigeria 1994", "Japan 2002", "United States 2002"
].map((name, index) => ({
    name,
    attack: 77 + (index * 3) % 16,
    midfield: 76 + (index * 5) % 17,
    defense: 75 + (index * 7) % 18,
    goalkeeper: 77 + (index * 2) % 15,
    players: []
}));

function prepareTeamForSimulation(team) {
    if (team.attack != null) return team;
    if (!team.players || team.players.length === 0) return team;
    const slots = {};
    team.players.forEach((player, index) => { slots[index] = player; });
    const ratings = calculateTeamRating(slots);
    return { ...team, attack: ratings.attack, midfield: ratings.midfield, defense: ratings.defense, goalkeeper: ratings.goalkeeper };
}

function createGroupTable(teams) {
    return Object.fromEntries(teams.map((team) => [team.id, { team: team.name, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }]));
}

function updateGroupTable(table, home, away, result) {
    const homeRow = table[home.id];
    const awayRow = table[away.id];
    homeRow.played++; awayRow.played++;
    homeRow.goalsFor += result.homeGoals; homeRow.goalsAgainst += result.awayGoals;
    awayRow.goalsFor += result.awayGoals; awayRow.goalsAgainst += result.homeGoals;
    if (result.homeGoals > result.awayGoals) { homeRow.wins++; awayRow.losses++; homeRow.points += 3; }
    else if (result.awayGoals > result.homeGoals) { awayRow.wins++; homeRow.losses++; awayRow.points += 3; }
    else { homeRow.draws++; awayRow.draws++; homeRow.points++; awayRow.points++; }
    homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst;
    awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst;
}

function sortGroup(table) {
    return Object.entries(table).sort(([, a], [, b]) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.team.localeCompare(b.team));
}

function decideKnockoutMatch(home, away, stage) {
    const result = simulateMatch(home, away);
    const winner = result.homeGoals > result.awayGoals ? home : result.awayGoals > result.homeGoals ? away : Math.random() < 0.5 ? home : away;
    return { stage, teamA: home.name, teamB: away.name, score: `${result.homeGoals}-${result.awayGoals}`, winner: winner.name, winnerId: winner.id, loserId: winner.id === home.id ? away.id : home.id, penalties: result.homeGoals === result.awayGoals, home, away, winner };
}

function createTournamentTeams(userTeam) {
    const teams = [userTeam, ...worldCupTeams, ...ADDITIONAL_TEAMS];
    return teams.map((team, index) => ({ ...team, id: `wc-${index}` }));
}

function formatMatch(match) {
    return { stage: match.stage, teamA: match.teamA, teamB: match.teamB, score: match.score, winner: match.winner, penalties: match.penalties || false };
}

function createGroups(teams) {
    const groups = {};
    GROUP_NAMES.forEach((name, index) => {
        const groupTeams = teams.slice(index * 4, index * 4 + 4);
        groups[name] = { teams: groupTeams, table: createGroupTable(groupTeams), qualified: [] };
    });
    return groups;
}

let worldCupState = { started: false, finished: false, champion: null };

function buildRoundOf16(groups) {
    const qualified = Object.fromEntries(GROUP_NAMES.map((name) => [name, groups[name].qualified]));
    return [
        [qualified.A[0], qualified.B[1]], [qualified.C[0], qualified.D[1]], [qualified.E[0], qualified.F[1]], [qualified.G[0], qualified.H[1]],
        [qualified.B[0], qualified.A[1]], [qualified.D[0], qualified.C[1]], [qualified.F[0], qualified.E[1]], [qualified.H[0], qualified.G[1]]
    ];
}

function response(latestMatches = []) {
    const groups = Object.fromEntries(GROUP_NAMES.map((name) => [name, sortGroup(worldCupState.groups[name].table).map(([id, row]) => ({ id, ...row }))]));
    return {
        started: worldCupState.started,
        userTeam: worldCupState.userTeam,
        currentRound: worldCupState.currentRound,
        rounds: ["Group stage", "Round of 16", "Quarter-finals", "Semi-finals", "Third-place match", "Final"],
        phase: worldCupState.phase,
        groupMatchday: worldCupState.groupMatchday,
        groups,
        history: worldCupState.history.map(formatMatch),
        latestMatches: latestMatches.map(formatMatch),
        match: latestMatches.find((match) => match.home.id === worldCupState.userTeam.id || match.away.id === worldCupState.userTeam.id) ? formatMatch(latestMatches.find((match) => match.home.id === worldCupState.userTeam.id || match.away.id === worldCupState.userTeam.id)) : latestMatches[latestMatches.length - 1] ? formatMatch(latestMatches[latestMatches.length - 1]) : undefined,
        finished: worldCupState.finished,
        champion: worldCupState.champion,
        qualifiedTeams: worldCupState.qualifiedTeams?.map((team) => team.name) || [],
        bracket: worldCupState.bracket.map(formatMatch)
    };
}

function startWorldCup(team) {
    const userTeam = { ...prepareTeamForSimulation(team), name: team.name || "TactiCore XI" };
    const teams = createTournamentTeams(userTeam);
    if (new Set(teams.map((entry) => entry.name)).size !== 32) throw new Error("World Cup teams must be unique");
    worldCupState = { started: true, userTeam: teams[0], groups: createGroups(teams), groupMatchday: 0, phase: "group", currentRound: 0, history: [], bracket: [], qualifiedTeams: [], finished: false, champion: null };
    return response();
}

function playGroupMatchday() {
    const matches = [];
    GROUP_NAMES.forEach((groupName) => {
        const group = worldCupState.groups[groupName];
        GROUP_ROUNDS[worldCupState.groupMatchday].forEach(([homeIndex, awayIndex]) => {
            const home = group.teams[homeIndex];
            const away = group.teams[awayIndex];
            const result = simulateMatch(home, away);
            updateGroupTable(group.table, home, away, result);
            const match = { stage: `Group ${groupName} · Matchday ${worldCupState.groupMatchday + 1}`, teamA: home.name, teamB: away.name, score: `${result.homeGoals}-${result.awayGoals}`, winner: result.homeGoals > result.awayGoals ? home.name : result.awayGoals > result.homeGoals ? away.name : "Draw", home, away };
            matches.push(match); worldCupState.history.push(match);
        });
    });
    worldCupState.groupMatchday++;
    if (worldCupState.groupMatchday === GROUP_ROUNDS.length) {
        GROUP_NAMES.forEach((name) => { worldCupState.groups[name].qualified = sortGroup(worldCupState.groups[name].table).slice(0, 2).map(([id]) => worldCupState.groups[name].teams.find((team) => team.id === id)); });
        worldCupState.qualifiedTeams = GROUP_NAMES.flatMap((name) => worldCupState.groups[name].qualified);
        worldCupState.knockoutPairs = buildRoundOf16(worldCupState.groups);
        worldCupState.phase = "roundOf16"; worldCupState.currentRound = 1;
    }
    return matches;
}

function playKnockoutRound(stage, pairs) {
    const matches = pairs.map(([home, away]) => decideKnockoutMatch(home, away, stage));
    worldCupState.history.push(...matches); worldCupState.bracket.push(...matches);
    return matches;
}

function playNextWorldCupMatch() {
    if (!worldCupState.started) throw new Error("World Cup has not started");
    if (worldCupState.finished) return response();

    let latestMatches;
    if (worldCupState.phase === "group") latestMatches = playGroupMatchday();
    else if (worldCupState.phase === "roundOf16") {
        latestMatches = playKnockoutRound("Round of 16", worldCupState.knockoutPairs);
        const winners = latestMatches.map((match) => match.winner);
        worldCupState.knockoutPairs = [[winners[0], winners[1]], [winners[2], winners[3]], [winners[4], winners[5]], [winners[6], winners[7]]];
        worldCupState.phase = "quarterFinal"; worldCupState.currentRound = 2;
    } else if (worldCupState.phase === "quarterFinal") {
        latestMatches = playKnockoutRound("Quarter-finals", worldCupState.knockoutPairs);
        const winners = latestMatches.map((match) => match.winner);
        worldCupState.knockoutPairs = [[winners[0], winners[1]], [winners[2], winners[3]]];
        worldCupState.phase = "semiFinal"; worldCupState.currentRound = 3;
    } else if (worldCupState.phase === "semiFinal") {
        latestMatches = playKnockoutRound("Semi-finals", worldCupState.knockoutPairs);
        worldCupState.finalists = latestMatches.map((match) => match.winner);
        worldCupState.thirdPlaceTeams = latestMatches.map((match) => match.winner.id === match.home.id ? match.away : match.home);
        worldCupState.phase = "thirdPlace"; worldCupState.currentRound = 4;
    } else if (worldCupState.phase === "thirdPlace") {
        latestMatches = playKnockoutRound("Third-place match", [worldCupState.thirdPlaceTeams]);
        worldCupState.phase = "final"; worldCupState.currentRound = 5;
    } else {
        latestMatches = playKnockoutRound("Final", [worldCupState.finalists]);
        worldCupState.champion = latestMatches[0].winner.name;
        worldCupState.finished = true; worldCupState.phase = "completed"; worldCupState.currentRound = 6;
    }
    return response(latestMatches);
}

function getWorldCupState() { return worldCupState; }

module.exports = { startWorldCup, playNextWorldCupMatch, getWorldCupState };
