const {
    simulateSeason
} = require("../services/seasonService");

function simulateSeasonHandler(req, res) {
    try {
        const { team } = req.body;

        if (!team) {
            return res.status(400).json({
                success: false,
                message: "Team is required"
            });
        }

        const result = simulateSeason(team);

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    simulateSeason: simulateSeasonHandler
};
