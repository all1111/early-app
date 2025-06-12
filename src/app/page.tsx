/* src/app/page.tsx まるっと ※insight 関係を削除した版 */
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

  /* ─ NewsAPI 取得 ───────────────────── */
  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles ?? []);
    };
    fetchNews();
  }, []);

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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
