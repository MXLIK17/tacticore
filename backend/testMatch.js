const {
    simulateMatch
}
=
require("./services/matchService");



const myTeam = {


    attack:95,

    midfield:92,

    defense:93,

    goalkeeper:94


};



const opponent = {


    attack:88,

    midfield:86,

    defense:90,

    goalkeeper:89


};



console.log(

    simulateMatch(
        myTeam,
        opponent
    )

);