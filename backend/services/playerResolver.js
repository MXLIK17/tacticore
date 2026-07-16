const players = require("../data/players");

const PLAYER_ALIASES = {
    Alisson: "Alisson Becker",
    Ederson: "Ederson Moraes",
    "Gianluigi Buffon": "Gianluigi Buffon",
    Buffon: "Gianluigi Buffon",
    "Iker Casillas": "Iker Casillas",
    Casillas: "Iker Casillas",
    "Emiliano Martinez": "Emiliano Martinez",
    "Manuel Neuer": "Manuel Neuer",
    Marcos: "Marcos",
    "Lionel Messi": "Lionel Messi",
    Messi: "Lionel Messi",
    "Cristiano Ronaldo": "Cristiano Ronaldo",
    Ronaldo: "Ronaldo Nazario",
    Ronaldinho: "Ronaldinho",
    "Angel Di Maria": "Angel Di Maria",
    "Kylian Mbappe": "Kylian Mbappe",
    "Andres Iniesta": "Andres Iniesta",
    Iniesta: "Andres Iniesta",
    Xavi: "Xavi Hernandez",
    "Sergio Ramos": "Sergio Ramos",
    "Roberto Carlos": "Roberto Carlos",
    Cafu: "Cafu",
    "Zinedine Zidane": "Zinedine Zidane",
    "Luka Modric": "Luka Modric",
    "Toni Kroos": "Toni Kroos",
    "David Villa": "David Villa",
    "Robin van Persie": "Robin van Persie",
    "Miroslav Klose": "Miroslav Klose",
    "Olivier Giroud": "Olivier Giroud",
    "Julian Alvarez": "Julian Alvarez",
};

function normalizeSlotPosition(position) {
    if (!position) return null;
    if (position.startsWith("CB")) return "CB";
    if (position.startsWith("CM")) return "CM";
    if (position.startsWith("FW")) return "FW";
    if (position.startsWith("ST")) return "ST";
    if (position === "LW" || position === "RW") return "FW";
    if (position === "CDM") return "CM";
    return position;
}

function findPlayer(name) {
    if (!name) return undefined;

    const alias = PLAYER_ALIASES[name];
    const candidates = alias ? [alias, name] : [name];

    for (const candidate of candidates) {
        const exact = players.find((player) => player.name === candidate);
        if (exact) return exact;
    }

    const lower = name.toLowerCase();
    const aliasLower = alias?.toLowerCase();

    return players.find((player) => {
        const playerName = player.name.toLowerCase();
        const playerLast = playerName.split(" ").pop();

        return candidates.some((candidate) => {
            const candidateLower = candidate.toLowerCase();
            return playerName === candidateLower
                || playerName.includes(candidateLower)
                || candidateLower.includes(playerName)
                || playerLast === candidateLower
                || candidateLower.endsWith(` ${playerLast}`);
        }) || playerName === aliasLower
            || (aliasLower && playerName.includes(aliasLower))
            || playerName.startsWith(`${lower} `)
            || lower.startsWith(`${playerName.split(" ")[0]} `)
            || playerLast === lower;
    });
}

function stat(base, spread, index) {
    return Math.min(99, Math.max(40, Math.round(base + ((index * spread) % 7) - 3)));
}

function synthesizePlayer(name, position, overall = 80) {
    const normalized = normalizeSlotPosition(position) || position || "CM";
    const base = Number.isFinite(overall) ? overall : 80;

    const shared = {
        id: `syn_${normalized.toLowerCase()}_${name.replace(/\s+/g, "_").toLowerCase()}`,
        name,
        team: "International XI",
        nation: "International",
        position: normalized,
        overall: base,
        pace: stat(base, 5, 1),
        shooting: stat(base, 4, 2),
        passing: stat(base, 6, 3),
        dribbling: stat(base, 5, 4),
        defending: stat(base, 6, 5),
        physical: stat(base, 5, 6),
    };

    if (normalized === "GK") {
        return {
            ...shared,
            shooting: 10,
            handling: stat(base, 4, 1),
            reflexes: stat(base, 5, 2),
            positioning: stat(base, 4, 3),
            diving: stat(base, 6, 4),
        };
    }

    if (normalized === "CB") {
        return {
            ...shared,
            tackling: stat(base, 5, 1),
            marking: stat(base, 4, 2),
            positioning: stat(base, 5, 3),
        };
    }

    if (normalized === "LB" || normalized === "RB") {
        return {
            ...shared,
            tackling: stat(base, 5, 1),
            marking: stat(base, 4, 2),
            crossing: stat(base, 6, 3),
        };
    }

    if (normalized === "CM") {
        return {
            ...shared,
            creativity: stat(base, 6, 1),
            vision: stat(base, 5, 2),
            tackling: stat(base, 4, 3),
        };
    }

    return {
        ...shared,
        finishing: stat(base, 5, 1),
        vision: stat(base, 4, 2),
    };
}

function resolveDraftPlayer(draftPlayer) {
    if (!draftPlayer?.name) {
        return synthesizePlayer("Unknown Player", draftPlayer?.position || "CM", draftPlayer?.overall || 75);
    }

    const position = normalizeSlotPosition(draftPlayer.position) || draftPlayer.position || "CM";
    const found = findPlayer(draftPlayer.name);

    if (found) {
        return { ...found, position: found.position || position };
    }

    return synthesizePlayer(draftPlayer.name, position, draftPlayer.overall || 75);
}

function normalizeDraftPlayers(playersInput) {
    const list = Array.isArray(playersInput) ? playersInput : Object.values(playersInput || {});

    return list
        .filter((player) => player?.name)
        .map((player) => {
            const resolved = resolveDraftPlayer(player);
            return {
                name: resolved.name,
                position: resolved.position,
                overall: resolved.overall,
            };
        });
}

module.exports = {
    PLAYER_ALIASES,
    normalizeSlotPosition,
    findPlayer,
    synthesizePlayer,
    resolveDraftPlayer,
    normalizeDraftPlayers,
};
