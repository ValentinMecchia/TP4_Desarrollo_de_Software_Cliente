export const API_BASE_URL = typeof window !== 'undefined'
  ? window.location.origin
  : 'http://localhost:3000';

console.log("Valor de window.location.origin en runtime (frontend):", typeof window !== 'undefined' ? window.location.origin : 'N/A (no es navegador)');
console.log("Valor de API_BASE_URL calculado (frontend):", API_BASE_URL);