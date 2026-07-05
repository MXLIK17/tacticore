const { players } = require("../models/playerModel");
const { randomUUID } = require("crypto");

function createPlayer(req, res) {
    const { name, position, speed, shooting, passing, defense, stamina } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Player name is required"
        });
    }

    const player = {
        id: randomUUID(),
        name,
        position,
        speed,
        shooting,
        passing,
        defense,
        stamina
    };

    players.push(player);

    res.json({
        success: true,
        data: player
    });
}

function getPlayers(req, res) {
    res.json({
        success: true,
        data: players
    });
}

module.exports = {
    createPlayer,
    getPlayers
};