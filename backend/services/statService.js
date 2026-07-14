function createPlayerStats(draft) {


    const stats = {};


    Object.values(draft).forEach(player => {


        stats[player.name] = {

            goals:0,

            assists:0

        };


    });


    return stats;

}




function recordGoal(
    stats,
    scorer,
    assister
){


    if(stats[scorer]){

        stats[scorer].goals++;

    }



    if(
        assister &&
        stats[assister]
    ){

        stats[assister].assists++;

    }


}




function getTopScorer(stats){


    return Object.entries(stats)
        .sort(
            (a,b)=>
                b[1].goals -
                a[1].goals
        )[0];

}




function getTopAssister(stats){


    return Object.entries(stats)
        .sort(
            (a,b)=>
                b[1].assists -
                a[1].assists
        )[0];

}




module.exports = {

    createPlayerStats,

    recordGoal,

    getTopScorer,

    getTopAssister

};