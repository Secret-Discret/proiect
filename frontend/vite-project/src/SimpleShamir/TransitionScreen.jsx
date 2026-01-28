import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import introVideo from "../assets/852292-hd_1728_1080_25fps.mp4";
import styles from "../styles/TransitionStyles.module.css"

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
    }, []);

    return (
        <div className={styles.container}>
            <video autoPlay muted loop className={styles.video}>
                <source src={introVideo} />
            </video>

            <div className={styles.overlay}>
                <h1>🔐 Encoding Secret</h1>
                <p>Certainly not doing illegal math..</p>
                <p>Continuing in {countdown}s</p>

                {encodeSteps.length > 0 && (
                    <div className={styles.mathPanel}>
                        <h3>📐 Encoding Steps</h3>
                        <ul className={styles.mathList}>
                            {encodeSteps.map((s, i) => (
                                <li key={i} className={styles.mathItem}>
                                    <strong>{s.step}</strong>
                                    {s.formula && <div className={styles.formula}>→ {s.formula}</div>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShamirTransition;