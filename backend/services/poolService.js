const premierLeaguePools = require("../data/premierLeaguePools");
const worldCupPools = require("../data/worldCupPools");


function getTier() {

    const random = Math.random();


    if (random < 0.2) {
        return "elite";
    }


    if (random < 0.6) {
        return "strong";
    }


    return "average";

}



function getPool(mode) {

    if (mode === "worldcup") {
        return worldCupPools;
    }


    return premierLeaguePools;

}



function spinPool(position, mode) {


    const pool = getPool(mode);


    const tier = getTier();


    const positionPool = pool[position];


    if (!positionPool) {

        return null;

    }



    const teams = positionPool[tier];


    const selectedTeam =
        teams[
            Math.floor(
                Math.random() * teams.length
            )
        ];



    return {

        position,

        tier,

        team: selectedTeam.team,

        players: selectedTeam.players

    };

}



module.exports = {
    spinPool
};