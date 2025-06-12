'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Zap, MessageSquareText, Newspaper } from "lucide-react";
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const fetchNews = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        {
            id: "1",
            title: "Global Tech Stocks Rally on AI Optimism",
            source: "Financial Times",
            url: "#",
            publishedAt: "2024-07-21",
            summary: "Major tech companies saw significant gains as investors bet heavily on advancements in artificial intelligence.",
            imageUrl: "https://placehold.co/400x200.png?text=Tech+Rally"
        },
        {
            id: "2",
            title: "Federal Reserve Hints at Interest Rate Pause",
            source: "Wall Street Journal",
            url: "#",
            publishedAt: "2024-07-20",
            summary: "The central bank indicated a potential pause in its rate-hiking cycle, boosting market sentiment.",
            imageUrl: "https://placehold.co/400x200.png?text=Fed+Meeting"
        },
        {
            id: "3",
            title: "Commodity Prices Surge Amid Geopolitical Tensions",
            source: "Bloomberg",
            url: "#",
            publishedAt: "2024-07-19",
            summary: "Oil and gas prices jumped as new geopolitical concerns emerged in key regions.",
            imageUrl: "https://placehold.co/400x200.png?text=Commodities"
        },
    ];
};

const generateAIInsight = async (article) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const relevances = ['high', 'medium', 'low'];
    return {
        relevance: relevances[Math.floor(Math.random() * relevances.length)],
        tradeSuggestion: Math.random() > 0.5 ? `Consider exploring ${article.title.split(' ')[0]} sector opportunities.` : undefined,
        reasoning: "Based on current market trends and simulated portfolio composition."
    };
};

const cardHoverEffect = "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:shadow-primary/20 border border-border hover:border-primary/30";

export default function NewsPage() {
    const [news, setNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [insights, setInsights] = useState({});
    const [loadingInsight, setLoadingInsight] = useState(null);

    useEffect(() => {
        const loadNews = async () => {
            setLoadingNews(true);
            const fetchedNews = await fetchNews();
            setNews(fetchedNews);
            setLoadingNews(false);
        };
        loadNews();
    }, []);

    const handleGetInsight = async (article) => {
        if (insights[article.id]) return;
        setLoadingInsight(article.id);
        try {
            const insight = await generateAIInsight(article);
            setInsights(prev => ({ ...prev, [article.id]: insight }));
        } catch (error) {
            console.error("Failed to get AI insight", error);
            setInsights(prev => ({
                ...prev,
                [article.id]: {
                    relevance: 'low',
                    reasoning: "Error fetching insight."
                }
            }));
        } finally {
            setLoadingInsight(null);
        }
    };

    if (loadingNews) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <LoadingSpinner size={48} />
                <p className="mt-4 text-lg text-muted-foreground">Loading news feed...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl sm:text-4xl font-headline font-bold mb-10 flex items-center gap-3">
                <Newspaper className="h-10 w-10 text-primary" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary-foreground">
                    Market News & AI Insights
                </span>
            </h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                    <Card key={article.id} className={`flex flex-col ${cardHoverEffect}`}>
                        <CardHeader>
                            {article.imageUrl && (
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    width={400}
                                    height={200}
                                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                                    data-ai-hint="news business"
                                />
                            )}
                            <CardTitle className="font-headline text-lg leading-tight text-primary">{article.title}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                {article.source} - {new Date(article.publishedAt).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground mb-4">{article.summary}</p>
                            {insights[article.id] && (
                                <div className="mt-4 p-3 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/30">
                                    <h4 className="text-sm font-semibold text-accent flex items-center">
                                        <Zap className="w-4 h-4 mr-2 text-accent" />AI Insight
                                    </h4>
                                    <p className="text-xs mt-1">
                                        <strong>Relevance:</strong>
                                        <span className={`font-medium ml-1 ${
                                            insights[article.id]?.relevance === 'high' ? 'text-positive' :
                                            insights[article.id]?.relevance === 'medium' ? 'text-yellow-500 dark:text-yellow-400' :
                                            'text-negative'
                                        }`}>{insights[article.id]?.relevance.toUpperCase()}</span>
                                    </p>
                                    {insights[article.id]?.tradeSuggestion && (
                                        <p className="text-xs mt-1">
                                            <strong>Suggestion:</strong> {insights[article.id]?.tradeSuggestion}
                                        </p>
                                    )}
                                    {insights[article.id]?.reasoning && (
                                        <p className="text-xs mt-1 text-muted-foreground">
                                            <em>{insights[article.id]?.reasoning}</em>
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-4 gap-2">
                            <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                    Read More <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGetInsight(article)}
                                disabled={loadingInsight === article.id || !!insights[article.id]}
                                className="w-full sm:w-auto shadow-sm hover:shadow-accent/30"
                            >
                                {loadingInsight === article.id ? <LoadingSpinner size={16} className="mr-2" /> : <MessageSquareText className="mr-2 h-4 w-4" />}
                                {insights[article.id] ? 'View Insight' : 'Get AI Insight'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
