const {
    simulateMatch
} = require("./matchService");



function calculatePoints(result){

    if(result === "HOME_WIN"){
        return {
            home:3,
            away:0
        };
    }


    if(result === "AWAY_WIN"){
        return {
            home:0,
            away:3
        };
    }


    return {
        home:1,
        away:1
    };

}




function createLeagueTable(teams){


    return teams.map(team => ({


        name: team.name,


        played:0,

        wins:0,

        draws:0,

        losses:0,


        goalsFor:0,

        goalsAgainst:0,


        points:0


    }));

}




function simulateLeague(userTeam, opponents){


    const teams = [
        userTeam,
        ...opponents
    ];



    const table =
        createLeagueTable(
            teams
        );



    for(let i = 0; i < teams.length; i++){


        for(let j = i + 1; j < teams.length; j++){


            const home =
                teams[i];


            const away =
                teams[j];



            const result =
                simulateMatch(
                    home,
                    away
                );



            const homeTable =
                table[i];


            const awayTable =
                table[j];



            const points =
                calculatePoints(
                    result.result
                );



            homeTable.played++;

            awayTable.played++;



            homeTable.goalsFor +=
                result.homeGoals;


            homeTable.goalsAgainst +=
                result.awayGoals;



            awayTable.goalsFor +=
                result.awayGoals;


            awayTable.goalsAgainst +=
                result.homeGoals;



            if(points.home === 3){


                homeTable.wins++;

                awayTable.losses++;


            }

            else if(points.away === 3){


                awayTable.wins++;

                homeTable.losses++;


            }

            else{


                homeTable.draws++;

                awayTable.draws++;


            }



            homeTable.points += points.home;

            awayTable.points += points.away;


        }


    }



    return table.sort(

        (a,b) => {


            if(b.points !== a.points){

                return b.points - a.points;

            }


            return (
                (b.goalsFor - b.goalsAgainst)
                -
                (a.goalsFor - a.goalsAgainst)
            );

        }

    );


}



module.exports = {

    simulateLeague

};