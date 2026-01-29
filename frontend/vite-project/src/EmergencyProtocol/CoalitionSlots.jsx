export default function CoalitionSlots({ coalition, removeFromCoalition }) {
  const slots = Array.from({ length: 4 });

  return (
    <div style={styles.container}>
      {slots.map((_, index) => {
        const user = coalition[index];

        return (
          <div key={index} style={styles.slot}>
            {user ? (
              <div
                style={styles.filledSlot}
                onClick={() => removeFromCoalition(user)}
              >
                <div style={styles.userName}>{user.name}</div>
                <div style={styles.userWeight}>Weight {user.weight}</div>
              </div>
            ) : (
              <div style={styles.emptySlot}>Empty</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    color: "#00ff00",
  },
  slot: {
    width: "120px",
    height: "120px",
    border: "2px dashed #00ff00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  filledSlot: {
    cursor: "pointer",
    textAlign: "center"
  },
  userName: {
    fontWeight: "bold",
    marginBottom: "4px"
  },
  userWeight: {
    fontSize: "14px",
    marginBottom: "8px"
  },
  emptySlot: {
    opacity: 0.5
  }
};
