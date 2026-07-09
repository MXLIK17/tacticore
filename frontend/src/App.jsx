import { useState } from "react";

const API = "http://localhost:3000";

function App() {

    const [draft, setDraft] = useState({});
    const [spinResult, setSpinResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("premier");


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
        GK: { top: "85%", left: "50%" },

        CB1: { top: "65%", left: "35%" },
        CB2: { top: "65%", left: "65%" },

        LB: { top: "70%", left: "15%" },
        RB: { top: "70%", left: "85%" },

        CM1: { top: "50%", left: "35%" },
        CM2: { top: "50%", left: "50%" },
        CM3: { top: "50%", left: "65%" },

        FW1: { top: "30%", left: "35%" },
        FW2: { top: "30%", left: "65%" },

        ST: { top: "15%", left: "50%" }
    };


    async function handleSpin(position) {

        setLoading(true);

        const response = await fetch(
            `${API}/api/draft/spin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    position: position,
                    mode: mode
                })
            }
        );


        const data = await response.json();

        setSpinResult(data.data);

        setLoading(false);
    }



    async function handleSelect(position, player) {

        await fetch(
            `${API}/api/draft/select`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    position: position,
                    player: player
                })
            }
        );


        setDraft({
            ...draft,
            [position]: player
        });


        setSpinResult(null);
    }



    return (

        <div style={{ padding: 20 }}>

            <h1>
                ⚽ TactiCore Draft
            </h1>


            <h2>
                Select Mode
            </h2>


            <button
                onClick={() => setMode("premier")}
            >
                Premier League
            </button>


            <button
                onClick={() => setMode("worldcup")}
                style={{ marginLeft: 10 }}
            >
                World Cup
            </button>



            <h3>
                Current Mode: {mode}
            </h3>



            <div
                style={{
                    position: "relative",
                    height: "600px",
                    width: "100%",
                    background: "green",
                    marginTop: 20
                }}
            >

                {
                    positions.map((pos) => (

                        <div
                            key={pos}
                            style={{
                                position: "absolute",
                                ...layout[pos],
                                transform: "translate(-50%, -50%)"
                            }}
                        >

                            <div
                                style={{
                                    background: "white",
                                    padding: 10,
                                    borderRadius: 10,
                                    textAlign: "center",
                                    width: 100
                                }}
                            >

                                <b>
                                    {pos}
                                </b>


                                {
                                    draft[pos] ? (

                                        <p>
                                            {draft[pos].name}
                                        </p>

                                    ) : (

                                        <button
                                            onClick={() => handleSpin(pos)}
                                        >
                                            Spin
                                        </button>

                                    )
                                }


                            </div>


                        </div>

                    ))
                }


            </div>



            <h2>
                Spin Result
            </h2>


            {
                loading &&
                <p>
                    Spinning...
                </p>
            }


            {
                spinResult &&

                <div>

                    <h3>
                        {spinResult.tier}
                    </h3>


                    <p>
                        {spinResult.label}
                    </p>


                    <button
                        onClick={() =>
                            handleSelect(
                                spinResult.position,
                                {
                                    name: spinResult.label
                                }
                            )
                        }
                    >
                        Select
                    </button>


                </div>
            }


        </div>

    );

}


export default App;