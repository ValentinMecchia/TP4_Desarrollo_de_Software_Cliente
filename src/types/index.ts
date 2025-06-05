
export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  // Add any other custom user properties if needed for mock display
}

// AppUser type removed as FirebaseUser is no longer used.

export interface Portfolio {
  id: string;
  name: string;
  userId: string; // Could be a mock user ID or removed if not relevant for frontend-only
  // Add other portfolio properties
}

export interface Investment {
  id: string;
  portfolioId: string;
  assetId: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  // Add other investment properties
}

export interface Asset {
  id:string;
  name: string;
  symbol: string;
  type: string; // e.g., 'Stock', 'Crypto', 'Bond'
  // Add other asset properties
}

export interface PriceHistory {
  id: string;
  assetId: string;
  date: string;
  price: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary?: string;
  imageUrl?: string;
  relevanceToPortfolio?: 'high' | 'medium' | 'low'; // Kept for mock AI
  potentialTradeSuggestion?: string; // Kept for mock AI
}

export interface AIInsight {
  relevance: 'high' | 'medium' | 'low';
  tradeSuggestion?: string;
  reasoning?: string;
}
