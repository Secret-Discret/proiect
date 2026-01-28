import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LandingStyles.module.css"
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

            const data = await res.json();

            if (!data.success) {
                setError(data.error || "Unknown error while splitting secret");
                return;
            }

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
        <div className={styles.container}>
            <h1>🤫 Hide Something</h1>
            <p>Not asking why. We don't judge anyone.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <input className={styles.input}
                    placeholder="Your secret (nr or text)"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    required
                />

                <input className={styles.input}
                    type="number"
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                    placeholder="Number of shares"
                />

                <input className={styles.input}
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    placeholder="Threshold"
                />

                <button className={styles.button}>Split Secret</button>
            </form>
        </div>
    );
}

export default ShamirLanding;
