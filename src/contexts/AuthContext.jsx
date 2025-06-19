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
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  // Iniciar login con Google (redirecciona)
const signInWithGoogle = () => {
    const popup = window.open(`${API_BASE_URL}/api/auth/google`, "_blank", "width=500,height=600");

    const handleMessage = async (event) => {
        if (event.data === "oauth-success") {
            window.removeEventListener("message", handleMessage);

            // Esperar un poquito a que se guarde la cookie
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Volver a consultar si hay sesión
            const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                router.push("/dashboard");
            } else {
                setUser(null);
                router.push("/login");
            }
        }
    };

    window.addEventListener("message", handleMessage);
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
