import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MULTI_API_BASE = import.meta.env.VITE_MULTI_API_BASE;

function SelectRedactors() {
  const [redactors, setRedactors] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { state } = useLocation();
  const secretId = state?.secretId;

  useEffect(() => {
    fetch(`${MULTI_API_BASE}/redactors`)
        .then(res => res.json())
        .then(setRedactors)
        .catch(() => setError("Failed to load redactors"));
  }, []);

  const toggle = (id) => {
    setSelectedIds(prev =>
        prev.includes(id)
            ? prev.filter(x => x !== id)
            : [...prev, id]
    );
  };

  const submit = async () => {
    try {
      await fetch(
          `${MULTI_API_BASE}/secrets/${secretId}/trust`,
          { method: "DELETE" }
      );

      const params = selectedIds.map(id => `redactor_ids=${id}`).join("&");

      await fetch(
          `${MULTI_API_BASE}/secrets/${secretId}/trust?${params}`,
          { method: "POST" }
      );

      const res = await fetch(
          `${MULTI_API_BASE}/secrets/${secretId}/decode`
      );

      const data = await res.json();

      navigate("/second/math", {
        state: {
          secretId,
          result: data
        }
      });
    } catch {
      setError("Decode failed");
    }
  };


  return (
      <div style={styles.container}>
        <h1>Select Redactors</h1>
        <p>No hints. Trust wisely.</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>
          {redactors.map(r => (
              <div
                  key={r.id}
                  onClick={() => toggle(r.id)}
                  style={{
                    ...styles.card,
                    border: selectedIds.includes(r.id)
                        ? "2px solid crimson"
                        : "1px solid #00ff00"
                  }}
              >
                <h3>{r.name}</h3>
                <p>Rank: {r.rank}</p>
              </div>
          ))}
        </div>

        <button style={styles.button} onClick={submit} disabled={!selectedIds.length}>
          Attempt Decode
        </button>
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
    paddingTop: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "16px",
    marginTop: "20px",
  },
  card: {
    padding: "12px",
    cursor: "pointer",
    borderRadius: "4px",
    backgroundColor: "black",
  },
  button: {
    backgroundColor: "black",
    color: "#00ff00",
    border: "1px solid #00ff00",
    padding: "8px 16px",
    cursor: "pointer",
    marginTop: "20px",
    fontFamily: "'Courier New', monospace",
  },
  error: {
    color: "red",
  },
};

export default SelectRedactors;
