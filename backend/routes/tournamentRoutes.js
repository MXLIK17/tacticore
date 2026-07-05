const express = require("express");
const router = express.Router();

const {
    startLeague,
    nextMatch,
    finalizeTeam
} = require("../controllers/tournamentController");

/**
 * Start tournament manually (debug)
 */
router.post("/start", startLeague);

/**
 * Start tournament from draft 
 */
router.post("/finalize", finalizeTeam);

/**
 * ▶ Play next match
 */
router.post("/next", nextMatch);

module.exports = router;