const express = require("express");
const router = express.Router();

const {
    setFormation,
    spin,
    selectPlayer,
    getDraft,
    getStatus,
    resetDraft
} = require("../controllers/draftController");

/**
 *Set formation (e.g. 4-3-3, 3-5-2)
 */
router.post("/formation", setFormation);

/**
 *Spin for a slot (e.g. CB1, ST2)
 */
router.post("/spin", spin);

/**
 *Select player into slot
 */
router.post("/select", selectPlayer);

/**
 *Get raw draft state
 */
router.get("/", getDraft);

/**
 * 📈 Get frontend-friendly status
 */
router.get("/status", getStatus);

/**
 *Reset draft (dev/testing)
 */
router.post("/reset", resetDraft);

module.exports = router;