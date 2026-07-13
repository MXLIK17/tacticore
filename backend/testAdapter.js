const {
    calculateTeamRating
} = require("./services/teamAdapterService");


const team = {

    ST:{
        position:"ST",
        name:"Ronaldo"
    },


    CM1:{
        position:"CM1",
        name:"Xavi"
    },


    GK:{
        position:"GK",
        name:"Neuer"
    }

};



console.log(
    calculateTeamRating(team)
);
