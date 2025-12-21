import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MULTI_API_BASE = import.meta.env.VITE_MULTI_API_BASE;

function SelectSecret() {
    const [secrets, setSecrets] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${MULTI_API_BASE}/secrets`)
            .then(res => res.json())
            .then(data => setSecrets(data))
            .catch(() => setError("Failed to load secrets"));
    }, []);

    return (
        <div style={styles.container}>
            <h1>Select a Secret</h1>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.grid}>
                {secrets.map((id) => (
                    <div
                        key={id}
                        style={styles.card}
                        onClick={() =>
                            navigate("/second/redactors", { state: { secretId: id } })
                        }
                    >
                        🔐 {id}
                    </div>
                ))}
            </div>
        </div>
    );
}


const styles = {
    container: {
        backgroundColor: "black",
        color: "#00ff00",
        minHeight: "100vh",
        fontFamily: "'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginTop: "20px",
    },
    card: {
        padding: "20px",
        border: "1px solid #00ff00",
        cursor: "pointer",
        textAlign: "center",
        fontSize: "1.1rem",
    },
    error: {
        color: "red",
        marginTop: "10px",
    },
};

export default SelectSecret;
