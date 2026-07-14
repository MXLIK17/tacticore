const {
    startWorldCup,
    playNextWorldCupMatch
} = require("./services/worldCupService");





// Fake user team for testing

const myTeam = {

    name:"TactiCore FC",

    players:[

        {
            name:"Messi",
            position:"FW"
        },

        {
            name:"Van Dijk",
            position:"CB"
        },

        {
            name:"De Bruyne",
            position:"CM"
        }

    ]

};





console.log(
    "\n🌎 STARTING WORLD CUP\n"
);





let tournament =
startWorldCup(myTeam);




console.log(
    tournament
);







console.log(
    "\n⚽ PLAYING MATCHES\n"
);





while(!tournament.finished){


    const result =
    playNextWorldCupMatch();



    console.log(
        "\n----------------"
    );


    console.log(
        result
    );


    tournament =
    require("./services/worldCupService")
    .getWorldCupState
    ?
    require("./services/worldCupService")
    .getWorldCupState()
    :
    tournament;



}





console.log(
    "\n🏆 WORLD CUP COMPLETE"
);



console.log(
    tournament
);