const express = require("express");
const router = express.Router();

const {
    simulateSeason
} = require("../controllers/seasonController");

router.post("/simulate", simulateSeason);

module.exports = router;
