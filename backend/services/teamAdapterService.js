const players = require("../data/players");



function findPlayer(playerName) {

    return players.find(
        player => player.name === playerName
    );

}



function getPlayerRating(playerName) {

    const player = findPlayer(playerName);


    // fallback if player is not added yet
    if (!player) {

        return {

            attack:75,
            midfield:75,
            defense:75,
            goalkeeper:75

        };

    }



    return {

        attack:
            Math.round(
                (player.shooting + player.speed) / 2
            ),


        midfield:
            player.passing,


        defense:
            player.defense,


        goalkeeper:
            player.position === "GK"
            ? player.shooting
            : 0

    };

}




function calculateTeamRating(draft) {


    let attack = [];
    let midfield = [];
    let defense = [];
    let goalkeeper = [];



    Object.values(draft).forEach(player => {


        const rating = getPlayerRating(player.name);



        if (
            player.position === "FW1" ||
            player.position === "FW2" ||
            player.position === "ST"
        ) {

            attack.push(rating.attack);

        }


        else if (
            player.position === "CM1" ||
            player.position === "CM2" ||
            player.position === "CM3"
        ) {

            midfield.push(rating.midfield);

        }


        else if (
            player.position === "CB1" ||
            player.position === "CB2" ||
            player.position === "LB" ||
            player.position === "RB"
        ) {

            defense.push(rating.defense);

        }


        else if (
            player.position === "GK"
        ) {

            goalkeeper.push(rating.goalkeeper);

        }


    });



    return {

        attack:
            average(attack),


        midfield:
            average(midfield),


        defense:
            average(defense),


        goalkeeper:
            average(goalkeeper)

    };

}




function average(array) {


    if(array.length === 0)
        return 75;


    return Math.round(

        array.reduce(
            (sum,value)=>sum+value,
            0
        )
        /
        array.length

    );

}




module.exports = {

    calculateTeamRating

};



module.exports = {

    calculateTeamRating

};