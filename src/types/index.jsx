// Ya no usas interfaces en JS, solo documenta o crea objetos si quieres

// Ejemplo de "estructura" que podrías usar para referencia o mock data

export const UserProfile = {
  id: '',
  email: null,
  displayName: null,
  photoURL: null,
  // puedes añadir propiedades según necesites
};

export const Portfolio = {
  id: '',
  name: '',
  userId: '',
  // otras propiedades
};

export const Investment = {
  id: '',
  portfolioId: '',
  assetId: '',
  quantity: 0,
  purchasePrice: 0,
  purchaseDate: '',
  // otras propiedades
};

export const Asset = {
  id: '',
  name: '',
  symbol: '',
  type: '', // Ejemplo: 'Stock', 'Crypto', 'Bond'
  // otras propiedades
};

export const PriceHistory = {
  id: '',
  assetId: '',
  date: '',
  price: 0,
};

export const NewsArticle = {
  id: '',
  title: '',
  source: '',
  url: '',
  publishedAt: '',
  summary: '',
  imageUrl: '',
  relevanceToPortfolio: '', // 'high' | 'medium' | 'low'
  potentialTradeSuggestion: '',
};

export const AIInsight = {
  relevance: '', // 'high' | 'medium' | 'low'
  tradeSuggestion: '',
  reasoning: '',
};
