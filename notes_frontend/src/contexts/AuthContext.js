import React, { createContext, useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Update as needed

export const AuthContext = createContext();

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and helpers to the app */
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch user with token on mount
    if (token) {
      fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((userData) => {
          setUser(userData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [token]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    localStorage.setItem("auth_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  // PUBLIC_INTERFACE
  const register = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Registration failed");
    return login(email, password);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token && user),
        user,
        token,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
