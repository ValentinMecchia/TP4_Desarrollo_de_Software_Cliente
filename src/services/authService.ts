// This file is intentionally left blank after removing Firebase Authentication.
// You can delete this file if it's no longer referenced.

// Mock user for frontend-only mode if needed by any component temporarily.
// However, it's better to refactor components to not require a user.
export const getCurrentUser = (): null => {
  return null;
};

export const signOut = async (): Promise<void> => {
  // Mock sign out
  return Promise.resolve();
};

export const onAuthStateChangedWrapper = (callback: (user: null) => void) => {
  // Mock onAuthStateChanged, immediately calls back with no user
  callback(null);
  // Return a mock unsubscribe function
  return () => {};
};

export const getIdToken = async (): Promise<string | null> => {
  return null;
};
