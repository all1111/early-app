"use client"; 
export const dynamic = "force-dynamic"; // 毎リクエストで新鮮データ

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

type Article = {
  title: string;
  content: string;
  publishedAt: string;
  url: string;
};

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [insights, setInsights] = useState<Record<string, string>>({});

  useEffect(() => {
    // NewsAPIで記事を取得
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles || []);
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const summarize = async () => {
      for (const article of articles) {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: article.content || article.title }),
        });
        const data = await res.json();
        setInsights((prev) => ({ ...prev, [article.title]: data.result }));
      }
    };
    if (articles.length > 0) summarize();
  }, [articles]);

  return (
    <div className="p-6 space-y-4">
      {articles.map((article) => (
        <Card key={article.title}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{article.publishedAt}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline mt-2 block"
            >
              記事を読む →
            </a>
            {insights[article.title] && (
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                {insights[article.title]}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
