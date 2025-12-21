import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/weighted";

function Landing() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [firstForm, setFirstForm] = useState(true);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFirstSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/president/${encodeURIComponent(name)}`,
        { method: "PUT" }
      );

      if (!response.ok) throw new Error("Failed to set president");

      setFirstForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSecondSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/secret/${encodeURIComponent(secret)}`,
        { method: "PUT" }
      );

      if (!response.ok) throw new Error("Failed to encode secret");

      const data = await response.json();
      console.log(
        "minWeight:",
        data.min_total_weight,
        "accessStructureLength:",
        data.access_structure_len
      );

      navigate("/math", {
        state: {
          mathSteps: data.math_steps,
          nextPath: "/advisors",
          minWeight: data.min_total_weight,
          accessStructureLength: data.access_structure_len,
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Welcome{" "}
        {gender === "male" ? "Mister" : gender === "female" ? "Misses" : ""}{" "}
        President!
      </h1>

      {error && <p style={styles.error}>{error}</p>}

      {firstForm ? (
        <form onSubmit={handleFirstSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <div style={styles.radioContainer}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />
              Male
            </label>

            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
              />
              Female
            </label>
          </div>
          <button style={styles.button} type="submit">
            Submit
          </button>
        </form>
      ) : (
        <form onSubmit={handleSecondSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter national secret code"
            value={secret}
            required
            onChange={(e) => setSecret(e.target.value)}
          />
          <button style={styles.button} type="submit">
            Encode Secret
          </button>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "black",
    color: "#00ff00",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "1.2rem",
    letterSpacing: "1px",
    whiteSpace: "pre-line",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    backgroundColor: "black",
    color: "#00ff00",
    border: "1px solid #00ff00",
    marginBottom: "10px",
    padding: "8px 12px",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    backgroundColor: "black",
    color: "#00ff00",
    border: "1px solid #00ff00",
    padding: "8px 16px",
    cursor: "pointer",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "1rem",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  radioContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "10px",
  },
  radioLabel: {
    cursor: "pointer",
  },
};

export default Landing;
