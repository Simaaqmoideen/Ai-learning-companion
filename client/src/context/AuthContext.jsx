import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("plrs_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .me()
      .then((response) => {
        setUser(response.user);
      })
      .catch(() => {
        localStorage.removeItem("plrs_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      async login(credentials) {
        const response = await api.login(credentials);
        localStorage.setItem("plrs_token", response.token);
        setUser(response.user);
        return response;
      },
      async signup(payload) {
        const response = await api.signup(payload);
        localStorage.setItem("plrs_token", response.token);
        setUser(response.user);
        return response;
      },
      logout() {
        localStorage.removeItem("plrs_token");
        setUser(null);
      },
      refreshUser() {
        return api.me().then((response) => {
          setUser(response.user);
          return response.user;
        });
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

