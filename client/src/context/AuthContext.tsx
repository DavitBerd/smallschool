/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../api/axios";
import type { User } from "../types/types";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) setAuthToken(token);
    else setAuthToken(null);
  }, [token]);

  const refreshUser = async () => {
    if (!token) return setUser(null);
    try {
      const res = await api.get("/users/me");
      setUser(res.data as User);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (e) {
      console.log(e);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setAuthToken(null);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const t = res.data.access_token;
      setToken(t);
      localStorage.setItem("token", t);
      setAuthToken(t);

      const me = await api.get("/users/me");
      setUser(me.data as User);
      localStorage.setItem("user", JSON.stringify(me.data));
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
