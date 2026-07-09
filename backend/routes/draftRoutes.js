const express = require("express");
const router = express.Router();

const {
    spin,
    selectPlayer,
    getRerolls,
    useReroll,
    getDraft,
    resetDraft
} = require("../controllers/draftController");


// Spin for a historical team
router.post("/spin", spin);


// Select a player from the revealed team
router.post("/select", selectPlayer);


// Get remaining rerolls
router.get("/rerolls", getRerolls);


// Use a reroll
router.post("/reroll", useReroll);


// Get current draft
router.get("/", getDraft);


// Reset draft (development/testing)
router.post("/reset", resetDraft);


module.exports = router;