const { normalizeSlotPosition } = require("./playerResolver");
const { normalizeTeam } = require("./teamAdapterService");

function isAttacker(position) {
    const normalized = normalizeSlotPosition(position) || position;
    return normalized === "FW" || normalized === "ST";
}

function selectAttacker(team) {
    const attackers = (team.players || []).filter((player) => isAttacker(player.position));
    if (attackers.length) {
        return attackers[Math.floor(Math.random() * attackers.length)];
    }

    const fallback = (team.players || []).find((player) => player.position !== "GK");
    return fallback || { name: `${team.name} Player`, position: "ST" };
}

function selectAssister(team, scorer) {
    const candidates = (team.players || []).filter((player) => player !== scorer && player.position !== "GK");
    return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
}

function clamp(value, min, max) { return Math.max(min, Math.min(value, max)); }
function safeRating(value) { return Number.isFinite(value) ? value : 75; }

function calculateExpectedGoals(team, opponent, isHome = false) {
    const attackEdge = safeRating(team.attack) - safeRating(opponent.defense);
    const midfieldEdge = safeRating(team.midfield) - safeRating(opponent.midfield);
    const goalkeeperEffect = (safeRating(opponent.goalkeeper) - 85) * 0.025;
    const xG = 1.18 + attackEdge * 0.045 + midfieldEdge * 0.065 + (isHome ? 0.16 : 0) - goalkeeperEffect;
    return clamp(xG, 0.18, 3.2);
}

function generateGoals(xG) {
    const safeXG = safeRating(xG);
    let goals = 0;
    for (let chance = 0; chance < 7; chance++) {
        if (Math.random() < safeXG / 7) goals++;
    }
    return goals;
}

function createGoalEvents(team, goals) {
    return Array.from({ length: goals }, () => {
        const scorer = selectAttacker(team);
        return { scorer, assister: scorer ? selectAssister(team, scorer) : null };
    });
}

function simulateMatch(homeTeam, awayTeam, options = {}) {
    const home = normalizeTeam(homeTeam);
    const away = normalizeTeam(awayTeam);
    const applyHomeAdvantage = options.neutral !== true;
    const homeGoals = generateGoals(calculateExpectedGoals(home, away, applyHomeAdvantage));
    const awayGoals = generateGoals(calculateExpectedGoals(away, home, applyHomeAdvantage));
    const homeEvents = createGoalEvents(home, homeGoals);
    const awayEvents = createGoalEvents(away, awayGoals);

    return {
        homeGoals,
        awayGoals,
        homeScorers: homeEvents.map((event) => event.scorer),
        awayScorers: awayEvents.map((event) => event.scorer),
        homeAssists: homeEvents.map((event) => event.assister),
        awayAssists: awayEvents.map((event) => event.assister),
        result: homeGoals > awayGoals ? "HOME_WIN" : awayGoals > homeGoals ? "AWAY_WIN" : "DRAW"
    };
}

module.exports = { simulateMatch, calculateExpectedGoals, generateGoals };
