"use client";

import { Suspense } from "react";
import { getNewsArticles } from "@/lib/news";
import { MobileNewsCard } from "@/components/mobile-news-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { MobileHeader } from "@/components/mobile-header";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useEffect, useState } from "react";

interface Article {
  title: string;
  titleJa: string;
  descriptionJa: string;
  insightJa: string;
  impactJa: string;
  audioScript: string;
  url: string;
  image: string;
  publishedAt: string;
  country: string;
}

function NewsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsArticles = await getNewsArticles();
        setArticles(newsArticles);
        setError(false);
      } catch (err) {
        console.error("Error loading news:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <LoadingState />;
  if (error || !Array.isArray(articles) || articles.length === 0) {
    return <ErrorState onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      
      <div className="px-4 py-6 space-y-4">
        {articles.map((article, index) => (
          <MobileNewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
      
      <BottomNavigation />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NewsContent />
    </Suspense>
  );
}