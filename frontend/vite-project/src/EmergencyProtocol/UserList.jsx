import UserCard from "./UserCard";

export default function UserList({ users, addToCoalition }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Available Officials</h2>

      <div style={styles.list}>
        {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onClick={() => addToCoalition(user)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "10px"
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px"
  },
  list: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center"
  }
};
