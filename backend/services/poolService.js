const premierLeaguePools = require("../data/pools/premierLeaguePools");
const worldCupPools = require("../data/pools/worldCupPools");

function getTier() {
    const random = Math.random();

    if (random < 0.2) {
        return "elite";
    }

    if (random < 0.6) {
        return "strong";
    }

    return "average";
}

function getPool(mode) {
    if (mode === "worldcup") {
        return worldCupPools;
    }

    return premierLeaguePools;
}

function getBasePosition(position) {
    if (position.startsWith("CB")) {
        return "CB";
    }

    if (position.startsWith("CM")) {
        return "CM";
    }

    if (position.startsWith("FW")) {
        return "FW";
    }

    return position;
}

function spinPool(position, mode) {
    const pool = getPool(mode);

    const tier = getTier();

    const basePosition = getBasePosition(position);

    const positionPool = pool[basePosition];

    if (!positionPool) {
        return null;
    }

    const teams = positionPool[tier];

    if (!teams || teams.length === 0) {
        return null;
    }

    const selectedTeam =
        teams[Math.floor(Math.random() * teams.length)];

    return {
        position,
        tier,
        team: selectedTeam.team,
        players: selectedTeam.players
    };
}

module.exports = {
    spinPool
};