const formations = {
    "4-3-3": [
        "GK",
        "LB", "CB1", "CB2", "RB",
        "CM1", "CM2", "CM3",
        "LW", "ST", "RW"
    ],

    "3-5-2": [
        "GK",
        "CB1", "CB2", "CB3",
        "LM", "CM1", "CM2", "CM3", "RM",
        "ST1", "ST2"
    ],

    "4-4-2": [
        "GK",
        "LB", "CB1", "CB2", "RB",
        "LM", "CM1", "CM2", "RM",
        "ST1", "ST2"
    ]
};

function getFormation(name) {
    return formations[name];
}

function getAllFormations() {
    return Object.keys(formations);
}

module.exports = {
    getFormation,
    getAllFormations
};