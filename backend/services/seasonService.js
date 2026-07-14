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





function convertDraftPlayers(draft){


    return Object.values(draft)
        .map(player => {


            return {

                name: player.name,

                position: player.position

            };


        });


}





function simulateSeason(myTeam){


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
            myTeam.players
            ?
            myTeam.players
            :
            myTeam
        );



    const playerStats =
        createPlayerStats(
            players
        );



    /*
        Attach players for scorer selection
    */

    const teamWithPlayers = {


        ...myTeam,


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


        matchesPlayed:38,


        wins,

        draws,

        losses,


        goalsFor,

        goalsAgainst,


        points,


        matches,



        playerStats,



        topScorer:
            getTopScorer(
                playerStats
            ),



        topAssister:
            getTopAssister(
                playerStats
            )

    };


}





module.exports = {

    simulateSeason

};