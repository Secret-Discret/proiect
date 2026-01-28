import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import introVideo from "../assets/852292-hd_1728_1080_25fps.mp4";
import styles from "../styles/TransitionStyles.module.css"

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
        <div className={styles.container}>
            <video autoPlay muted loop playsInline className={styles.video}>
                <source src={introVideo} type="video/mp4" />
            </video>

            <div className={styles.overlay}>
                <h1>🔐 Encoding Secret</h1>
                <p>Encoding secrets into polynomial…</p>
                <p>Proceeding in {countdown}s</p>

                {mathSteps.length > 0 && (
                    <div className={styles.mathPanel}>
                        <h3>📐 Encoding Steps</h3>
                        <ul className={styles.mathList}>
                            {mathSteps.map((s, i) => (
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

export default TransitionScreen;
