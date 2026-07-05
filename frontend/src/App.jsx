import { useState } from "react";

const API = "http://localhost:3000";

function App() {
    const [draft, setDraft] = useState({});
    const [spinResult, setSpinResult] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const data = await res.json();

    // safer merge (IMPORTANT FIX)
    setDraft((prev) => ({
        ...prev,
        [position]: player
    }));

    setSpinResult(null);
}

    const positions = ["GK", "CB1", "CB2", "LB", "RB", "CM1", "CM2", "CM3", "FW1", "FW2", "ST"];
    return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
        <h1>⚽ TactiCore Draft</h1>

        {/* GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {positions.map((pos) => (
                <div
                    key={pos}
                    style={{
                        border: "1px solid black",
                        padding: 10,
                        minHeight: 120
                    }}
                >
                    <h3>{pos}</h3>

                    {/* If filled */}
                    {draft[pos] ? (
                        <div>
                            <p><b>{draft[pos].name}</b></p>
                        </div>
                    ) : (
                        <button onClick={() => handleSpin(pos)}>
                            Spin
                        </button>
                    )}
                </div>
            ))}
        </div>

        {/* SPIN RESULT */}
        <div style={{ marginTop: 20 }}>
            <h2>Spin Result</h2>

            {spinResult && (
                <div style={{ border: "1px solid gray", padding: 10 }}>
                    <p><b>{spinResult.label}</b></p>
                    <button
                        onClick={() => handleSelect(spinResult.position, {
                            name: spinResult.label
                        })}
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