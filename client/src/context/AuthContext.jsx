import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("watch_user")) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("watch_token");
    if (!token) { setLoading(false); return; }

    apiRequest("/auth/me")
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("watch_user", JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem("watch_token");
        localStorage.removeItem("watch_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("watch_token", data.token);
    localStorage.setItem("watch_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function signup(name, email, password) {
    const data = await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem("watch_token", data.token);
    localStorage.setItem("watch_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("watch_token");
    localStorage.removeItem("watch_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
