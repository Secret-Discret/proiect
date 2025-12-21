import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MULTI_API_BASE = import.meta.env.VITE_MULTI_API_BASE;

function MultiLanding() {
  const [director, setDirector] = useState("");
  const [step, setStep] = useState(1);

  const [secrets, setSecrets] = useState({
    release_party_photos: "",
    make_public_UFO_truth: "",
    release_president_location: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDirectorSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
          `${MULTI_API_BASE}/director/${encodeURIComponent(director)}`,
          { method: "PUT" }
      );

      if (!res.ok) throw new Error("Failed to set director");
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEncodeSecrets = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      release_party_photos: Number(secrets.release_party_photos),
      make_public_UFO_truth: Number(secrets.make_public_UFO_truth),
      release_president_location: Number(secrets.release_president_location),
    };

    try {
      const res = await fetch(`${MULTI_API_BASE}/secrets`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to encode secrets");
      const data = await res.json();

      // navigate("/second/transition");

      navigate("/second/transition", {
        state: {
          result: data
        }
      });

    } catch (err) {
      setError(err.message);
    }
  };


  return (
      <div style={styles.container}>
        <h1 style={styles.title}>🔐 Multi-Secret Control Panel</h1>
        {director && step===2 && <h1 style={styles.title}>
          Director {director}, it is time to fulfill your duty.
        </h1>}
        {error && <p style={styles.error}>{error}</p>}

        {step === 1 && (
            <form onSubmit={handleDirectorSubmit} style={styles.form}>
              <input
                  style={styles.input}
                  placeholder="Director name"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  required
              />
              <button style={styles.button}>Authorize Director</button>
            </form>
        )}

        {step === 2 && (
            <form onSubmit={handleEncodeSecrets} style={styles.form}>
              <input
                  style={styles.input}
                  placeholder="Number of party photos released (number)"
                  type="number"
                  value={secrets.release_party_photos}
                  onChange={(e) =>
                      setSecrets({ ...secrets, release_party_photos: e.target.value })
                  }
                  required
              />
              <input
                  style={styles.input}
                  placeholder="UFO report to be released (number)"
                  type="number"
                  value={secrets.make_public_UFO_truth}
                  onChange={(e) =>
                      setSecrets({ ...secrets, make_public_UFO_truth: e.target.value })
                  }
                  required
              />
              <input
                  style={styles.input}
                  placeholder="Release real-time president location (number)"
                  type="number"
                  value={secrets.release_president_location}
                  onChange={(e) =>
                      setSecrets({ ...secrets, release_president_location: e.target.value })
                  }
                  required
              />

              <button style={styles.button}>Encode Secrets</button>
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
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    backgroundColor: "black",
    color: "#00ff00",
    border: "1px solid #00ff00",
    padding: "8px",
    width: "260px",
  },
  button: {
    backgroundColor: "black",
    color: "#00ff00",
    border: "1px solid #00ff00",
    padding: "8px 16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default MultiLanding;