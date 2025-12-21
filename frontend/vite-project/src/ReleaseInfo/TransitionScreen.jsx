import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import introVideo from "../assets/852292-hd_1728_1080_25fps.mp4";

function TransitionScreen() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [countdown, setCountdown] = useState(5);

    const mathSteps = state?.result?.math_steps ?? [];

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate("/second/select-secret");
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div style={styles.container}>
            <video autoPlay muted loop playsInline style={styles.video}>
                <source src={introVideo} type="video/mp4" />
            </video>

            <div style={styles.overlay}>
                <h1>🔐 Secrets Secured</h1>
                <p>Encoding secrets into polynomial…</p>
                <p>Proceeding in {countdown}s</p>

                {mathSteps.length > 0 && (
                    <div style={styles.mathPanel}>
                        <h3>📐 Encoding Math</h3>
                        <ul style={styles.mathList}>
                            {mathSteps.map((s, i) => (
                                <li key={i} style={styles.mathItem}>
                                    <strong>{s.step}</strong>
                                    {s.formula && <div style={styles.formula}>→ {s.formula}</div>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}


const styles = {
    container: {
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "black",
        color: "#00ff00",
        fontFamily: "'Courier New', monospace",
    },
    video: {
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0,
    },
    overlay: {
        position: "relative",
        zIndex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        textAlign: "center",
        padding: "24px",
    },
    mathPanel: {
        marginTop: "24px",
        maxHeight: "35vh",
        width: "80%",
        overflowY: "auto",
        border: "1px solid #00ff00",
        padding: "12px",
        backgroundColor: "rgba(0, 20, 0, 0.85)",
        textAlign: "left",
    },
    mathList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
    },
    mathItem: {
        marginBottom: "12px",
    },
    formula: {
        marginTop: "4px",
        backgroundColor: "#001100",
        padding: "6px",
        whiteSpace: "pre-wrap",
    },
};


export default TransitionScreen;
