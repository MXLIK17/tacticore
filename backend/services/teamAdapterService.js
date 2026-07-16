const players = require("../data/players");
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

function normalizeSlotPosition(position) {
    if (!position) return null;
    if (position.startsWith("CB")) return "CB";
    if (position.startsWith("CM")) return "CM";
    if (position.startsWith("FW")) return "FW";
    if (position.startsWith("ST")) return "ST";
    return position;
}

function findPlayer(name) {
    if (!name) return undefined;

    const exact = players.find((player) => player.name === name);
    if (exact) return exact;

    const lower = name.toLowerCase();
    return players.find((player) => {
        const playerName = player.name.toLowerCase();
        return playerName === lower
            || playerName.startsWith(`${lower} `)
            || playerName.startsWith(lower)
            || lower.startsWith(playerName.split(" ")[0]);
    });
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
                defense: player.defending,
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
                    player.stamina
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

function calculateTeamRating(draftSlots) {
    const attack = [];
    const midfield = [];
    const defense = [];
    const goalkeeper = [];

    Object.values(draftSlots).forEach((playerData) => {
        if (!playerData) {
            return;
        }

        const player = findPlayer(playerData.name);
        const rating = player ? getPlayerRating(player) : getFallbackRating(playerData);
        const position = player?.position || normalizeSlotPosition(playerData?.position);

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
                // Unknown historical entries retain a neutral contribution.
                attack.push(rating.attack);
                midfield.push(rating.midfield);
                defense.push(rating.defense);
                goalkeeper.push(rating.goalkeeper);
        }
    });

    const goalkeeperRating = Math.max(...goalkeeper.filter(Number.isFinite), 75);

    return {
        attack: Math.round(average(attack)),
        midfield: Math.round(average(midfield)),
        defense: Math.round(average(defense)),
        goalkeeper: Math.round(goalkeeperRating),
        overall: Math.round(
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
        return team;
    }

    if (team.attack) {
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
            attack: team.attack,
            midfield: team.midfield,
            defense: team.defense,
            goalkeeper: team.goalkeeper
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
