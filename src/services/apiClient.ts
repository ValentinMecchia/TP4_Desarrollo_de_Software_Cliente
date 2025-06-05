import { getIdToken } from './authService';
import { type UserProfile, type Portfolio, type Asset, type Investment, type NewsArticle, type PriceHistory } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  // You can add custom options here if needed
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = await getIdToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
     headers.append('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) { // No Content
    return undefined as unknown as T; // Or handle as appropriate
  }

  return response.json() as Promise<T>;
}

// Example API functions (replace with your actual backend endpoints and types)

// User
export const apiClient = {
  getUserProfile: (userId: string): Promise<UserProfile> => {
    return request<UserProfile>(`/users/${userId}`);
  },
  updateUserProfile: (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    return request<UserProfile>(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  // Portfolios
  getPortfolios: (): Promise<Portfolio[]> => {
    return request<Portfolio[]>('/portfolios');
  },
  getPortfolioById: (portfolioId: string): Promise<Portfolio> => {
    return request<Portfolio>(`/portfolios/${portfolioId}`);
  },
  createPortfolio: (data: Omit<Portfolio, 'id' | 'userId'>): Promise<Portfolio> => {
    return request<Portfolio>('/portfolios', { method: 'POST', body: JSON.stringify(data) });
  },
  updatePortfolio: (portfolioId: string, data: Partial<Portfolio>): Promise<Portfolio> => {
    return request<Portfolio>(`/portfolios/${portfolioId}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deletePortfolio: (portfolioId: string): Promise<void> => {
    return request<void>(`/portfolios/${portfolioId}`, { method: 'DELETE' });
  },

  // Assets
  getAssets: (): Promise<Asset[]> => {
    return request<Asset[]>('/assets');
  },
  getAssetById: (assetId: string): Promise<Asset> => {
    return request<Asset>(`/assets/${assetId}`);
  },
  getPriceHistory: (assetId: string): Promise<PriceHistory[]> => {
    return request<PriceHistory[]>(`/assets/${assetId}/price-history`);
  },

  // Investments
  getInvestments: (portfolioId: string): Promise<Investment[]> => {
    return request<Investment[]>(`/portfolios/${portfolioId}/investments`);
  },
  createInvestment: (portfolioId: string, data: Omit<Investment, 'id' | 'portfolioId'>): Promise<Investment> => {
    return request<Investment>(`/portfolios/${portfolioId}/investments`, { method: 'POST', body: JSON.stringify(data) });
  },
  // Add other CRUD for investments as needed

  // News
  getNews: (params?: { category?: string; limit?: number }): Promise<NewsArticle[]> => {
    // Example with query params: /news?category=finance&limit=10
    const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return request<NewsArticle[]>(`/news${query ? `?${query}` : ''}`);
  },
  getNewsById: (newsId: string): Promise<NewsArticle> => {
    return request<NewsArticle>(`/news/${newsId}`);
  },
};
