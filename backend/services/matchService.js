function calculateTeamStrength(team) {
    if (!team || !team.players || team.players.length === 0) {
        return 50; // fallback baseline strength
    }

    let total = 0;

    team.players.forEach(player => {
        const speed = player.speed ?? 50;
        const shooting = player.shooting ?? 50;
        const passing = player.passing ?? 50;
        const defense = player.defense ?? 50;
        const stamina = player.stamina ?? 50;

        const avg = (speed + shooting + passing + defense + stamina) / 5;
        total += avg;
    });

    return total / team.players.length;
}

/**
 * Simulates a single football match
 */
function simulateMatch(homeTeam, awayTeam) {
    const homeStrength = calculateTeamStrength(homeTeam);
    const awayStrength = calculateTeamStrength(awayTeam);

    // small home advantage
    const homeBoost = 5;

    const homeScore = Math.max(
        0,
        Math.round((homeStrength + homeBoost) / 25 + Math.random() * 3)
    );

    const awayScore = Math.max(
        0,
        Math.round(awayStrength / 25 + Math.random() * 3)
    );

    let result = "draw";
    if (homeScore > awayScore) result = "home";
    else if (awayScore > homeScore) result = "away";

    return {
        homeScore,
        awayScore,
        result
    };
}

module.exports = {
    calculateTeamStrength,
    simulateMatch
};