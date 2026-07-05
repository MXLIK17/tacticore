const draft = require("../models/draftModel");
const { spinSlot } = require("../services/draftService");
const { getFormation } = require("../services/formationService");

// simple reroll counter
let rerolls = 3;

/**
 * SET FORMATION
 */
function setFormation(req, res) {
    const { formation } = req.body;

    const slots = getFormation(formation);

    if (!slots) {
        return res.status(400).json({
            success: false,
            message: "Invalid formation"
        });
    }

    draft.formation = formation;
    draft.slots = {};

    slots.forEach(slot => {
        draft.slots[slot] = null;
    });

    res.json({
        success: true,
        data: draft
    });
}

/**
 * SPIN SLOT
 */
function spin(req, res) {
    const { slot } = req.body;

    if (!slot) {
        return res.status(400).json({
            success: false,
            message: "Slot is required"
        });
    }

    const result = spinSlot(slot);

    res.json(result);
}

/**
 * SELECT PLAYER INTO SLOT
 */
function selectPlayer(req, res) {
    const { slot, player } = req.body;

    if (!slot || !player) {
        return res.status(400).json({
            success: false,
            message: "Slot and player are required"
        });
    }

    if (!draft.slots[slot]) {
        return res.status(400).json({
            success: false,
            message: "Invalid slot. Make sure formation is set first."
        });
    }

    if (draft.slots[slot] !== null) {
        return res.status(400).json({
            success: false,
            message: "Slot already filled"
        });
    }

    draft.slots[slot] = player;

    // check completion
    const allFilled = Object.values(draft.slots).every(p => p !== null);

    if (allFilled) {
        draft.completed = true;
    }

    res.json({
        success: true,
        data: draft
    });
}

/**
 * GET DRAFT STATE
 */
function getDraft(req, res) {
    res.json({
        success: true,
        data: draft
    });
}

/**
 * GET STATUS (frontend friendly)
 */
function getStatus(req, res) {
    res.json({
        success: true,
        data: {
            formation: draft.formation,
            slots: draft.slots,
            completed: draft.completed,
            rerolls
        }
    });
}

/**
 * RESET DRAFT
 */
function resetDraft(req, res) {
    draft.formation = null;
    draft.slots = {};
    draft.completed = false;
    rerolls = 3;

    res.json({
        success: true,
        message: "Draft reset",
        data: draft
    });
}

/**
 * EXPORTS
 */
module.exports = {
    setFormation,
    spin,
    selectPlayer,
    getDraft,
    getStatus,
    resetDraft
};