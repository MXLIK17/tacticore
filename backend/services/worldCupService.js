const {
    simulateMatch
} = require("./matchService");


const worldCupTeams =
require("../data/teams/worldCupTeams");



let worldCupState = {

    started:false,

    userTeam:null,

    currentRound:0,

    rounds:[
        "Round of 16",
        "Quarter Final",
        "Semi Final",
        "Final"
    ],

    history:[],

    finished:false,

    champion:null

};







function startWorldCup(team){


    worldCupState = {

        started:true,

        userTeam:team,

        currentRound:0,

        rounds:[
            "Round of 16",
            "Quarter Final",
            "Semi Final",
            "Final"
        ],

        history:[],

        finished:false,

        champion:null

    };


    return worldCupState;

}









function playNextWorldCupMatch(){



    if(!worldCupState.started){

        throw new Error(
            "World Cup has not started"
        );

    }





    if(worldCupState.finished){

        return worldCupState;

    }






    const opponent =

    worldCupTeams[

        worldCupState.currentRound

    ];





    if(!opponent){

        worldCupState.finished = true;

        worldCupState.champion =
        worldCupState.userTeam.name;


        return worldCupState;

    }







    const result =

    simulateMatch(

        worldCupState.userTeam,

        opponent

    );








    let winner;





    if(result.homeGoals > result.awayGoals){


        winner =
        worldCupState.userTeam;


    }


    else if(result.awayGoals > result.homeGoals){


        winner =
        opponent;


    }


    else{


        // penalty shootout

        winner =

        Math.random() > 0.5

        ?

        worldCupState.userTeam

        :

        opponent;


    }









    const matchSummary = {


        round:

        worldCupState.rounds[

            worldCupState.currentRound

        ],



        teamA:

        worldCupState.userTeam.name,



        teamB:

        opponent.name,



        score:

        `${result.homeGoals}-${result.awayGoals}`,



        winner:

        winner.name


    };









    worldCupState.history.push(

        matchSummary

    );








    /*
        Move tournament forward
    */


    worldCupState.currentRound++;








    /*
        Final completed
    */


    if(

        worldCupState.currentRound >=

        worldCupState.rounds.length

    ){


        worldCupState.finished = true;


        worldCupState.champion =

        winner.name;


    }







    return worldCupState;

}








function getWorldCupState(){

    return worldCupState;

}







module.exports = {


    startWorldCup,


    playNextWorldCupMatch,


    getWorldCupState



};