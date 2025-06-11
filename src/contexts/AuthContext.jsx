'use client';
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const value = {};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
