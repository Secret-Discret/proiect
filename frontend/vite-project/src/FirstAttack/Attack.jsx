import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import attackVideo from "../assets/13164095_3840_2160_30fps.mp4";

function Attack() {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = () => {
      if (showPrompt) {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showPrompt, navigate]);

  return (
    <div style={styles.container}>
      <video
        autoPlay
        playsInline
        style={styles.video}
        onEnded={() => setShowPrompt(true)}
      >
        <source src={attackVideo} type="video/mp4" />
      </video>

      <div style={styles.overlay}>
        <h2>Attack Successful!</h2>
        <p>The secret has been successfully reconstructed.</p>
        {showPrompt && (
          <p style={styles.pressKey}>Press any key to continue...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    textAlign: "center",
  },
  pressKey: {
    marginTop: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#00ff00",
  },
};

export default Attack;
