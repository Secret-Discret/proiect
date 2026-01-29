export default function UserCard({ user, onClick }) {
    const cardStyle = {
        ...styles.card,
        ...(user.available ? styles.available : styles.unavailable)
    };

  return (
    <div style={cardStyle} onClick={user.available ? onClick : undefined}>
      <div style={styles.name}>{user.name}</div>
      <div style={styles.role}>{getPositionFromWeight(user.weight)}</div>
      <div style={styles.weight}>Weight {user.weight}</div>

      {!user.available}
    </div>
  );
}

function getPositionFromWeight(weight) {
  switch (weight) {
    case 4:
      return "Director";
    case 3:
      return "Deputy Director";
    case 2:
      return "Senior Officer";
    case 1:
      return "Junior Officer";
    default:
      return "Unknown Role";
  }
}


const styles = {
    card: {
        width: "140px",
        padding: "12px",
        border: "2px solid #00ff00",
        color: "#00ff00",
        textAlign: "center",
        transition: "all 0.2s ease"
    },
    available: {
        cursor: "pointer",
        backgroundColor: "#000000",
    },
    unavailable: {
        backgroundColor: "#000000",
        opacity: 0.5,
        cursor: "not-allowed"
    },
    name: {
        fontWeight: "bold",
        marginBottom: "6px"
    },
    role: {
        fontSize: "13px",
        fontStyle: "italic",
        marginBottom: "6px"
        },
    weight: {
        fontSize: "14px"
    }
};
