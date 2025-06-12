/* 使うなら "use client" のまま */
export const dynamic = "force-dynamic";

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

  useEffect(() => {
    // NewsAPI の記事取得
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles ?? []);
    };
    fetchNews();
  }, []);

  return (
    <div className="p-6 space-y-4">
      {articles.map((a) => (
        <Card key={a.title}>
          <CardHeader>
            <CardTitle>{a.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{a.publishedAt}</p>
            <a
              href={a.url}
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

/* ---------- ここまで ---------- */
