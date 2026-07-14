const express = require("express");

const router = express.Router();


const tournamentController =
require("../controllers/tournamentController");




// ==============================
// PREMIER LEAGUE
// ==============================


router.post(
    "/league/start",
    tournamentController.startLeague
);


router.post(
    "/league/next",
    tournamentController.nextMatch
);





// ==============================
// TEAM FINALIZATION
// ==============================


router.post(
    "/finalize",
    tournamentController.finalizeTeam
);






// ==============================
// WORLD CUP
// ==============================


router.post(
    "/worldcup/start",
    tournamentController.startWorldCup
);



router.post(
    "/worldcup/next",
    tournamentController.nextWorldCupMatch
);





module.exports = router;