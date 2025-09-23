"use client"

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: number; name: string; email: string };

type AuthContextType = { 
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}`} })
        .then(res => res.json())
        .then(setUser);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}`}})
      .then(res => res.json())
      .then(setUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider")

    return context
}