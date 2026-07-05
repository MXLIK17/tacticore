const tournamentService = require("../services/tournamentService");
const { buildFinalTeam } = require("../services/teamAdapterService");

/**
 * START LEAGUE (legacy/manual start)
 */
function startLeague(req, res) {
    const { team } = req.body;

    if (!team) {
        return res.status(400).json({
            success: false,
            message: "Team is required"
        });
    }

    const result = tournamentService.startPremierLeague(team);

    res.json({
        success: true,
        data: result
    });
}

/**
 * PLAY NEXT MATCH
 */
function nextMatch(req, res) {
    try {
        const result = tournamentService.playNextMatch();

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

/**
 * FINALIZE TEAM FROM DRAFT → START TOURNAMENT
 */
function finalizeTeam(req, res) {
    try {
        const userTeam = buildFinalTeam();

        const result = tournamentService.startPremierLeague(userTeam);

        res.json({
            success: true,
            message: "Team finalized and tournament started",
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
    startLeague,
    nextMatch,
    finalizeTeam
};