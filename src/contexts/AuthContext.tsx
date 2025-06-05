'use client';

import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChangedWrapper, signOut as firebaseSignOut } from '@/services/authService';
import type { UserProfile } from '@/types';
import { apiClient } from '@/services/apiClient'; // Assuming apiClient can fetch user profile

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  // Add other auth methods if needed, e.g., wrapped login/signup from authService
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedWrapper(async (firebaseUser) => {
      setLoading(true);
      setError(null);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Example: Fetch user profile from your backend
          // const profile = await apiClient.getUserProfile(firebaseUser.uid);
          // setUserProfile(profile);

          // For now, use a placeholder profile based on FirebaseUser
          setUserProfile({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });

        } catch (e) {
          console.error("Failed to fetch user profile", e);
          setError(e instanceof Error ? e : new Error('Failed to fetch user profile'));
          // Optional: sign out user if profile fetch fails critically
          // await firebaseSignOut();
          // setUser(null);
          // setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut();
      setUser(null);
      setUserProfile(null);
    } catch (e) {
      console.error("Sign out failed", e);
      setError(e instanceof Error ? e : new Error('Sign out failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
