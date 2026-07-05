import { useState } from "react";

const API = "http://localhost:3000";

function App() {
    const [draft, setDraft] = useState(null);
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
        setDraft(data.data);
    }

    return (
        <div style={{ padding: 20, fontFamily: "Arial" }}>
            <h1>⚽ TactiCore Draft System</h1>

            {/* SPIN AREA */}
            <div style={{ marginBottom: 20 }}>
                <h2>Spin System</h2>

                <button onClick={() => handleSpin("CB")}>
                    Spin CB
                </button>

                <button onClick={() => handleSpin("FW")}>
                    Spin FW
                </button>

                <button onClick={() => handleSpin("CM")}>
                    Spin CM
                </button>
            </div>

            {/* RESULT */}
            <div style={{ marginBottom: 20 }}>
                <h2>Spin Result</h2>

                {loading && <p>Spinning...</p>}

                {spinResult && (
                    <pre>{JSON.stringify(spinResult, null, 2)}</pre>
                )}
            </div>

            {/* DRAFT */}
            <div>
                <h2>Your Draft</h2>

                {draft ? (
                    <pre>{JSON.stringify(draft, null, 2)}</pre>
                ) : (
                    <p>No players selected yet</p>
                )}
            </div>
        </div>
    );
}

export default App;