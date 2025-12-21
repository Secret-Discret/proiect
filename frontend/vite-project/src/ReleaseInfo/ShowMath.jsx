import { useLocation, useNavigate } from "react-router-dom";

function MathUI() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { secretId, result } = state;

  if (!state || !result) {
    return <div style={styles.container}>No decode data.</div>;
  }

  return (
      <div style={styles.container}>
        <h1>🔐 Decode Attempt — {secretId}</h1>

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

        <h3>📐 Math Steps</h3>
        <ul>
          {result.math_steps.map((s, i) => (
              <li key={i}>
                <strong>{s.step}</strong>
                {s.formula && <div>→ {s.formula}</div>}
              </li>
          ))}
        </ul>

        <button
            style={styles.button}
            onClick={() => navigate("/second/select-secret")}
        >
           Decode Another Secret
        </button>

        <button
            style={styles.button}
            onClick={() => navigate("/second")}
        >
           Restart Simulation
        </button>

        {result.success ? (
            <>
              <button style={styles.button} onClick={() =>
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

const styles = {
  container: {
    backgroundColor: "black",
    color: "#00ff00",
    minHeight: "100vh",
    fontFamily: "'Courier New', monospace",
    padding: "24px",
  },
  panel: {
    border: "1px solid #00ff00",
    padding: "16px",
    marginBottom: "20px",
  },
  step: {
    marginBottom: "16px",
  },
  stepTitle: {
    fontWeight: "bold",
    marginBottom: "4px",
  },
  description: {
    fontStyle: "italic",
    opacity: 0.85,
  },
  formula: {
    backgroundColor: "#001100",
    padding: "8px",
    marginTop: "4px",
    whiteSpace: "pre-wrap",
  },
  result: {
    marginTop: "20px",
    textAlign: "center",
  },
  secret: {
    fontSize: "1.5rem",
    marginTop: "8px",
  },
  button: {
    marginTop: "24px",
    padding: "10px 20px",
    backgroundColor: "black",
    color: "#00ff00",
    border: "1px solid #00ff00",
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
  },
};

export default MathUI;
