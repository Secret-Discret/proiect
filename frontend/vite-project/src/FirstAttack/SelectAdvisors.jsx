import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_Dell;

function SelectAdvisors() {
  const [advisors, setAdvisors] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const minWeight = location.state?.minWeight || 0;
  const accessStructureLength = location.state?.accessStructureLength || 0;

  useEffect(() => {
    fetch(`${API_BASE}/advisors`)
      .then((res) => res.json())
      .then(setAdvisors)
      .catch(() => setError("Failed to load advisors"));
  }, []);

  const toggleAdvisor = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    setError("");

    try {
      const params = selectedIds.map((id) => `ids=${id}`).join("&");

      const res = await fetch(
        `${API_BASE}/president/select-advisors?${params}`,
        { method: "POST" },
      );

      if (!res.ok) throw new Error("Advisor selection failed");
      const res2 = await fetch(`${API_BASE}/result`, { method: "GET" });
      if (!res2.ok) throw new Error("Failed to retrieve result");
      const data = await res2.json();
      if (data.success == true)
        navigate("/math", {
          state: { mathSteps: data.math_steps, nextPath: "/attack" },
        });
      else {
        const deleteRes = await fetch(`${API_BASE}/president/delete-advisors`, {
          method: "DELETE",
        });
        if (!deleteRes.ok) throw new Error("Failed to delete advisors");
        navigate("/math", {
          state: {
            mathSteps: data.math_steps,
            nextPath: "/advisors",
            minWeight,
            accessStructureLength,
          },
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Select Trusted Advisors</h1>
      <h2>
        Exactly {accessStructureLength} advisors, whose combined ranks total at
        least {minWeight}, hold the correct codes.
      </h2>
      <h3>Be careful who you trust</h3>

      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {advisors.map((advisor) => (
          <div
            key={advisor.id}
            onClick={() => toggleAdvisor(advisor.id)}
            style={{
              ...styles.card,
              border: selectedIds.includes(advisor.id)
                ? "3px solid crimson"
                : "1px solid gray",
            }}
          >
            <h3>{advisor.name}</h3>
            <p>{advisor.position}</p>
            <p>Rank: {advisor.rank}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedIds.length === 0}
        style={styles.button}
      >
        Submit
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

export default SelectAdvisors;
