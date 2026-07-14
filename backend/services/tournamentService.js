const tournament =
require("../models/tournamentModel");


const {
    normalizeTeam
} = require("./teamAdapterService");





// ==============================
// GENERATE AI TEAMS
// ==============================


function generateAITeams(n = 10){


    const teams = [];


    for(let i = 0; i < n; i++){


        teams.push({

            name:`AI Team ${i+1}`,

            players:[]

        });


    }


    return teams;

}






// ==============================
// PREMIER LEAGUE
// ==============================


function startPremierLeague(userTeam){


    const safeUserTeam =
    normalizeTeam(userTeam);



    tournament.type =
    "premier-league";



    tournament.teams = [

        safeUserTeam,

        ...generateAITeams()

    ];



    tournament.fixtures = [];


    tournament.currentMatchIndex = 0;


    tournament.completed = false;



    return tournament;

}







function playNextMatch(){


    return {


        message:
        "Premier League simulation"


    };


}








// ==============================
// RESET
// ==============================


function resetTournament(){


    tournament.type = null;


    tournament.teams = [];


    tournament.history = [];


    tournament.currentMatch = 0;


    tournament.completed = false;



    return tournament;

}





module.exports = {


    startPremierLeague,


    playNextMatch,


    resetTournament

};