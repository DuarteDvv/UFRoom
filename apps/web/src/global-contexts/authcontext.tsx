"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // dados do usuário
  const [token, setToken] = useState(""); // token JWT

  function getTokenFromCookie() {

    const match = document.cookie.match(/(^|;)\s*token=([^;]*)/);
    return match ? match[2] : "";
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = getTokenFromCookie();

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // login espera (user, access_token)
  const login = (user, access_token) => {
    
    setUser(user);
    setToken(access_token);
    document.cookie = `token=${access_token}; path=/; max-age=604800`;
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
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