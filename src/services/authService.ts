import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // Ensure this path is correct

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Potentially create user profile in your backend here
  return userCredential.user;
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  // Potentially create/update user profile in your backend here
  return result.user;
};

export const signInWithGitHub = async (): Promise<User> => {
  const result = await signInWithPopup(auth, githubProvider);
  // Potentially create/update user profile in your backend here
  return result.user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChangedWrapper = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};

export const getIdToken = async (): Promise<string | null> => {
  const user = getCurrentUser();
  if (user) {
    return user.getIdToken();
  }
  return null;
};
