const draft = require("../models/draftModel");

/**
 * Converts draft slots into tournament-ready team format
 */
function buildFinalTeam() {
    const slots = draft.slots;

    const players = Object.values(slots).filter(p => p !== null);

    return {
        name: "User Team",
        slots: slots,
        players: players
    };
}

/**
 * Ensures every team (user or AI) has valid structure
 */
function normalizeTeam(team) {
    if (!team.slots) {
        throw new Error("Invalid team format: missing slots");
    }

    return {
        name: team.name || "Unknown Team",
        slots: team.slots,
        players: Object.values(team.slots).filter(p => p !== null)
    };
}

module.exports = {
    buildFinalTeam,
    normalizeTeam
};