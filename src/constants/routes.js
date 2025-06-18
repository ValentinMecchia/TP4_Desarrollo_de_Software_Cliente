export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PORTFOLIOS: '/portfolios',
  ASSETS: '/assets',
  NEWS: '/news',
  SETTINGS: '/settings',
  PRIVACYPOLICY: '/privacy-policy',
  TERMS: '/terms',
};

export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://tp-4-desarrollo-de-software-cliente.vercel.app' // ¡CAMBIA ESTO!
  : 'http://localhost:3000';
