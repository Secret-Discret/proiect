import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/ShowMathStyles.module.css"

function MathUI() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { secretId, result } = state;

  if (!state || !result) {
    return <div className={styles.container}>No decode data.</div>;
  }

  return (
      <div className={styles.container}>
        <h1>🔐 Decode Attempt : {secretId}</h1>

        {result.success ? (
            <>
              <h2 style={{ color: "lime" }}>SUCCESS</h2>
              <p>Recovered Secret: {result.secret}</p>
              <p>Total Weight: {result.weight}</p>
            </>
        ) : (
            <>
              <h2 style={{ color: "red" }}>FAILED</h2>
              <p>Reason: {result.reason}</p>
            </>
        )}

        <h3>📐 Decode Steps</h3>
        <ul>
          {result.math_steps.map((s, i) => (
              <li key={i}>
                <strong>{s.step}</strong>
                {s.formula && <div>→ {s.formula}</div>}
              </li>
          ))}
        </ul>

        <button
            className={styles.button}
            onClick={() => navigate("/second/select-secret")}
        >
           Decode Another Secret
        </button>

        <button
            className={styles.button}
            onClick={() => navigate("/second")}
        >
           Restart Simulation
        </button>

        {result.success ? (
            <>
              <button className={styles.button} onClick={() =>
                  navigate("/second/attack", { state: { secretId: secretId } })
              }>
                Understood
              </button>
            </>
        ) : (
            <>

            </>
        )}

      </div>
  );
}


export default MathUI;
