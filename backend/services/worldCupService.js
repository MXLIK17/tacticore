const { simulateMatch } = require("./matchService");
const worldCupTeams = require("../data/teams/worldCupTeams");
const { calculateTeamRating } = require("./teamAdapterService");
const { createPlayerStats, recordGoal, getTopScorer, getTopAssister } = require("./statService");

const GROUP_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"];
const GROUP_ROUNDS = [[[0, 1], [2, 3]], [[0, 2], [3, 1]], [[0, 3], [1, 2]]];
const ADDITIONAL_TEAMS = [
    "Uruguay 1930", "England 1966", "Netherlands 1988", "Denmark 1992", "France 2018", "Croatia 2018",
    "Belgium 1986", "Mexico 1970", "Hungary 1954", "Sweden 1958", "Soviet Union 1960", "Czechoslovakia 1976",
    "Colombia 2014", "Chile 1962", "Peru 1970", "Poland 1974", "Turkey 2002", "South Korea 2002",
    "Morocco 1986", "Cameroon 1990", "Nigeria 1994", "Japan 2002", "United States 2002"
].map((name, index) => ({ name, attack: 77 + (index * 3) % 16, midfield: 76 + (index * 5) % 17, defense: 75 + (index * 7) % 18, goalkeeper: 77 + (index * 2) % 15, players: [] }));

function prepareTeamForSimulation(team) {
    if (team.attack != null) return team;
    const slots = {};
    (team.players || []).forEach((player, index) => { slots[index] = player; });
    const ratings = calculateTeamRating(slots);
    return { ...team, ...ratings };
}

function createGroupTable(teams) {
    return Object.fromEntries(teams.map((team) => [team.id, { team: team.name, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 }]));
}

function updateGroupTable(table, home, away, result) {
    const homeRow = table[home.id]; const awayRow = table[away.id];
    homeRow.played++; awayRow.played++;
    homeRow.goalsFor += result.homeGoals; homeRow.goalsAgainst += result.awayGoals;
    awayRow.goalsFor += result.awayGoals; awayRow.goalsAgainst += result.homeGoals;
    if (result.homeGoals > result.awayGoals) { homeRow.wins++; awayRow.losses++; homeRow.points += 3; }
    else if (result.awayGoals > result.homeGoals) { awayRow.wins++; homeRow.losses++; awayRow.points += 3; }
    else { homeRow.draws++; awayRow.draws++; homeRow.points++; awayRow.points++; }
    homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst;
    awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst;
}

function sortedGroup(table) {
    return Object.entries(table).sort(([, a], [, b]) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.team.localeCompare(b.team));
}

function recordUserEvents(result, userAtHome) {
    const scorers = userAtHome ? result.homeScorers : result.awayScorers;
    const assists = userAtHome ? result.homeAssists : result.awayAssists;
    scorers.forEach((scorer, index) => { if (scorer) recordGoal(worldCupState.playerStats, scorer.name, assists[index]?.name || null); });
}

function createMatchSummary(home, away, result, stage, knockout = false) {
    const draw = result.homeGoals === result.awayGoals;
    const winner = knockout ? (draw ? (Math.random() < 0.5 ? home : away) : result.homeGoals > result.awayGoals ? home : away) : result.homeGoals > result.awayGoals ? home : result.awayGoals > result.homeGoals ? away : null;
    return { stage, teamA: home.name, teamB: away.name, score: `${result.homeGoals}-${result.awayGoals}`, winner: winner?.name || "Draw", winnerId: winner?.id || null, penalties: knockout && draw, home, away, winner };
}

function formatMatch(match) { return { stage: match.stage, teamA: match.teamA, teamB: match.teamB, score: match.score, winner: match.winner, penalties: match.penalties }; }
function awards() {
    const goldenBoot = getTopScorer(worldCupState.playerStats);
    const topAssister = getTopAssister(worldCupState.playerStats);
    return { goldenBoot, topAssister, goldenBall: goldenBoot ? { name: goldenBoot.name, goals: goldenBoot.goals, assists: goldenBoot.assists } : null };
}

function response(latestMatches = []) {
    const groups = Object.fromEntries(GROUP_NAMES.map((name) => [name, sortedGroup(worldCupState.groups[name].table).map(([id, row]) => ({ id, ...row }))]));
    const userMatch = latestMatches.find((match) => match.home.id === worldCupState.userTeam.id || match.away.id === worldCupState.userTeam.id);
    return {
        started: worldCupState.started, finished: worldCupState.finished, eliminated: worldCupState.eliminated,
        eliminationReason: worldCupState.eliminationReason, champion: worldCupState.champion,
        userTeam: worldCupState.userTeam, userRecord: worldCupState.userRecord,
        currentRound: worldCupState.currentRound, phase: worldCupState.phase, groupMatchday: worldCupState.groupMatchday,
        rounds: ["Group stage", "Round of 16", "Quarter-finals", "Semi-finals", "Third-place match", "Final"],
        groups, qualifiedTeams: worldCupState.qualifiedTeams.map((team) => team.name),
        history: worldCupState.history.map(formatMatch), latestMatches: latestMatches.map(formatMatch),
        match: userMatch ? formatMatch(userMatch) : latestMatches.length ? formatMatch(latestMatches[latestMatches.length - 1]) : undefined,
        bracket: worldCupState.bracket.map(formatMatch), awards: awards()
    };
}

function createGroups(teams) {
    return Object.fromEntries(GROUP_NAMES.map((name, index) => {
        const groupTeams = teams.slice(index * 4, index * 4 + 4);
        return [name, { teams: groupTeams, table: createGroupTable(groupTeams), qualified: [] }];
    }));
}

function buildRoundOf16(groups) {
    const qualified = Object.fromEntries(GROUP_NAMES.map((name) => [name, groups[name].qualified]));
    return [[qualified.A[0], qualified.B[1]], [qualified.C[0], qualified.D[1]], [qualified.E[0], qualified.F[1]], [qualified.G[0], qualified.H[1]], [qualified.B[0], qualified.A[1]], [qualified.D[0], qualified.C[1]], [qualified.F[0], qualified.E[1]], [qualified.H[0], qualified.G[1]]];
}

function eliminate(reason) {
    worldCupState.eliminated = true;
    worldCupState.eliminationReason = reason;
    worldCupState.finished = true;
    worldCupState.phase = "eliminated";
}

function isUser(team) { return team.id === worldCupState.userTeam.id; }
function userWon(match) { return match.winnerId === worldCupState.userTeam.id; }

let worldCupState = { started: false, finished: false, eliminated: false, champion: null };

function startWorldCup(team) {
    const userTeam = prepareTeamForSimulation({ ...team, name: team.name || "TactiCore XI" });
    const teams = [userTeam, ...worldCupTeams, ...ADDITIONAL_TEAMS].map((entry, index) => ({ ...entry, id: `wc-${index}` }));
    if (new Set(teams.map((entry) => entry.name)).size !== 32) throw new Error("World Cup teams must be unique");
    worldCupState = { started: true, finished: false, eliminated: false, eliminationReason: null, champion: null, userTeam: teams[0], groups: createGroups(teams), groupMatchday: 0, phase: "group", currentRound: 0, history: [], bracket: [], qualifiedTeams: [], knockoutPairs: [], playerStats: createPlayerStats(userTeam.players || []), userRecord: { wins: 0, draws: 0, losses: 0 } };
    return response();
}

function playGroupMatchday() {
    const matches = [];
    GROUP_NAMES.forEach((groupName) => {
        const group = worldCupState.groups[groupName];
        GROUP_ROUNDS[worldCupState.groupMatchday].forEach(([homeIndex, awayIndex]) => {
            const home = group.teams[homeIndex]; const away = group.teams[awayIndex];
            const result = simulateMatch(home, away, { neutral: true });
            updateGroupTable(group.table, home, away, result);
            const match = createMatchSummary(home, away, result, `Group ${groupName} · Matchday ${worldCupState.groupMatchday + 1}`);
            matches.push(match); worldCupState.history.push(match);
            if (isUser(home) || isUser(away)) {
                recordUserEvents(result, isUser(home));
                if (match.winnerId === worldCupState.userTeam.id) worldCupState.userRecord.wins++;
                else if (!match.winnerId) worldCupState.userRecord.draws++;
                else worldCupState.userRecord.losses++;
            }
        });
    });
    worldCupState.groupMatchday++;
    if (worldCupState.groupMatchday === 3) {
        GROUP_NAMES.forEach((name) => { worldCupState.groups[name].qualified = sortedGroup(worldCupState.groups[name].table).slice(0, 2).map(([id]) => worldCupState.groups[name].teams.find((team) => team.id === id)); });
        worldCupState.qualifiedTeams = GROUP_NAMES.flatMap((name) => worldCupState.groups[name].qualified);
        if (!worldCupState.qualifiedTeams.some(isUser)) { eliminate("Failed to qualify from the group stage"); return matches; }
        worldCupState.knockoutPairs = buildRoundOf16(worldCupState.groups); worldCupState.phase = "roundOf16"; worldCupState.currentRound = 1;
    }
    return matches;
}

function playKnockoutRound(stage, pairs, nextPhase, nextRound) {
    const matches = pairs.map(([home, away]) => {
        const result = simulateMatch(home, away, { neutral: true });
        const match = createMatchSummary(home, away, result, stage, true);
        if (isUser(home) || isUser(away)) {
            recordUserEvents(result, isUser(home));
            if (userWon(match)) worldCupState.userRecord.wins++;
            else worldCupState.userRecord.losses++;
        }
        return match;
    });
    worldCupState.history.push(...matches); worldCupState.bracket.push(...matches);
    const userMatch = matches.find((match) => isUser(match.home) || isUser(match.away));
    if (userMatch && !userWon(userMatch)) { eliminate(`Eliminated in the ${stage.toLowerCase()}`); return matches; }
    worldCupState.knockoutPairs = matches.map((match) => match.winner);
    worldCupState.phase = nextPhase; worldCupState.currentRound = nextRound;
    return matches;
}

function playNextWorldCupMatch() {
    if (!worldCupState.started) throw new Error("World Cup has not started");
    if (worldCupState.finished) return response();
    let latestMatches;
    if (worldCupState.phase === "group") latestMatches = playGroupMatchday();
    else if (worldCupState.phase === "roundOf16") {
        latestMatches = playKnockoutRound("Round of 16", worldCupState.knockoutPairs, "quarterFinal", 2);
        if (!worldCupState.finished) worldCupState.knockoutPairs = [[worldCupState.knockoutPairs[0], worldCupState.knockoutPairs[1]], [worldCupState.knockoutPairs[2], worldCupState.knockoutPairs[3]], [worldCupState.knockoutPairs[4], worldCupState.knockoutPairs[5]], [worldCupState.knockoutPairs[6], worldCupState.knockoutPairs[7]]];
    } else if (worldCupState.phase === "quarterFinal") {
        latestMatches = playKnockoutRound("Quarter-finals", worldCupState.knockoutPairs, "semiFinal", 3);
        if (!worldCupState.finished) worldCupState.knockoutPairs = [[worldCupState.knockoutPairs[0], worldCupState.knockoutPairs[1]], [worldCupState.knockoutPairs[2], worldCupState.knockoutPairs[3]]];
    } else if (worldCupState.phase === "semiFinal") {
        latestMatches = playKnockoutRound("Semi-finals", worldCupState.knockoutPairs, "thirdPlace", 4);
        if (!worldCupState.finished) {
            const semiMatches = latestMatches;
            worldCupState.thirdPlaceTeams = semiMatches.map((match) => match.winner.id === match.home.id ? match.away : match.home);
            worldCupState.finalists = worldCupState.knockoutPairs;
        }
    } else if (worldCupState.phase === "thirdPlace") {
        const thirdPlace = playKnockoutRound("Third-place match", [worldCupState.thirdPlaceTeams], "final", 5);
        latestMatches = thirdPlace;
        worldCupState.knockoutPairs = [worldCupState.finalists];
    } else {
        latestMatches = playKnockoutRound("Final", worldCupState.knockoutPairs, "completed", 6);
        if (!worldCupState.finished) { worldCupState.champion = latestMatches[0].winner.name; worldCupState.finished = true; worldCupState.phase = "completed"; }
    }
    return response(latestMatches);
}

function getWorldCupState() { return worldCupState; }
module.exports = { startWorldCup, playNextWorldCupMatch, getWorldCupState };
