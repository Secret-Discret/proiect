import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import introVideo from "../assets/852292-hd_1728_1080_25fps.mp4";

function ShamirTransition() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    const { encodeSteps, shares, threshold } = state;

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);

        const redirect = setTimeout(() => {
            navigate("/simple/math", {
                state: { shares, threshold },
            });
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div style={styles.container}>
            <video autoPlay muted loop style={styles.video}>
                <source src={introVideo} />
            </video>

            <div style={styles.overlay}>
                <h1>🔐 Splitting Secret</h1>
                <p>Certainly not doing illegal math..</p>
                <p>Continuing in {countdown}s</p>

                <div style={styles.math}>
                    {encodeSteps.map((s, i) => (
                        <div key={i}>
                            <strong>{s.step}</strong>
                            <div>→ {s.formula}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { position: "relative", height: "100vh" },
    video: { width: "100%", height: "100%", objectFit: "cover" },
    overlay: {
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        color: "#00ff00",
        padding: "24px",
        overflowY: "auto",
    },
    math: {
        marginTop: "20px",
        fontFamily: "Courier New, monospace",
        fontSize: "0.9rem",
    },
};

export default ShamirTransition;
