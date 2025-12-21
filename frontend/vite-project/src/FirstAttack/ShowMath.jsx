import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import introVideo from "../assets/852292-hd_1728_1080_25fps.mp4";

function ShowMath() {
  const location = useLocation();
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const containerRef = useRef(null);

  const mathSteps = location.state?.mathSteps || [];
  const nextPath = location.state?.nextPath || "/";
  const minWeight = location.state?.minWeight || 0;
  const accessStructureLength = location.state?.accessStructureLength || 0;

  useEffect(() => {
    const stepLines = mathSteps.map(
      (step) => `${step.step}: ${step.description}\n${step.formula}`
    );
    setLines(stepLines);
  }, [mathSteps]);

  useEffect(() => {
    if (currentLine < lines.length) {
      const timer = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentLine, lines]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentLine]);

  const handleNext = () => {
    if (nextPath === "/advisors") {
      navigate(nextPath, { state: { minWeight, accessStructureLength } });
    } else {
      navigate(nextPath);
    }
  };

  return (
    <div style={styles.container}>
      <video src={introVideo} autoPlay muted loop style={styles.video} />
      <div style={styles.overlay} ref={containerRef}>
        <h3>Mathematical Representation</h3>
        {lines.slice(0, currentLine).map((line, index) => (
          <p key={index}>{line}</p>
        ))}

        <button style={styles.button} onClick={handleNext}>
          Understood
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "'Courier New', monospace",
    color: "#00ff00",
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  overlay: {
    position: "relative",
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    padding: "20px",
    minHeight: "100%",
    overflowY: "auto",
  },
  button: {
    marginTop: "20px",
    backgroundColor: "black",
    color: "#00ff00",
    border: "1px solid #00ff00",
    padding: "8px 16px",
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
  },
};

export default ShowMath;
