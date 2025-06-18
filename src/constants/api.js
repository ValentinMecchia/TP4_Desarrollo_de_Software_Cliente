export const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.REACT_APP_VERCEL_URL}` // Vercel asigna esta variable automáticamente
  : 'http://localhost:3000'; // Para desarrollo local