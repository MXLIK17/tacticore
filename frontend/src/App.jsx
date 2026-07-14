import { useState } from "react";

const API = "http://localhost:3000";

function App() {

    const [draft, setDraft] = useState({});
    const [spinResult, setSpinResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("premier");

    const [seasonResult, setSeasonResult] = useState(null);
    const [seasonLoading, setSeasonLoading] = useState(false);


    const positions = [
        "GK",
        "CB1",
        "CB2",
        "LB",
        "RB",
        "CM1",
        "CM2",
        "CM3",
        "FW1",
        "FW2",
        "ST"
    ];



    const layout = {

        GK:{ top:"85%", left:"50%" },

        CB1:{ top:"65%", left:"35%" },

        CB2:{ top:"65%", left:"65%" },

        LB:{ top:"70%", left:"15%" },

        RB:{ top:"70%", left:"85%" },

        CM1:{ top:"50%", left:"35%" },

        CM2:{ top:"50%", left:"50%" },

        CM3:{ top:"50%", left:"65%" },

        FW1:{ top:"30%", left:"35%" },

        FW2:{ top:"30%", left:"65%" },

        ST:{ top:"15%", left:"50%" }

    };




    async function handleSpin(position) {


        setLoading(true);


        const response = await fetch(
            `${API}/api/draft/spin`,
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    position:position,

                    mode:mode

                })

            }
        );


        const data = await response.json();


        console.log("Spin Response:", data);


        setSpinResult(data.data);


        setLoading(false);

    }




    async function handleSelect(position, player) {


        await fetch(
            `${API}/api/draft/select`,
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    position:position,

                    player:player

                })

            }
        );



        setDraft({

            ...draft,

            [position]:player

        });



        setSpinResult(null);

    }




    async function startSeason(){


        setSeasonLoading(true);



        const response =
            await fetch(

                `${API}/api/season/simulate`,

                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },


                    body:JSON.stringify({

                        team:{

                            name:"TactiCore FC",

                            players:Object.values(draft)

                        }

                    })

                }

            );



        const data =
            await response.json();



        console.log(
            "Season Result:",
            data
        );


        setSeasonResult(
            data.data
        );


        setSeasonLoading(false);

    }





    return (

        <div

        style={{

            padding:20,

            fontFamily:"Arial"

        }}

        >


            <h1>
                ⚽ TactiCore Draft
            </h1>



            <h2>
                Select Tournament
            </h2>



            <button

                onClick={() =>
                    setMode("premier")
                }

            >

                🏴 Premier League

            </button>




            <button

                style={{
                    marginLeft:10
                }}

                onClick={() =>
                    setMode("worldcup")
                }

            >

                🌎 World Cup

            </button>




            <h3>
                Current Mode: {mode}
            </h3>





            {/* PITCH */}


            <div

                style={{

                    position:"relative",

                    height:600,

                    width:"100%",

                    background:"green",

                    border:"2px solid black",

                    marginTop:20

                }}

            >


                {

                positions.map((position)=>(


                    <div

                        key={position}

                        style={{

                            position:"absolute",

                            ...layout[position],

                            transform:
                            "translate(-50%,-50%)"

                        }}

                    >



                        <div

                        style={{

                            background:"white",

                            padding:10,

                            borderRadius:10,

                            width:110,

                            textAlign:"center"

                        }}

                        >



                            <b>
                                {position}
                            </b>



                            {

                            draft[position]

                            ?

                            <p>
                                {draft[position].name}
                            </p>


                            :

                            <button

                                onClick={() =>
                                    handleSpin(position)
                                }

                            >

                                Spin

                            </button>


                            }



                        </div>


                    </div>


                ))

                }



            </div>





            <button

                onClick={startSeason}

                style={{

                    marginTop:20,

                    padding:15,

                    fontSize:18

                }}

            >

                🏆 Start Premier League Season

            </button>







            {/* SPIN RESULT */}


            <div

            style={{

                marginTop:30

            }}

            >


            <h2>
                🎲 Spin Result
            </h2>



            {

            loading &&

            <p>
                Spinning...
            </p>

            }





            {

            spinResult &&


            <div

            style={{

                border:"1px solid gray",

                padding:20,

                borderRadius:10

            }}

            >


                <h2>
                    {spinResult.tier}
                </h2>


                <h3>
                    {spinResult.team}
                </h3>


                <p>
                    Choose your player:
                </p>




                {

                spinResult.players.map((player)=>(


                    <button

                    key={player}

                    style={{

                        display:"block",

                        margin:5,

                        padding:8

                    }}



                    onClick={() =>

                        handleSelect(

                            spinResult.position,

                            {
                                name:player
                            }

                        )

                    }


                    >

                        {player}

                    </button>


                ))

                }



            </div>


            }



            </div>







            {/* SEASON RESULT */}


            {

            seasonLoading &&

            <p>
                Simulating Season...
            </p>

            }





            {

            seasonResult &&


            <div

            style={{

                marginTop:30,

                border:"2px solid black",

                padding:20,

                borderRadius:10

            }}

            >


                <h2>
                    🏆 Premier League Season
                </h2>



                <h3>

                    Record:

                    {" "}

                    {seasonResult.wins}

                    -

                    {seasonResult.draws}

                    -

                    {seasonResult.losses}


                </h3>



                <p>
                    Points: {seasonResult.points}
                </p>



                <p>

                    Goals:

                    {" "}

                    {seasonResult.goalsFor}

                    -

                    {seasonResult.goalsAgainst}

                </p>



                <h3>
                    🥇 Top Scorer
                </h3>


                <p>
                    {seasonResult.topScorer?.name}
                </p>




                <h3>
                    🎯 Top Assister
                </h3>


                <p>
                    {seasonResult.topAssister?.name}
                </p>



            </div>


            }



        </div>

    );

}


export default App;