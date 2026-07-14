function generatePlayer(
    name,
    position,
    stats
){


    return {

        name,

        position,


        speed:
        stats.speed || 70,


        shooting:
        stats.shooting || 70,


        passing:
        stats.passing || 70,


        defense:
        stats.defense || 70,


        stamina:
        stats.stamina || 70

    };


}






function normalizeTeam(team){



    // Already normalized

    if(
        team.players &&
        Array.isArray(team.players)
    ){

        return team;

    }






    // Historical teams

    if(
        team.attack
    ){


        return {


            name:
            team.name,



            players:[



                generatePlayer(

                    `${team.name} ST`,

                    "ST",

                    {

                        shooting:
                        team.attack,

                        speed:80,

                        passing:70,

                        defense:40

                    }

                ),





                generatePlayer(

                    `${team.name} CM`,

                    "CM",

                    {

                        passing:
                        team.midfield,

                        speed:75,

                        shooting:70,

                        defense:70

                    }

                ),





                generatePlayer(

                    `${team.name} CB`,

                    "CB",

                    {

                        defense:
                        team.defense,

                        speed:70,

                        passing:60,

                        shooting:40

                    }

                ),





                generatePlayer(

                    `${team.name} GK`,

                    "GK",

                    {

                        defense:
                        team.goalkeeper,

                        speed:50,

                        passing:50,

                        shooting:10

                    }

                )



            ]

        };


    }







    // AI teams fallback

    return {


        name:
        team.name || "Unknown Team",


        players:[



            generatePlayer(

                "AI ST",

                "ST",

                {}

            ),


            generatePlayer(

                "AI CM",

                "CM",

                {}

            ),


            generatePlayer(

                "AI CB",

                "CB",

                {}

            ),


            generatePlayer(

                "AI GK",

                "GK",

                {}

            )



        ]

    };



}





module.exports={

    normalizeTeam

};