import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/dashboard"); // después de registrar
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Register</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Registrarse
        </button>

        <p>
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
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
};

export default Register;
