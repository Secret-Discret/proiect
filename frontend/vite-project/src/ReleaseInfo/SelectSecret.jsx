import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SelectSecretStyles.module.css"

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
        <div className={styles.container}>
            <h1>Select a Secret</h1>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.grid}>
                {secrets.map((id) => (
                    <div
                        key={id}
                        className={styles.card}
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

export default SelectSecret;
