import attackVideo from "../assets/13164095_3840_2160_30fps.mp4";

function Attack() {
  return (
    <div style={styles.container}>
      <video autoPlay loop muted playsInline style={styles.video}>
        <source src={attackVideo} type="video/mp4" />
      </video>

      <div style={styles.overlay}>
        <h2>Attack Successful!</h2>
        <p>The secret has been successfully reconstructed.</p>
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
};

export default Attack;
