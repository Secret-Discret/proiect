import skull from "../assets/skull.gif";

export default function TitleCard({ onDismiss }) {
  return (
    <div style={styles.overlay} onClick={onDismiss}>
      <div style={styles.card}>
        <h1 style={styles.title}>Emergency Override Protocol</h1>

        <p style={styles.text}>
            A catastrophic nuclear attack has disrupted the chain of command.
            Senior leadership is unreachable.
        </p>

        <p style={styles.text}>
            Emergency systems require a coalition of authorized officials
            to be activated.
        </p>

        <p style={styles.hint}>
            Click anywhere to continue
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 2000,
    backgroundColor: "#000000",
    backgroundImage: `url(${skull})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "500px 500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  card: {
    height: "100vh",
    padding: "32px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#00ff00",
    fontFamily: "'Courier New', Courier, monospace",
    textAlign: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "24px"
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "16px"
  },
  hint: {
    marginTop: "24px",
    fontSize: "13px",
    fontStyle: "italic"
  }
};
