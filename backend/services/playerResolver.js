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
    const normalized = String(position).trim();
    if (!normalized) return null;
    if (normalized.startsWith("CB")) return "CB";
    if (normalized.startsWith("CM")) return "CM";
    if (normalized.startsWith("FW")) return "FW";
    if (normalized.startsWith("ST")) return "ST";
    if (normalized === "LW" || normalized === "RW") return "FW";
    if (normalized === "CDM") return "CM";
    return normalized;
}

function normalizeName(name) {
    return typeof name === "string" ? name.trim() : "";
}

function toFiniteNumber(value, fallback = 75) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function findPlayer(name) {
    const safeName = normalizeName(name);
    if (!safeName) return undefined;

    const alias = PLAYER_ALIASES[safeName];
    const candidates = alias ? [alias, safeName] : [safeName];

    for (const candidate of candidates) {
        const exact = players.find((player) => player.name === candidate);
        if (exact) return exact;
    }

    const lower = safeName.toLowerCase();
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

function buildPositionStats(normalizedPosition, base) {
    const shared = {
        pace: stat(base, 5, 1),
        shooting: stat(base, 4, 2),
        passing: stat(base, 6, 3),
        dribbling: stat(base, 5, 4),
        defending: stat(base, 6, 5),
        physical: stat(base, 5, 6),
    };

    if (normalizedPosition === "GK") {
        return {
            ...shared,
            shooting: 10,
            handling: stat(base, 4, 1),
            reflexes: stat(base, 5, 2),
            positioning: stat(base, 4, 3),
            diving: stat(base, 6, 4),
        };
    }

    if (normalizedPosition === "CB") {
        return {
            ...shared,
            tackling: stat(base, 5, 1),
            marking: stat(base, 4, 2),
            positioning: stat(base, 5, 3),
        };
    }

    if (normalizedPosition === "LB" || normalizedPosition === "RB") {
        return {
            ...shared,
            tackling: stat(base, 5, 1),
            marking: stat(base, 4, 2),
            crossing: stat(base, 6, 3),
        };
    }

    if (normalizedPosition === "CM") {
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

function ensureRequiredPlayerFields(player, fallbackPosition, fallbackOverall) {
    const normalizedPosition = normalizeSlotPosition(player?.position) || normalizeSlotPosition(fallbackPosition) || "CM";
    const overall = toFiniteNumber(player?.overall ?? player?.rating, fallbackOverall);
    const rating = toFiniteNumber(player?.rating ?? player?.overall, overall);
    const shared = {
        id: player?.id || `syn_${normalizedPosition.toLowerCase()}_${normalizeName(player?.name || "player").replace(/\s+/g, "_").toLowerCase()}`,
        name: normalizeName(player?.name) || "Unknown Player",
        team: normalizeName(player?.team || player?.club) || "International XI",
        nation: normalizeName(player?.nation) || "International",
        position: normalizedPosition,
        overall,
        rating,
    };

    return {
        ...shared,
        ...buildPositionStats(normalizedPosition, overall),
    };
}

function synthesizePlayer(name, position, overall = 80) {
    const normalized = normalizeSlotPosition(position) || position || "CM";
    const base = toFiniteNumber(overall, 80);
    return ensureRequiredPlayerFields({ name, position: normalized, overall: base }, normalized, base);
}

function resolveDraftPlayer(draftPlayer) {
    if (!draftPlayer || typeof draftPlayer !== "object") {
        return synthesizePlayer("Unknown Player", "CM", 75);
    }

    const name = normalizeName(draftPlayer.name);
    if (!name) {
        return synthesizePlayer("Unknown Player", draftPlayer?.position || "CM", draftPlayer?.overall || 75);
    }

    const position = normalizeSlotPosition(draftPlayer.position) || draftPlayer.position || "CM";
    const found = findPlayer(name);
    const fallbackOverall = toFiniteNumber(draftPlayer.overall ?? draftPlayer.rating, found?.overall ?? 75);

    if (found) {
        return ensureRequiredPlayerFields({ ...found, ...draftPlayer }, position, fallbackOverall);
    }

    return synthesizePlayer(name, position, fallbackOverall);
}

function normalizeDraftPlayers(playersInput) {
    const list = Array.isArray(playersInput) ? playersInput : Object.values(playersInput || {});

    return list
        .filter((player) => player && typeof player === "object" && normalizeName(player.name))
        .map((player) => {
            const resolved = resolveDraftPlayer(player);
            return {
                name: resolved.name,
                position: resolved.position,
                team: resolved.team || "International XI",
                rating: resolved.rating || resolved.overall || 75,
                overall: resolved.overall || resolved.rating || 75,
                pace: resolved.pace,
                shooting: resolved.shooting,
                passing: resolved.passing,
                dribbling: resolved.dribbling,
                defending: resolved.defending,
                physical: resolved.physical,
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
