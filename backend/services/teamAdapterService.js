const players = require("../data/players");


// Find player in database

function findPlayer(name) {

    return players.find(
        player => player.name === name
    );

}



// Calculate individual player contribution

function getPlayerRating(player) {


    if (!player) {

        return {

            attack:75,
            midfield:75,
            defense:75,
            goalkeeper:75

        };

    }



    switch(player.position) {


        case "GK":

            return {

                attack:10,
                midfield:30,
                defense:player.defending,
                goalkeeper:
                    average([
                        player.handling,
                        player.reflexes,
                        player.positioning,
                        player.diving
                    ])

            };



        case "CB":

            return {

                attack:35,
                midfield:60,
                defense:
                    average([
                        player.defending,
                        player.tackling,
                        player.marking,
                        player.positioning
                    ]),
                goalkeeper:0

            };



        case "LB":
        case "RB":

            return {

                attack:
                    average([
                        player.passing,
                        player.dribbling,
                        player.crossing || 70
                    ]),

                midfield:
                    average([
                        player.passing,
                        player.stamina
                    ]),

                defense:
                    average([
                        player.defending,
                        player.tackling,
                        player.marking
                    ]),

                goalkeeper:0

            };



        case "CM":

            return {

                attack:
                    average([
                        player.shooting,
                        player.creativity,
                        player.vision
                    ]),

                midfield:
                    average([
                        player.passing,
                        player.vision,
                        player.creativity
                    ]),

                defense:
                    average([
                        player.defending,
                        player.tackling || 60
                    ]),

                goalkeeper:0

            };



        case "FW":
        case "ST":

            return {

                attack:
                    average([
                        player.shooting,
                        player.finishing,
                        player.dribbling
                    ]),

                midfield:
                    average([
                        player.passing,
                        player.vision || 75
                    ]),

                defense:35,

                goalkeeper:0

            };


        default:

            return {

                attack:75,
                midfield:75,
                defense:75,
                goalkeeper:75

            };

    }

}




function calculateTeamRating(draft) {


    let attack=[];
    let midfield=[];
    let defense=[];
    let goalkeeper=[];



    Object.values(draft).forEach(playerData=>{


        const player =
            findPlayer(playerData.name);



        const rating =
            getPlayerRating(player);



        attack.push(rating.attack);

        midfield.push(rating.midfield);

        defense.push(rating.defense);

        goalkeeper.push(rating.goalkeeper);


    });



    return {


        attack:
            Math.round(
                average(attack)
            ),



        midfield:
            Math.round(
                average(midfield)
            ),



        defense:
            Math.round(
                average(defense)
            ),



        goalkeeper:
            Math.round(
                Math.max(
                    ...goalkeeper
                )
            ),


        overall:
            Math.round(
                (
                    average(attack)
                    +
                    average(midfield)
                    +
                    average(defense)
                    +
                    Math.max(...goalkeeper)
                )
                /
                4
            )


    };

}




function average(array){


    if(!array.length)
        return 75;


    return array.reduce(
        (a,b)=>a+b,
        0
    )
    /
    array.length;


}




module.exports = {

    calculateTeamRating

};