const {
    normalizeSlotPosition,
    resolveDraftPlayer,
} = require("./playerResolver");
const draft = require("../models/draftModel");

function generatePlayer(name, position, stats) {
    return {
        name,
        position,
        speed: stats.speed || 70,
        shooting: stats.shooting || 70,
        passing: stats.passing || 70,
        defense: stats.defense || 70,
        stamina: stats.stamina || 70
    };
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

    switch (player.position) {
        case "GK":
            return {
                attack: 10,
                midfield: 30,
                defense: player.defending || 75,
                goalkeeper: average([
                    player.handling,
                    player.reflexes,
                    player.positioning,
                    player.diving
                ])
            };

        case "CB":
            return {
                attack: 35,
                midfield: 60,
                defense: average([
                    player.defending,
                    player.tackling,
                    player.marking,
                    player.positioning
                ]),
                goalkeeper: 0
            };

        case "LB":
        case "RB":
            return {
                attack: average([
                    player.passing,
                    player.dribbling,
                    player.crossing || 70
                ]),
                midfield: average([
                    player.passing,
                    player.stamina || player.physical
                ]),
                defense: average([
                    player.defending,
                    player.tackling,
                    player.marking
                ]),
                goalkeeper: 0
            };

        case "CM":
            return {
                attack: average([
                    player.shooting,
                    player.creativity,
                    player.vision
                ]),
                midfield: average([
                    player.passing,
                    player.vision,
                    player.creativity
                ]),
                defense: average([
                    player.defending,
                    player.tackling || 60
                ]),
                goalkeeper: 0
            };

        case "FW":
        case "ST":
            return {
                attack: average([
                    player.shooting,
                    player.finishing,
                    player.dribbling
                ]),
                midfield: average([
                    player.passing,
                    player.vision || 75
                ]),
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

    Object.values(draftSlots).forEach((playerData) => {
        if (!playerData?.name) {
            return;
        }

        const player = resolveDraftPlayer(playerData);
        const rating = getPlayerRating(player);
        const position = player.position || normalizeSlotPosition(playerData.position);

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

    return {
        attack: safeRound(average(attack)),
        midfield: safeRound(average(midfield)),
        defense: safeRound(average(defense)),
        goalkeeper: safeRound(goalkeeperRating),
        overall: safeRound(
            (
                average(attack)
                + average(midfield)
                + average(defense)
                + goalkeeperRating
            ) / 4
        )
    };
}

function buildFinalTeam() {
    const slots = draft.slots;
    const selectedPlayers = Object.values(slots).filter(
        (player) => player !== null && player !== undefined
    );
    const ratings = calculateTeamRating(slots);

    return {
        name: "User Team",
        slots,
        players: selectedPlayers,
        attack: ratings.attack,
        midfield: ratings.midfield,
        defense: ratings.defense,
        goalkeeper: ratings.goalkeeper,
        overall: ratings.overall
    };
}

function normalizeTeam(team) {
    if (team.players && Array.isArray(team.players)) {
        return {
            ...team,
            attack: Number.isFinite(team.attack) ? team.attack : 75,
            midfield: Number.isFinite(team.midfield) ? team.midfield : 75,
            defense: Number.isFinite(team.defense) ? team.defense : 75,
            goalkeeper: Number.isFinite(team.goalkeeper) ? team.goalkeeper : 75,
            players: team.players.map((player) => {
                const resolved = resolveDraftPlayer(player);
                return {
                    name: resolved.name,
                    position: resolved.position,
                    overall: resolved.overall,
                };
            }),
        };
    }

    if (team.attack != null) {
        return {
            name: team.name,
            players: [
                generatePlayer(`${team.name} ST`, "ST", {
                    shooting: team.attack,
                    speed: 80,
                    passing: 70,
                    defense: 40
                }),
                generatePlayer(`${team.name} CM`, "CM", {
                    passing: team.midfield,
                    speed: 75,
                    shooting: 70,
                    defense: 70
                }),
                generatePlayer(`${team.name} CB`, "CB", {
                    defense: team.defense,
                    speed: 70,
                    passing: 60,
                    shooting: 40
                }),
                generatePlayer(`${team.name} GK`, "GK", {
                    defense: team.goalkeeper,
                    speed: 50,
                    passing: 50,
                    shooting: 10
                })
            ],
            attack: Number.isFinite(team.attack) ? team.attack : 75,
            midfield: Number.isFinite(team.midfield) ? team.midfield : 75,
            defense: Number.isFinite(team.defense) ? team.defense : 75,
            goalkeeper: Number.isFinite(team.goalkeeper) ? team.goalkeeper : 75
        };
    }

    return {
        name: team.name || "Unknown Team",
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
