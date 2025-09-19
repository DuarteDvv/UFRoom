"use client";

import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // dados do usuário
  const [token, setToken] = useState(""); // token JWT

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    // opcional: salvar no localStorage
  };

  const logout = () => {
    setUser(null);
    setToken("");
    // opcional: remover do localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}