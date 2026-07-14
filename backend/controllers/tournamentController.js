const tournamentService =
require("../services/tournamentService");


const worldCupService =
require("../services/worldCupService");


const {
    buildFinalTeam
} = require("../services/teamAdapterService");





/**
 * START PREMIER LEAGUE
 */
function startLeague(req, res) {


    const { team } = req.body;


    if(!team){

        return res.status(400).json({

            success:false,

            message:"Team is required"

        });

    }



    const result =
    tournamentService.startPremierLeague(team);



    res.json({

        success:true,

        data:result

    });

}








/**
 * PLAY NEXT PREMIER LEAGUE MATCH
 */
function nextMatch(req,res){


    try{


        const result =
        tournamentService.playNextMatch();



        res.json({

            success:true,

            data:result

        });


    }


    catch(err){


        res.status(500).json({

            success:false,

            message:err.message

        });


    }


}










/**
 * FINALIZE TEAM FROM DRAFT
 */
function finalizeTeam(req,res){


    try{


        const userTeam =
        buildFinalTeam();



        const result =
        tournamentService.startPremierLeague(
            userTeam
        );



        res.json({

            success:true,

            message:
            "Team finalized and Premier League started",


            data:result

        });


    }


    catch(err){


        res.status(500).json({

            success:false,

            message:err.message

        });


    }


}









// ==============================
// WORLD CUP
// ==============================




/**
 * START WORLD CUP
 */
function startWorldCup(req,res){


    try{


        const { team } =
        req.body;



        if(!team){

            return res.status(400).json({

                success:false,

                message:"Team is required"

            });

        }




        const result =
        worldCupService.startWorldCup(
            team
        );




        res.json({

            success:true,

            data:result

        });



    }


    catch(err){


        res.status(500).json({

            success:false,

            message:err.message

        });


    }


}









/**
 * PLAY NEXT WORLD CUP MATCH
 */
function nextWorldCupMatch(req,res){


    try{


        const result =
        worldCupService.playNextWorldCupMatch();




        res.json({

            success:true,

            data:result

        });



    }


    catch(err){


        res.status(500).json({

            success:false,

            message:err.message

        });


    }


}









module.exports = {


    // Premier League

    startLeague,

    nextMatch,

    finalizeTeam,



    // World Cup

    startWorldCup,

    nextWorldCupMatch

};