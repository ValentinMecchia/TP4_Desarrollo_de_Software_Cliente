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
  ? 'https://tp4-desarrollo-de-software-servidor.onrender.com'
  : 'http://localhost:3000';
