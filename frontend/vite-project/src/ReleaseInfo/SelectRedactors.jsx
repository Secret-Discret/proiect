import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/RedactorsStyles.module.css"
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
      setError("Decode failed!");
    }
  };


  return (
      <div className={styles.container}>
        <h1>Select Redactors</h1>
        <p>No hints. Trust wisely.</p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.grid}>
          {redactors.map(r => (
              <div
                  key={r.id}
                  onClick={() => toggle(r.id)}
                  className={`${styles.card} ${selectedIds.includes(r.id) ? styles.selected : ""}`}
              >
                <h3>{r.name}</h3>
                <p> {r.position}</p>
                <p>Rank: {r.rank}</p>
              </div>
          ))}
        </div>

        <button className={styles.button} onClick={submit} disabled={!selectedIds.length}>
          Attempt Decode
        </button>
      </div>
  );
}

export default SelectRedactors;
