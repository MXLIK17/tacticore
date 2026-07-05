const express = require("express");
const router = express.Router();

const {
    createPlayer,
    getPlayers
} = require("../controllers/playerController");

console.log("✅ playerRoutes.js loaded");

router.post("/", createPlayer);
router.get("/", getPlayers);

module.exports = router;