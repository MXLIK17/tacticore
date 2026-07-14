const {
    random
}=Math;

function selectScorer(team){


    // Historical teams do not have player data yet
    if(!team.players){

        return null;

    }



    const attackers =
        team.players.filter(

            p =>
            p.position === "FW" ||
            p.position === "ST"

        );



    if(attackers.length === 0){

        return null;

    }



    return attackers[
        Math.floor(
            Math.random() *
            attackers.length
        )
    ];

}

function clamp(value,min,max){

    return Math.max(
        min,
        Math.min(
            value,
            max
        )
    );

}



function calculateExpectedGoals(
    team,
    opponent
){


    const attackDifference =
        team.attack -
        opponent.defense;



    const midfieldControl =
        (
            team.midfield -
            opponent.midfield
        )
        *
        0.15;



    let xG =
        1.2
        +
        attackDifference * 0.08
        +
        midfieldControl;



    const goalkeeperEffect =
        (
            opponent.goalkeeper - 85
        )
        *
        0.03;



    xG -= goalkeeperEffect;



    return clamp(
        xG,
        0.1,
        4
    );

}




function generateGoals(xG){


    let goals = 0;


    for(
        let i=0;
        i<6;
        i++
    ){

        if(
            Math.random()
            <
            xG / 6
        ){

            goals++;

        }

    }


    return goals;

}




function simulateMatch(
    homeTeam,
    awayTeam
){


    const homeXG =
        calculateExpectedGoals(
            homeTeam,
            awayTeam
        );



    const awayXG =
        calculateExpectedGoals(
            awayTeam,
            homeTeam
        );



    const homeGoals =
        generateGoals(homeXG);



    const awayGoals =
        generateGoals(awayXG);



   return {

    homeGoals,

    awayGoals,


    homeScorers:
        Array.from(
            {
                length: homeGoals
            },
            () =>
                selectScorer(homeTeam)
        ),


    awayScorers:
        Array.from(
            {
                length: awayGoals
            },
            () =>
                selectScorer(awayTeam)
        ),


    result:

        homeGoals > awayGoals

        ?
        "HOME_WIN"

        :

        awayGoals > homeGoals

        ?
        "AWAY_WIN"

        :

        "DRAW"

};


}



module.exports = {

    simulateMatch

};