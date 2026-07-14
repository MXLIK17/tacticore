const {
    simulateSeason
} = require("./services/seasonService");



const myTeam = {


    attack:95,

    midfield:93,

    defense:94,

    goalkeeper:93,


    players:[

        {
            name:"Cristiano Ronaldo",
            position:"FW"
        },

        {
            name:"Thierry Henry",
            position:"FW"
        },

        {
            name:"Sergio Aguero",
            position:"ST"
        },

        {
            name:"Kevin De Bruyne",
            position:"CM"
        }

    ]

};



console.log(
    simulateSeason(myTeam)
);