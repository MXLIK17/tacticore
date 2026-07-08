const premierLeaguePools = require("../data/premierLeaguePools");
const worldCupPools = require("../data/worldCupPools");

// tier probability system
function getTier() {
    const rand = Math.random();

    if (rand < 0.2) return "elite";     // rare
    if (rand < 0.6) return "strong";    // common
    return "average";                   // most common
}

// choose mode pool
function getPool(mode) {
    return mode === "worldcup"
        ? worldCupPools
        : premierLeaguePools;
}

function spinPool(position, mode = "premier") {
    const pool = getPool(mode);

    const tier = getTier();

    const positionPool = pool[position];

    if (!positionPool) {
        return {
            team: "Unknown",
            players: ["Generic Player"],
            tier
        };
    }

    const options = positionPool[tier];

    const selectedTeam =
        options[Math.floor(Math.random() * options.length)];

    const player =
        selectedTeam.players[
            Math.floor(Math.random() * selectedTeam.players.length)
        ];

    return {
        position,
        tier,
        team: selectedTeam.team,
        player
    };
}

module.exports = {
    spinPool
};