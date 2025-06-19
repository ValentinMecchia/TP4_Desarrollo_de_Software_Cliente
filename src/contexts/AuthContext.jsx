"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión activa al iniciar
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const url = `${API_BASE_URL}/api/auth/me`;
      console.log("Solicitando /api/auth/me a:", url);
      console.log("Cookies disponibles:", document.cookie);
      try {
        const res = await fetch(url, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });
        console.log("Respuesta de /api/auth/me:", res.status, res.statusText);
        const responseBody = await res.text();
        console.log("Cuerpo de la respuesta:", responseBody);
        if (res.ok) {
          const data = JSON.parse(responseBody);
          console.log("Datos de usuario:", data);
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error en fetchUser:", err);
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  // Iniciar login con Google (redirecciona)
  const signInWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  // Cerrar sesión
  const signOut = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
