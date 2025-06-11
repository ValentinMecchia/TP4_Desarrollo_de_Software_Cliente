'use client';
// This file is intentionally left blank after removing Firebase Authentication.
// All components relying on useAuth will need to be refactored or will use mock data.
// You can delete this file if it's no longer referenced.

import React, { createContext, useContext } from 'react';

const mockUserProfile = {
  id: 'mock-user-id',
  email: 'user@example.com',
  displayName: 'Demo User',
  photoURL: 'https://placehold.co/100x100.png?text=DU',
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const value = {
    user: null,
    userProfile: mockUserProfile, // Provide a mock user profile
    loading: false,
    error: null,
    signOut: async () => {
      // Mock sign out
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This basic provider can be used if some components still call useAuth
    // but it won't provide real auth functionality.
    // Consider removing useAuth calls from components for a true frontend-only app.
    return {
      user: null,
      userProfile: mockUserProfile,
      loading: false,
      error: null,
      signOut: async () => {},
    };
  }
  return context;
};
