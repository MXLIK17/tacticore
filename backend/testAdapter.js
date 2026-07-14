const {
    calculateTeamRating
} = require("./services/teamAdapterService");



const draft = {


    GK:{
        name:"Edwin van der Sar"
    },


    CB1:{
        name:"Rio Ferdinand"
    },


    CB2:{
        name:"Nemanja Vidic"
    },


    LB:{
        name:"Ashley Cole"
    },


    RB:{
        name:"Gary Neville"
    },


    CM1:{
        name:"Paul Scholes"
    },


    CM2:{
        name:"Patrick Vieira"
    },


    CM3:{
        name:"Kevin De Bruyne"
    },


    FW1:{
        name:"Cristiano Ronaldo"
    },


    FW2:{
        name:"Thierry Henry"
    },


    ST:{
        name:"Sergio Aguero"
    }


};



console.log(
    calculateTeamRating(draft)
);