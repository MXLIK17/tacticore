function selectScorer(team) {
    if (!team.players) return null;

    const attackers = team.players.filter((player) =>
        player.position === "FW" ||
        player.position === "ST" ||
        player.position?.startsWith("FW") ||
        player.position?.startsWith("ST")
    );

    if (!attackers.length) return null;
    return attackers[Math.floor(Math.random() * attackers.length)];
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

function safeRating(value) {
    return Number.isFinite(value) ? value : 75;
}

function calculateExpectedGoals(team, opponent, isHome = false) {
    const attackDifference = safeRating(team.attack) - safeRating(opponent.defense);
    const midfieldControl = (safeRating(team.midfield) - safeRating(opponent.midfield)) * 0.15;
    const goalkeeperEffect = (safeRating(opponent.goalkeeper) - 85) * 0.03;
    const xG = 1.05 + attackDifference * 0.055 + midfieldControl + (isHome ? 0.14 : 0) - goalkeeperEffect;
    return clamp(xG, 0.1, 3.4);
}

function generateGoals(xG) {
    let goals = 0;
    for (let chance = 0; chance < 6; chance++) {
        if (Math.random() < xG / 6) goals++;
    }
    return goals;
}

function simulateMatch(homeTeam, awayTeam) {
    const homeGoals = generateGoals(calculateExpectedGoals(homeTeam, awayTeam, true));
    const awayGoals = generateGoals(calculateExpectedGoals(awayTeam, homeTeam));

    return {
        homeGoals,
        awayGoals,
        homeScorers: Array.from({ length: homeGoals }, () => selectScorer(homeTeam)),
        awayScorers: Array.from({ length: awayGoals }, () => selectScorer(awayTeam)),
        result: homeGoals > awayGoals ? "HOME_WIN" : awayGoals > homeGoals ? "AWAY_WIN" : "DRAW"
    };
}

module.exports = { simulateMatch, calculateExpectedGoals, generateGoals };
