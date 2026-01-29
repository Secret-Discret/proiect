import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { lagrangeReconstruct } from "./shamirMath.js";
import introVideo from "../assets/852292-hd_1728_1080_25fps.mp4";
import EndCard from "./EndCard.jsx";

export default function ShowMath() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [math, setMath] = useState(null);
    const [visibleStepCount, setVisibleStepCount] = useState(0);
    const [showEndCard, setShowEndCard] = useState(false);

    useEffect(() => {
        if (!state?.coalition) {
            navigate("/emergency");
            return;
        }

        fetch("http://localhost:8000/hierarchical/reconstruct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                state.coalition.map(u => u.id)
            )
        })
        .then(res => {
            if (!res.ok) {
            throw new Error("Reconstruction failed");
            }
            return res.json();
        })
        .then(data => {
            const PRIME = BigInt(data.prime);

            const shares = data.shares_used.map(s => ({
            x: Number(s.x),
            y: BigInt(s.y)
            }));

            const result = lagrangeReconstruct(shares, PRIME);

            setMath({
            prime: PRIME,
            shares,
            reconstructed: result.secret,
            steps: result.steps
            });
        })
        .catch(err => {
            console.error(err);
            navigate("/");
        });
    }, [state, navigate]);

//step reveal
    useEffect(() => {
      if (!math) return;
      if (visibleStepCount >= math.steps.length) return;

      const interval = setInterval(() => {
        setVisibleStepCount(v => Math.min(v + 1, math.steps.length));
      }, 800); //800ms per step

      return () => clearInterval(interval);
    }, [math, visibleStepCount]);

    if (!math) return <div>Reconstructing…</div>;

    return (
        <div style={styles.container}>
            <video src={introVideo} autoPlay muted loop style={styles.video} />
            <div style={styles.overlay}>
              <h1 style={styles.title}>Secret Reconstruction</h1>
              <MathShares shares={math.shares} />
              <MathSteps steps={math.steps.slice(0, visibleStepCount)} prime={math.prime} />

              {visibleStepCount >= math.steps.length && !showEndCard && (
                <div style={styles.resultSection}>
                  <div>
                    Reconstructed Secret: <strong>{math.reconstructed.toString()}</strong>
                  </div>
                  <button style={styles.nextButton} onClick={() => setShowEndCard(true)}> Next </button>
                </div>
              )}

              {showEndCard && <EndCard />}
            </div>
        </div>
    );
}

function MathShares({ shares }) {
  return (
    <div>
      <h2>Submitted Shares</h2>
        {shares.map((s, i) => (
            <div key={i}>
            Share {i + 1}: (x={s.x}, y={s.y.toString()})
            </div>
        ))}
    </div>
  );
}

function MathSteps({ steps, prime }) {
  return (
    <div style={styles.steps}>
      <h2>Lagrange Interpolation Steps</h2>

      {steps.map((step, i) => (
        <div key={i}>
          <h3>Share {i + 1}</h3>

          <div>xᵢ = {step.xi.toString()}</div>
          <div>yᵢ = {step.yi.toString()}</div>

          <div>
            Numerator (∏ −xⱼ): {step.num.toString()}
          </div>

          <div>
            Denominator (∏ (xᵢ − xⱼ)): {step.den.toString()}
          </div>

          <div>
            Inverse Denominator: {step.invDen.toString()}
          </div>

          <div>
            Lagrange Coefficient ℓᵢ(0): {step.lagrange.toString()}
          </div>

          <div>
            Contribution yᵢ · ℓᵢ(0): {step.contribution.toString()}
          </div>
        </div>
      ))}

      <div>
        Modulo Prime p = {prime.toString()}
      </div>
    </div>
  );
}



const styles = {
    container: {
        position: "relative",
        width: "100%",
        height: "680px",
        overflow: "hidden",
        fontFamily: "'Courier New', monospace",
        color: "#00ff00",
    },
    title: {
        textAlign: "left",
        fontSize: "24px",
        fontWeight: "bold"
    },
    subtitle: {
        textAlign: "left",
        marginBottom: "20px"
    },
    video: {
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        top: 0,
        left: 0,
        zIndex: -100,
    },
    overlay: {
        position: "relative",
        zIndex: 2,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        padding: "20px 40px",
        height: "680px",
        overflowY: "auto",
    },
    steps: {
        margin: "20px",
    },
    resultSection: {
        margin: "30px 0px 40px",
        fontSize: "20px", 
        display: "flex",
        gap: "20px",
        alignItems: "center"
    },
    nextButton: {
        padding: "12px 24px",
        border: "2px solid #00ff00",
        color: "#00ff00",
        backgroundColor: "#000000",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },
};