export const API_BASE_URL = process.env.VITE_VERCEL_URL
  ? `https://${process.env.VITE_VERCEL_URL}`
  : 'http://localhost:3000';