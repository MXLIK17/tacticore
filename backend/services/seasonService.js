const {
    simulateMatch
} = require("./matchService");


const {
    createPlayerStats,
    recordGoal,
    getTopScorer,
    getTopAssister
} = require("./statService");


const premierLeagueTeams =
    require("../data/teams/premierLeagueTeams");

const {
    calculateTeamRating
} = require("./teamAdapterService");

function prepareTeamForSimulation(myTeam) {
    const team = myTeam.players
        ? myTeam
        : { players: Object.values(myTeam) };

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





function convertDraftPlayers(draft){


    return Object.values(draft)
        .map(player => {


            return {

                name: player.name,

                position: player.position || "FW"

            };


        });


}





function simulateSeason(myTeam){

    const preparedTeam = prepareTeamForSimulation(myTeam);

    let wins = 0;

    let draws = 0;

    let losses = 0;


    let goalsFor = 0;

    let goalsAgainst = 0;



    const matches = [];



    /*
        Create player stat database
    */

    const players =
        convertDraftPlayers(
            preparedTeam.players
            ?
            preparedTeam.players
            :
            preparedTeam
        );



    const playerStats =
        createPlayerStats(
            players
        );



    /*
        Attach players for scorer selection
    */

    const teamWithPlayers = {
        ...preparedTeam,
        players
    };





    for(let i = 0; i < 38; i++){



        const opponent =
            premierLeagueTeams[
                i %
                premierLeagueTeams.length
            ];



        const result =
            simulateMatch(
                teamWithPlayers,
                opponent
            );



        goalsFor += result.homeGoals;


        goalsAgainst += result.awayGoals;





        /*
            Record goals
        */


        result.homeScorers.forEach(
            scorer => {


                if(scorer){

                    recordGoal(

                        playerStats,

                        scorer.name,

                        null

                    );

                }


            }
        );






        if(result.homeGoals > result.awayGoals){


            wins++;


        }

        else if(
            result.homeGoals === result.awayGoals
        ){


            draws++;


        }

        else{


            losses++;


        }




        matches.push({

            opponent:
                opponent.name,

            score:
                `${result.homeGoals}-${result.awayGoals}`,

            outcome:
                result.result

        });



    }





    const points =
        wins * 3
        +
        draws;





    return {
        wins,
        draws,
        losses,
        points,
        goalsFor,
        goalsAgainst,
        topScorer: getTopScorer(playerStats),
        topAssister: getTopAssister(playerStats)
    };


}





module.exports = {

    simulateSeason

};