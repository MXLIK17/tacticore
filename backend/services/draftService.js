const players = require("../data/players");

function spinSlot(slot) {
    // extract base position (CB1 → CB)
    const basePosition = slot.replace(/[0-9]/g, "");

    const pool = players.filter(p => p.position === basePosition);

    if (pool.length === 0) {
        return {
            success: false,
            message: "No players found for this slot"
        };
    }

    const randomPick = pool[Math.floor(Math.random() * pool.length)];

    const finalPool = pool.filter(p =>
        p.club === randomPick.club &&
        p.year === randomPick.year
    );

    return {
        success: true,
        data: {
            slot,
            constraint: {
                club: randomPick.club,
                year: randomPick.year
            },
            players: finalPool
        }
    };
}

module.exports = {
    spinSlot
};