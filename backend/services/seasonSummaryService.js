function createSeasonSummary(seasonResult){


    return {

        title:
            "Premier League Season Summary",


        record:
            `${seasonResult.wins}-${seasonResult.draws}-${seasonResult.losses}`,


        wins:
            seasonResult.wins,


        draws:
            seasonResult.draws,


        losses:
            seasonResult.losses,


        points:
            seasonResult.points,


        goals:

        {

            scored:
                seasonResult.goalsFor,


            conceded:
                seasonResult.goalsAgainst

        },


        awards:

        {

            topScorer:
                seasonResult.topScorer,


            topAssister:
                seasonResult.topAssister

        }


    };

}


module.exports = {

    createSeasonSummary

};