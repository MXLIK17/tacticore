const {
    simulateMatch
} = require("./matchService");


const worldCupTeams =
require("../data/teams/worldCupTeams");

const {
    calculateTeamRating
} = require("./teamAdapterService");

function prepareTeamForSimulation(team) {
    if (team.attack != null) {
        return team;
    }

    if (!team.players || team.players.length === 0) {
        return team;
    }

    const slotMap = {};

    team.players.forEach((player, index) => {
        slotMap[index] = player;
    });

    const ratings = calculateTeamRating(slotMap);

    return {
        ...team,
        attack: ratings.attack,
        midfield: ratings.midfield,
        defense: ratings.defense,
        goalkeeper: ratings.goalkeeper
    };
}



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







function formatMatchEntry(matchSummary) {
    return {
        stage: matchSummary.round,
        teamA: matchSummary.teamA,
        teamB: matchSummary.teamB,
        score: matchSummary.score,
        winner: matchSummary.winner
    };
}

function buildWorldCupResponse(state, latestMatch) {
    const response = {
        started: state.started,
        userTeam: state.userTeam,
        currentRound: state.currentRound,
        rounds: state.rounds,
        history: state.history.map(formatMatchEntry),
        finished: state.finished,
        champion: state.champion
    };

    if (latestMatch) {
        response.match = formatMatchEntry(latestMatch);
    }

    return response;
}

function startWorldCup(team) {
    worldCupState = {
        started: true,
        userTeam: prepareTeamForSimulation(team),
        currentRound: 0,
        rounds: [
            "Round of 16",
            "Quarter Final",
            "Semi Final",
            "Final"
        ],
        history: [],
        finished: false,
        champion: null
    };

    return buildWorldCupResponse(worldCupState);
}









function playNextWorldCupMatch(){



    if(!worldCupState.started){

        throw new Error(
            "World Cup has not started"
        );

    }





    if (worldCupState.finished) {
        return buildWorldCupResponse(worldCupState);
    }






    const opponent =

    worldCupTeams[

        worldCupState.currentRound

    ];





    if (!opponent) {
        worldCupState.finished = true;
        worldCupState.champion = worldCupState.userTeam.name;

        return buildWorldCupResponse(worldCupState);
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

    return buildWorldCupResponse(worldCupState, matchSummary);

}








function getWorldCupState(){

    return worldCupState;

}







module.exports = {


    startWorldCup,


    playNextWorldCupMatch,


    getWorldCupState



};