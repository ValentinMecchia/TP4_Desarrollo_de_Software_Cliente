# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

1.  **Set up Firebase Configuration:**
    *   Rename the `.env.example` file in the root directory to `.env.local`.
    *   Open `.env.local` and replace the placeholder values (like `"YOUR_FIREBASE_API_KEY"`) with your actual Firebase project's web app configuration details. You can find these in your Firebase project settings:
        *   Go to your Firebase project.
        *   Click on Project settings (the gear icon).
        *   Under the "General" tab, scroll down to "Your apps".
        *   If you haven't added a web app, do so.
        *   Select your web app, and you'll find the `firebaseConfig` object containing your `apiKey`, `authDomain`, etc.

2.  **Install Dependencies (if not already done automatically):**
    While Firebase Studio often handles this, if you're running locally:
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    The app should now be running, typically on `http://localhost:9002`.

To get started with coding, take a look at `src/app/page.tsx`.
