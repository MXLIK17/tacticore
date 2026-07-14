import { useState } from "react";

const API = "http://localhost:3000";


function App() {


    const [draft,setDraft] = useState({});

    const [spinResult,setSpinResult] = useState(null);

    const [loading,setLoading] = useState(false);

    const [mode,setMode] = useState("premier");



    const [seasonResult,setSeasonResult] = useState(null);

    const [seasonLoading,setSeasonLoading] = useState(false);



    const [worldCupStarted,setWorldCupStarted] = useState(false);

    const [worldCupResult,setWorldCupResult] = useState(null);

    const [worldCupFinished,setWorldCupFinished] = useState(false);

    const [worldCupHistory,setWorldCupHistory] = useState([]);





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





    const layout={


        GK:{top:"85%",left:"50%"},

        CB1:{top:"65%",left:"35%"},

        CB2:{top:"65%",left:"65%"},

        LB:{top:"70%",left:"15%"},

        RB:{top:"70%",left:"85%"},

        CM1:{top:"50%",left:"35%"},

        CM2:{top:"50%",left:"50%"},

        CM3:{top:"50%",left:"65%"},

        FW1:{top:"30%",left:"35%"},

        FW2:{top:"30%",left:"65%"},

        ST:{top:"15%",left:"50%"}


    };







    async function handleSpin(position){


        setLoading(true);


        const response =
        await fetch(

            `${API}/api/draft/spin`,

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    position,

                    mode

                })

            }

        );


        const data =
        await response.json();



        setSpinResult(data.data);


        setLoading(false);


    }









    async function handleSelect(position,player){


        await fetch(

            `${API}/api/draft/select`,

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },


                body:JSON.stringify({

                    position,

                    player

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



        setSeasonResult(data.data);


        setSeasonLoading(false);


    }









    async function startWorldCup(){


        if(
            Object.keys(draft).length < 11
        ){

            alert(
                "Complete your draft first"
            );

            return;

        }



        const response =
        await fetch(

            `${API}/api/tournament/worldcup/start`,

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



        console.log(data);



        setWorldCupStarted(true);

        setWorldCupFinished(false);

        setWorldCupHistory([]);

        setWorldCupResult(null);


    }









    async function nextWorldCupMatch(){


        const response =
        await fetch(

            `${API}/api/tournament/worldcup/next`,

            {

                method:"POST"

            }

        );



        const data =
        await response.json();



        console.log(data);



        if(data.data.history){


            setWorldCupHistory(
                data.data.history
            );


        }



        if(data.data.match){


            setWorldCupResult(
                data.data.match
            );


        }

        else{


            setWorldCupFinished(true);


        }



    }











return (

<div style={{
padding:20,
fontFamily:"Arial"
}}>


<h1>
⚽ TactiCore
</h1>



<button onClick={()=>setMode("premier")}>

🏴 Premier League

</button>


<button

style={{marginLeft:10}}

onClick={()=>setMode("worldcup")}

>

🌎 World Cup

</button>



<h3>
Mode: {mode}
</h3>






<div

style={{

height:600,

background:"green",

position:"relative",

border:"2px solid black"

}}

>


{

positions.map(pos=>(


<div

key={pos}

style={{

position:"absolute",

...layout[pos],

transform:"translate(-50%,-50%)"

}}

>


<div

style={{

background:"white",

padding:10,

borderRadius:10

}}

>


<b>
{pos}
</b>


{

draft[pos]

?

<p>
{draft[pos].name}
</p>


:

<button

onClick={()=>handleSpin(pos)}

>

Spin

</button>

}



</div>


</div>


))


}


</div>







{loading && <p>Spinning...</p>}






{

spinResult &&


<div>


<h3>
{spinResult.team}
</h3>


{

spinResult.players.map(player=>(


<button

key={player}

onClick={()=>handleSelect(

spinResult.position,

{name:player}

)}

>

{player}

</button>


))


}


</div>


}








{
mode==="premier" &&


<div>


<button onClick={startSeason}>

Start Season

</button>



{

seasonResult &&


<div>


<h2>
Final Season Record
</h2>


<h1>

{seasonResult.wins}

-

{seasonResult.draws}

-

{seasonResult.losses}

</h1>


<p>
Points:
{seasonResult.points}
</p>


<p>
Goals:
{seasonResult.goalsFor}
-
{seasonResult.goalsAgainst}
</p>


<p>
Top Scorer:
{seasonResult.topScorer?.name}
</p>


<p>
Top Assister:
{seasonResult.topAssister?.name}
</p>


</div>


}


</div>


}









{
mode==="worldcup" &&


<div

style={{

marginTop:30,

border:"2px solid black",

padding:20

}}

>


<h2>
🌎 World Cup
</h2>



{

!worldCupStarted &&

<button onClick={startWorldCup}>

Start World Cup

</button>

}




{

worldCupStarted && !worldCupFinished &&

<button onClick={nextWorldCupMatch}>

Play Next Match

</button>

}






{

worldCupResult &&


<div>


<h3>
{worldCupResult.stage}
</h3>


<h2>

{worldCupResult.teamA}

vs

{worldCupResult.teamB}

</h2>


<h1>
{worldCupResult.score}
</h1>


<p>
Winner:
{worldCupResult.winner}
</p>


</div>


}







<h2>
Tournament History
</h2>



{

worldCupHistory.map((match,index)=>(


<div

key={index}

style={{

border:"1px solid gray",

margin:10,

padding:10

}}

>


<h3>
{match.stage}
</h3>


<p>
{match.teamA}
vs
{match.teamB}
</p>


<h2>
{match.score}
</h2>


<p>
Winner:
{match.winner}
</p>


</div>


))


}





{

worldCupFinished &&


<h1>
🏆 WORLD CUP CHAMPION
</h1>


}



</div>


}





</div>


);


}


export default App;