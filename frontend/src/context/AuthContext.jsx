import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 CHECK AUTH (CLAVE)
  const checkAuth = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // LOGIN
  const login = async (data) => {
    const res = await API.post("/auth/login", data);
    setUser(res.data.user);
  };

  // REGISTER
  const register = async (data) => {
    const res = await API.post("/auth/register", data);
    setUser(res.data.user);
  };

  // LOGOUT
  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
