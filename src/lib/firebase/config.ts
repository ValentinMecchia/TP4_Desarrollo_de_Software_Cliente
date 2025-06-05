
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
  throw new Error(
`CRITICAL FIREBASE SETUP ISSUE: Your app is missing essential Firebase configuration.
The following environment variable(s) were NOT found:
- ${missingVars.join('\n- ')}

TO FIX THIS:
1. Create a file named '.env.local' in the ROOT DIRECTORY of your project (this is the same folder as your 'package.json' file).
2. Copy the content from '.env.example' (also in the root directory) into your new '.env.local' file.
3. In '.env.local', replace ALL placeholder values (e.g., "YOUR_FIREBASE_API_KEY") with your ACTUAL Firebase project credentials. You can find these in: Firebase Console -> Project Settings (gear icon) -> General tab -> Your apps -> Web app config.
4. Ensure the variable names in '.env.local' (e.g., NEXT_PUBLIC_FIREBASE_API_KEY) exactly match those in '.env.example'. Check for typos.
5. CRUCIAL: You MUST RESTART your development server (e.g., stop 'npm run dev' and run it again) after creating or changing the '.env.local' file. Next.js only reads this file on startup.

See README.md for more detailed setup instructions.`
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
