const {
    normalizeSlotPosition,
    resolveDraftPlayer,
} = require("./playerResolver");
const draft = require("../models/draftModel");

function generatePlayer(name, position, stats = {}) {
    return resolveDraftPlayer({
        name,
        position,
        overall: stats.overall ?? stats.rating ?? 75,
        team: stats.team || "AI XI",
        ...stats,
    });
}

function average(values) {
    const validValues = values.filter(Number.isFinite);

    if (!validValues.length) {
        return 75;
    }

    return validValues.reduce((total, value) => total + value, 0) / validValues.length;
}

function safeRound(value, fallback = 75) {
    return Number.isFinite(value) ? Math.round(value) : fallback;
}

function getPlayerRating(player) {
    if (!player) {
        return {
            attack: 75,
            midfield: 75,
            defense: 75,
            goalkeeper: 75
        };
    }

    const normalized = resolveDraftPlayer(player);
    const position = normalizeSlotPosition(normalized.position) || "CM";

    switch (position) {
        case "GK":
            return {
                attack: 10,
                midfield: 30,
                defense: safeRound(average([
                    normalized.defending,
                    normalized.tackling,
                    normalized.marking,
                    normalized.positioning,
                    normalized.handling
                ])),
                goalkeeper: safeRound(average([
                    normalized.handling,
                    normalized.reflexes,
                    normalized.positioning,
                    normalized.diving
                ]))
            };

        case "CB":
            return {
                attack: 35,
                midfield: 60,
                defense: safeRound(average([
                    normalized.defending,
                    normalized.tackling,
                    normalized.marking,
                    normalized.positioning
                ])),
                goalkeeper: 0
            };

        case "LB":
        case "RB":
            return {
                attack: safeRound(average([
                    normalized.passing,
                    normalized.dribbling,
                    normalized.crossing || 70
                ])),
                midfield: safeRound(average([
                    normalized.passing,
                    normalized.physical,
                    normalized.stamina || normalized.physical
                ])),
                defense: safeRound(average([
                    normalized.defending,
                    normalized.tackling,
                    normalized.marking
                ])),
                goalkeeper: 0
            };

        case "CM":
            return {
                attack: safeRound(average([
                    normalized.shooting,
                    normalized.creativity,
                    normalized.vision
                ])),
                midfield: safeRound(average([
                    normalized.passing,
                    normalized.vision,
                    normalized.creativity
                ])),
                defense: safeRound(average([
                    normalized.defending,
                    normalized.tackling || 60
                ])),
                goalkeeper: 0
            };

        case "FW":
        case "ST":
            return {
                attack: safeRound(average([
                    normalized.shooting,
                    normalized.finishing,
                    normalized.dribbling
                ])),
                midfield: safeRound(average([
                    normalized.passing,
                    normalized.vision || 75
                ])),
                defense: 35,
                goalkeeper: 0
            };

        default:
            return {
                attack: 75,
                midfield: 75,
                defense: 75,
                goalkeeper: 75
            };
    }
}

function getFallbackRating(draftPlayer) {
    const overall = Number.isFinite(draftPlayer?.overall) ? draftPlayer.overall : 75;
    const position = normalizeSlotPosition(draftPlayer?.position);

    switch (position) {
        case "GK":
            return { attack: 10, midfield: 30, defense: overall, goalkeeper: overall };
        case "CB":
            return { attack: 35, midfield: 60, defense: overall, goalkeeper: 0 };
        case "LB":
        case "RB":
            return { attack: overall - 4, midfield: overall - 6, defense: overall, goalkeeper: 0 };
        case "CM":
            return { attack: overall - 5, midfield: overall, defense: overall - 10, goalkeeper: 0 };
        case "FW":
        case "ST":
            return { attack: overall, midfield: overall - 8, defense: 35, goalkeeper: 0 };
        default:
            return { attack: overall, midfield: overall, defense: overall, goalkeeper: overall };
    }
}

function calculateTeamRating(draftSlots) {
    const attack = [];
    const midfield = [];
    const defense = [];
    const goalkeeper = [];

    Object.values(draftSlots || {}).forEach((playerData) => {
        if (!playerData || typeof playerData !== "object" || !playerData.name) {
            return;
        }

        const player = resolveDraftPlayer(playerData);
        const rating = getPlayerRating(player);
        const position = normalizeSlotPosition(player.position) || normalizeSlotPosition(playerData.position) || "CM";

        switch (position) {
            case "GK":
                goalkeeper.push(rating.goalkeeper);
                break;
            case "CB":
            case "LB":
            case "RB":
                defense.push(rating.defense);
                break;
            case "CM":
                midfield.push(rating.midfield);
                break;
            case "FW":
            case "ST":
                attack.push(rating.attack);
                break;
            default:
                attack.push(rating.attack);
                midfield.push(rating.midfield);
                defense.push(rating.defense);
                goalkeeper.push(rating.goalkeeper);
        }
    });

    const goalkeeperValues = goalkeeper.filter(Number.isFinite);
    const goalkeeperRating = goalkeeperValues.length ? Math.max(...goalkeeperValues) : 75;
    const attackRating = average(attack);
    const midfieldRating = average(midfield);
    const defenseRating = average(defense);

    return {
        attack: safeRound(attackRating),
        midfield: safeRound(midfieldRating),
        defense: safeRound(defenseRating),
        goalkeeper: safeRound(goalkeeperRating),
        overall: safeRound((attackRating + midfieldRating + defenseRating + goalkeeperRating) / 4)
    };
}

function buildFinalTeam() {
    const slots = Object.fromEntries(Object.entries(draft.slots || {}).filter(([, player]) => player && typeof player === "object"));
    const resolvedSlots = Object.fromEntries(Object.entries(slots).map(([slot, player]) => [slot, resolveDraftPlayer(player)]));
    const ratings = calculateTeamRating(resolvedSlots);

    return {
        name: "User Team",
        slots: resolvedSlots,
        players: Object.values(resolvedSlots),
        attack: ratings.attack,
        midfield: ratings.midfield,
        defense: ratings.defense,
        goalkeeper: ratings.goalkeeper,
        overall: ratings.overall
    };
}

function normalizeTeam(team) {
    if (team && Array.isArray(team.players)) {
        const players = team.players
            .filter((player) => player && typeof player === "object")
            .map((player) => resolveDraftPlayer(player));

        const resolvedRatings = players.length ? calculateTeamRating(players.reduce((accumulator, player, index) => ({ ...accumulator, [index]: player }), {})) : getFallbackRating(team);

        return {
            ...team,
            attack: Number.isFinite(team.attack) ? team.attack : resolvedRatings.attack,
            midfield: Number.isFinite(team.midfield) ? team.midfield : resolvedRatings.midfield,
            defense: Number.isFinite(team.defense) ? team.defense : resolvedRatings.defense,
            goalkeeper: Number.isFinite(team.goalkeeper) ? team.goalkeeper : resolvedRatings.goalkeeper,
            players,
        };
    }

    if (team && team.attack != null) {
        return {
            name: team.name,
            players: [
                generatePlayer(`${team.name} ST`, "ST", { shooting: team.attack, speed: 80, passing: 70, defense: 40 }),
                generatePlayer(`${team.name} CM`, "CM", { passing: team.midfield, speed: 75, shooting: 70, defense: 70 }),
                generatePlayer(`${team.name} CB`, "CB", { defense: team.defense, speed: 70, passing: 60, shooting: 40 }),
                generatePlayer(`${team.name} GK`, "GK", { defense: team.goalkeeper, speed: 50, passing: 50, shooting: 10 })
            ],
            attack: Number.isFinite(team.attack) ? team.attack : 75,
            midfield: Number.isFinite(team.midfield) ? team.midfield : 75,
            defense: Number.isFinite(team.defense) ? team.defense : 75,
            goalkeeper: Number.isFinite(team.goalkeeper) ? team.goalkeeper : 75
        };
    }

    return {
        name: team?.name || "Unknown Team",
        players: [
            generatePlayer("AI ST", "ST", {}),
            generatePlayer("AI CM", "CM", {}),
            generatePlayer("AI CB", "CB", {}),
            generatePlayer("AI GK", "GK", {})
        ],
        attack: 75,
        midfield: 75,
        defense: 75,
        goalkeeper: 75
    };
}

module.exports = {
    normalizeTeam,
    calculateTeamRating,
    buildFinalTeam
};
