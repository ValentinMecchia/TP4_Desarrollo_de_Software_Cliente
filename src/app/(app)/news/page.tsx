'use client'; // Required for state and effects, and AI flow client-side usage

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Zap, MessageSquareText } from "lucide-react";
import { type NewsArticle, type AIInsight } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Image from "next/image";
// import { getNewsWithInsights } from '@/ai/flows'; // Assuming an AI flow exists.
// For now, we'll mock the AI flow behavior.

// Mock API call to fetch news - replace with actual API client
const fetchNews = async (): Promise<NewsArticle[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return [
    { id: "1", title: "Global Tech Stocks Rally on AI Optimism", source: "Financial Times", url: "#", publishedAt: "2024-07-21", summary: "Major tech companies saw significant gains as investors bet heavily on advancements in artificial intelligence.", imageUrl: "https://placehold.co/400x200.png?text=Tech+Rally" },
    { id: "2", title: "Federal Reserve Hints at Interest Rate Pause", source: "Wall Street Journal", url: "#", publishedAt: "2024-07-20", summary: "The central bank indicated a potential pause in its rate-hiking cycle, boosting market sentiment.", imageUrl: "https://placehold.co/400x200.png?text=Fed+Meeting" },
    { id: "3", title: "Commodity Prices Surge Amid Geopolitical Tensions", source: "Bloomberg", url: "#", publishedAt: "2024-07-19", summary: "Oil and gas prices jumped as new geopolitical concerns emerged in key regions.", imageUrl: "https://placehold.co/400x200.png?text=Commodities" },
  ];
};

// Mock AI insight generation
const generateAIInsight = async (article: NewsArticle): Promise<AIInsight> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate AI processing
  const relevances: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  return {
    relevance: relevances[Math.floor(Math.random() * relevances.length)],
    tradeSuggestion: Math.random() > 0.5 ? `Consider buying ${article.title.split(' ')[1]} stocks.` : undefined,
    reasoning: "Based on current market trends and portfolio composition."
  };
};


export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [insights, setInsights] = useState<Record<string, AIInsight | null>>({});
  const [loadingInsight, setLoadingInsight] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoadingNews(true);
      const fetchedNews = await fetchNews();
      setNews(fetchedNews);
      setLoadingNews(false);
    };
    loadNews();
  }, []);

  const handleGetInsight = async (article: NewsArticle) => {
    if (insights[article.id]) return; // Don't fetch if insight already exists
    setLoadingInsight(article.id);
    try {
      // const insight = await getNewsWithInsights(article, userPortfolio); // Replace with actual AI flow
      const insight = await generateAIInsight(article); 
      setInsights(prev => ({ ...prev, [article.id]: insight }));
    } catch (error) {
      console.error("Failed to get AI insight", error);
      setInsights(prev => ({ ...prev, [article.id]: { relevance: 'low', reasoning: "Error fetching insight." } }));
    } finally {
      setLoadingInsight(null);
    }
  };

  if (loadingNews) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={32} /> <span className="ml-2">Loading news...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-headline font-bold mb-8 text-primary">Market News & AI Insights</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((article) => (
          <Card key={article.id} className="flex flex-col">
            <CardHeader>
              {article.imageUrl && (
                 <Image src={article.imageUrl} alt={article.title} width={400} height={200} className="w-full h-auto rounded-md mb-4" data-ai-hint="news business"/>
              )}
              <CardTitle className="font-headline text-lg leading-tight text-primary">{article.title}</CardTitle>
              <CardDescription className="text-xs">
                {article.source} - {new Date(article.publishedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{article.summary}</p>
              {insights[article.id] && (
                <div className="mt-4 p-3 bg-accent/30 rounded-md border border-accent">
                  <h4 className="text-sm font-semibold text-accent-foreground flex items-center"><Zap className="w-4 h-4 mr-2 text-accent-foreground" />AI Insight</h4>
                  <p className="text-xs mt-1"><strong>Relevance:</strong> <span className={`font-medium ${
                    insights[article.id]?.relevance === 'high' ? 'text-green-600' :
                    insights[article.id]?.relevance === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>{insights[article.id]?.relevance.toUpperCase()}</span></p>
                  {insights[article.id]?.tradeSuggestion && <p className="text-xs mt-1"><strong>Suggestion:</strong> {insights[article.id]?.tradeSuggestion}</p>}
                  {insights[article.id]?.reasoning && <p className="text-xs mt-1 text-muted-foreground"><em>{insights[article.id]?.reasoning}</em></p>}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
              <Button variant="ghost" size="sm" asChild>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read More <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleGetInsight(article)}
                disabled={loadingInsight === article.id || !!insights[article.id]}
              >
                {loadingInsight === article.id ? <LoadingSpinner size={16} className="mr-2"/> : <MessageSquareText className="mr-2 h-4 w-4" />}
                {insights[article.id] ? 'View Insight' : 'Get AI Insight'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
