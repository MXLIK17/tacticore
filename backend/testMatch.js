const {
    normalizeTeam
}=require("./services/teamAdapterService");


const brazil={

name:"Brazil 2002",

attack:95,
midfield:92,
defense:88,
goalkeeper:90

};



console.log(
    normalizeTeam(brazil)
);