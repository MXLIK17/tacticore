function createPlayerStats(draft) {
    const stats = {};

    Object.values(draft).forEach((player) => {
        stats[player.name] = {
            goals: 0,
            assists: 0
        };
    });

    return stats;
}

function recordGoal(stats, scorer, assister) {
    if (stats[scorer]) {
        stats[scorer].goals++;
    }

    if (assister && stats[assister]) {
        stats[assister].assists++;
    }
}

function getTopScorer(stats) {
    const sorted = Object.entries(stats).sort(
        (a, b) => b[1].goals - a[1].goals
    );

    if (!sorted.length) {
        return null;
    }

    const [name, data] = sorted[0];

    return {
        name,
        goals: data.goals,
        assists: data.assists
    };
}

function getTopAssister(stats) {
    const sorted = Object.entries(stats).sort(
        (a, b) => b[1].assists - a[1].assists
    );

    if (!sorted.length) {
        return null;
    }

    const [name, data] = sorted[0];

    return {
        name,
        goals: data.goals,
        assists: data.assists
    };
}

module.exports = {
    createPlayerStats,
    recordGoal,
    getTopScorer,
    getTopAssister
};
