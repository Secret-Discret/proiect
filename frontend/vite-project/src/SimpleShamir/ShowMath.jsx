import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_SIMPLE_API_BASE;

function ShamirDecodeMath() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { shares, threshold } = state;

    const [result, setResult] = useState(null);

    useEffect(() => {
        const selected = shares.slice(0, threshold);

        fetch(`${API}/reconstruct`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shares: selected }),
        })
            .then((res) => res.json())
            .then(setResult);
    }, []);

    if (!result) {
        return <div style={{ color: "#00ff00" }}>Reconstructing…</div>;
    }

    return (
        <div style={styles.container}>
            <h1>🔓 Reconstruction</h1>

            <h2 style={{ color: "lime" }}>SUCCESS</h2>
            <p>Recovered Secret:</p>
            <pre style={styles.secret}>{result.secret}</pre>

            <h3>📐 Math Steps</h3>
            <ul>
                {result.math_steps.map((s, i) => (
                    <li key={i}>
                        <strong>{s.step}</strong>
                        <div>→ {s.formula}</div>
                    </li>
                ))}
            </ul>

            <button style={styles.button} onClick={() => navigate("/simple")}>
                Hide Another Secret
            </button>
        </div>
    );
}

const styles = {
    container: {
        background: "black",
        color: "#00ff00",
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "Courier New, monospace",
    },
    secret: {
        background: "#001100",
        padding: "12px",
        fontSize: "1.2rem",
    },
    button: {
        backgroundColor: "black",
        color: "#00ff00",
        border: "1px solid #00ff00",
        padding: "8px 16px",
        cursor: "pointer",
    },
};

export default ShamirDecodeMath;
