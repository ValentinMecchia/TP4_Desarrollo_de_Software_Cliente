
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';

// Check if essential Firebase config values are present BEFORE attempting initialization
const requiredEnvVars: string[] = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error("Missing Firebase environment variables:", missingVars);
  throw new Error(
    `CRITICAL Firebase Configuration Error: The following required environment variable(s) are missing or undefined in your .env.local file: \n\n- ${missingVars.join('\n- ')}\n\nPlease ensure ALL these variables are correctly set in .env.local using the values from your Firebase project's web app configuration (Firebase console -> Project settings -> General tab -> Your apps). \n\nRefer to .env.example for the required variable names and README.md for setup instructions. \n\nIMPORTANT: You MUST RESTART your development server (e.g., 'npm run dev') after creating or modifying the .env.local file for the changes to take effect.`
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error after checks passed (unexpected):', error);
  let errorMessage = 'An unexpected error occurred during Firebase initialization, even after environment variable checks. Please double-check your Firebase project configuration values in .env.local.';
  if (error instanceof Error) {
    if (error.message.includes('auth/invalid-api-key') || error.message.toLowerCase().includes('invalid api key')) {
      errorMessage = `Firebase initialization failed: Invalid API Key or other configuration. 
1. Ensure NEXT_PUBLIC_FIREBASE_API_KEY and other values in .env.local are absolutely correct and match your Firebase project settings.
2. Check for typos or extra spaces in the values.
3. Restart your development server.
Original error: ${error.message}`;
    } else {
      errorMessage = `Firebase initialization error: ${error.message}. Verify .env.local values and restart the server.`;
    }
  }
  throw new Error(errorMessage);
}

export { app, auth };
