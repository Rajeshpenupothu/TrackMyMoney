import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, name, email: userEmail } = res.data;

      sessionStorage.setItem("token", token);

      const loggedUser = {
        name,
        email: userEmail,
      };

      sessionStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);

      return true;
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
