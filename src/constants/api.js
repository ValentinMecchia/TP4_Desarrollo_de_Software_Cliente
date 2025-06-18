export const API_BASE_URL = process.env.VITE_VERCEL_URL
  ? `https://${process.env.VITE_VERCEL_URL}`
  : 'http://localhost:3000';

console.log("Valor de VITE_VERCEL_URL en runtime:", process.env.VITE_VERCEL_URL);
console.log("Valor de API_BASE_URL calculado:", API_BASE_URL);