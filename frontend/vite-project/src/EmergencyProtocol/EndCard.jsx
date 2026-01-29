import { useState, useEffect } from "react";
import goodEnding from "../assets/good_ending.gif";

export default function EndCard() {
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    //fade in after 800ms
    const timer = setTimeout(() => setShowLine(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
        <div style={styles.overlay}>
            <div style={styles.endCard}>
                <p>All emergency protocols have been successfully executed.</p>
                <h1>Crisis Averted ☺</h1>
                <p style={{
                    ...styles.line,
                    opacity: showLine ? 1 : 0,
                    transition: "opacity 1.5s ease-in"
                }}>...for now</p>
            </div>
        </div>
  );
}

const styles = {
    endCard: {
        height: "100vh",
        width: "100vw",
        padding: "32px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "#00ff00",
        fontFamily: "'Courier New', Courier, monospace",
        textAlign: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
    },
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "#000000",
        backgroundImage: `url(${goodEnding})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
};
