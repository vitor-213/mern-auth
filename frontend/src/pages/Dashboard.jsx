import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <p>Bienvenido: {user?.name}</p>
      <p>Email: {user?.email}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
