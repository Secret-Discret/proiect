import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_SIMPLE_API_BASE;

function ShamirLanding() {
    const [secret, setSecret] = useState("");
    const [n, setN] = useState();
    const [threshold, setThreshold] = useState();
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${API}/split`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secret, n, threshold }),
            });

            if (!res.ok) throw new Error("Split failed");

            const data = await res.json();

            navigate("/simple/transition", {
                state: {
                    encodeSteps: data.math_steps,
                    shares: data.shares,
                    threshold,
                },
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <h1>🤫 Hide Something</h1>
            <p>Not asking why. We don't judge anyone.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <input style={styles.input}
                    placeholder="Your secret (text)"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    required
                />

                <input style={styles.input}
                    type="number"
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                    placeholder="Number of shares"
                />

                <input style={styles.input}
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    placeholder="Threshold"
                />

                <button style={styles.button}>Split Secret</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        background: "black",
        color: "#00ff00",
        minHeight: "100vh",
        fontFamily: "Courier New, monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "300px",
    },
    input: {
        backgroundColor: "black",
        color: "#00ff00",
        border: "1px solid #00ff00",
        padding: "8px",
        width: "260px",
    },
    button: {
        backgroundColor: "black",
        color: "#00ff00",
        width: "275px",
        border: "1px solid #00ff00",
        padding: "8px 16px",
        cursor: "pointer",
    },
};

export default ShamirLanding;
