export const API_BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

console.log("Valor de VERCEL_URL en runtime:", process.env.VERCEL_URL);
console.log("Valor de API_BASE_URL calculado:", API_BASE_URL);