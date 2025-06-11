# Firebase Studio - Frontend Only Version

This is a NextJS starter in Firebase Studio, modified to be a frontend-only application.
It does not require any backend services like Firebase for its core functionality and uses mock data.

## Getting Started

1.  **Install Dependencies (if not already done automatically):**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    The app should now be running, typically on `http://localhost:9002`.

## Overview of Changes for Frontend-Only

*   **Firebase Removed**: All Firebase SDKs, authentication services, and backend configurations have been removed. The app no longer connects to or depends on Firebase.
*   **Genkit AI Removed**: All Genkit related code and AI flow processing have been removed. Any AI-like features (e.g., insights on the News page) are simulated with mock data.
*   **Authentication Removed**: User login, registration, and session management have been removed. The application operates as if for a single demo user, or with features that don't require user-specific data.
*   **Data Source**: The application relies on mock data defined directly within the page components (e.g., for assets, portfolios, news).
*   **API Client**: The generic API client (`src/services/apiClient.ts`) has been removed as it was primarily for interacting with a backend.

## Migración a Vite + React (JSX)

Este proyecto ha migrado de Next.js (TSX) a Vite + React (JSX).  
Asegúrate de tener los siguientes archivos de configuración:

- `vite.config.js` en la raíz del proyecto.
- Entrypoint en `src/main.jsx` y tu app en `src/App.jsx`.
- Todos los archivos de componentes y páginas deben ser `.jsx`.

### Instalación y ejecución

1. Instala dependencias:
    ```bash
    npm install
    ```

2. Ejecuta el servidor de desarrollo:
    ```bash
    npm run dev
    ```

    La app estará disponible en `http://localhost:5173` (por defecto con Vite).

### Configuración de Tailwind

Asegúrate de que `tailwind.config.ts` esté exportando con `module.exports` y que los paths incluyan `.jsx`.

## Hosting
This frontend-only application can be deployed to any static hosting provider or platforms that support Next.js builds (like Vercel, Netlify, GitHub Pages after export, etc.) for free or at low cost.

To get started with coding, take a look at the page components in `src/app/(app)/`.
