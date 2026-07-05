import { useState } from "react";

const API = "http://localhost:3000";

function App() {
    const [draft, setDraft] = useState({});
    const [spinResult, setSpinResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const positions = [
        "GK",
        "CB1", "CB2",
        "LB", "RB",
        "CM1", "CM2", "CM3",
        "FW1", "FW2",
        "ST"
    ];

    // Pitch layout (key upgrade)
    const layout = {
        GK:  { top: "85%", left: "50%" },

        CB1: { top: "65%", left: "35%" },
        CB2: { top: "65%", left: "65%" },

        LB:  { top: "70%", left: "15%" },
        RB:  { top: "70%", left: "85%" },

        CM1: { top: "50%", left: "35%" },
        CM2: { top: "50%", left: "50%" },
        CM3: { top: "50%", left: "65%" },

        FW1: { top: "30%", left: "35%" },
        FW2: { top: "30%", left: "65%" },

        ST:  { top: "15%", left: "50%" }
    };

    // SPIN SYSTEM
    async function handleSpin(position) {
        setLoading(true);

        const res = await fetch(`${API}/api/draft/spin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position })
        });

        const data = await res.json();

        setSpinResult(data.data);
        setLoading(false);
    }

    // SELECT PLAYER
    async function handleSelect(position, player) {
        const res = await fetch(`${API}/api/draft/select`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ position, player })
        });

        await res.json();

        // merge safely into slot-based draft
        setDraft((prev) => ({
            ...prev,
            [position]: player
        }));

        setSpinResult(null);
    }

    return (
        <div style={{ padding: 20, fontFamily: "Arial" }}>
            <h1>⚽ TactiCore Draft (Pitch Mode)</h1>

            {/* PITCH */}
            <div
                style={{
                    position: "relative",
                    height: "600px",
                    width: "100%",
                    background: "linear-gradient(green, #0a5f2c)",
                    borderRadius: "12px",
                    marginTop: 20,
                    border: "2px solid #0b3d1c"
                }}
            >
                {positions.map((pos) => (
                    <div
                        key={pos}
                        style={{
                            position: "absolute",
                            ...layout[pos],
                            transform: "translate(-50%, -50%)",
                            textAlign: "center"
                        }}
                    >
                        <div
                            style={{
                                width: 90,
                                minHeight: 60,
                                borderRadius: 10,
                                background: draft[pos] ? "#1f2937" : "white",
                                color: draft[pos] ? "white" : "black",
                                border: "1px solid #ccc",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 5
                            }}
                        >
                            <small style={{ fontSize: 10 }}>{pos}</small>

                            {draft[pos] ? (
                                <b style={{ fontSize: 11 }}>
                                    {draft[pos].name}
                                </b>
                            ) : (
                                <button
                                    style={{
                                        fontSize: 10,
                                        cursor: "pointer"
                                    }}
                                    onClick={() => handleSpin(pos)}
                                >
                                    Spin
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* SPIN RESULT PANEL */}
            <div style={{ marginTop: 20 }}>
                <h2>🎲 Spin Result</h2>

                {loading && <p>Spinning...</p>}

                {spinResult && (
                    <div
                        style={{
                            border: "1px solid #ccc",
                            padding: 15,
                            borderRadius: 10,
                            background: "#f9fafb"
                        }}
                    >
                        <h3>Available Player</h3>

                        <p><b>{spinResult.label}</b></p>

                        <button
                            style={{
                                marginTop: 10,
                                padding: "6px 12px",
                                cursor: "pointer"
                            }}
                            onClick={() =>
                                handleSelect(spinResult.position, {
                                    name: spinResult.label
                                })
                            }
                        >
                            Select Player
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;