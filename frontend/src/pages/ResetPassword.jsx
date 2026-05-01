import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams(); // 🔥 token desde la URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMessage(res.data.message);

      // redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al resetear password");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Reset Password</h2>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <input
          type="password"
          placeholder="Nuevo password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Cambiar password
        </button>

        <p>
          <Link to="/">Volver al login</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  },
  input: {
    padding: "10px",
  },
  button: {
    padding: "10px",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
};

export default ResetPassword;
