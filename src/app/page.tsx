"use client";
export const dynamic = "force-dynamic"; // 毎回最新

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

// ニュース記事型
type Article = {
  title: string;
  content: string;      // NewsAPI の description / content
  publishedAt: string;
  url: string;
};

// Insight+翻訳型
type Insight = {
  insight: string;
  translation: string;
};

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [insights, setInsights] = useState<Record<string, Insight>>({});

  // ─ STEP 1: NewsAPI で記事取得 ─
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/news");
      if (!res.ok) return console.error("/api/news", res.status);
      const data = await res.json();
      setArticles(data.articles ?? []);
    })();
  }, []);

  // ─ STEP 2: 1件ずつ GPT 要約 ─
  useEffect(() => {
    if (articles.length === 0) return;

    const run = async () => {
      for (const article of articles) {
        // すでに取得済みならスキップ
        if (insights[article.title]) continue;

        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: article.content || article.title,
          }),
        });

        if (!res.ok) {
          console.error("/api/summarize", res.status);
          continue;
        }

        const data: Insight = await res.json();
        setInsights((prev) => ({ ...prev, [article.title]: data }));
      }
    };

    run();
  }, [articles, insights]);

  // ───── Render ─────
  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
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
              className="text-sm text-blue-600 underline mt-2 inline-block"
            >
              記事を読む →
            </a>

            {insights[a.title] && (
              <>
                <p className="mt-4 whitespace-pre-wrap">
                  <strong>Insight</strong>
                  <br />
                  {insights[a.title].insight}
                </p>
                <p className="mt-4 whitespace-pre-wrap">
                  <strong>Translation</strong>
                  <br />
                  {insights[a.title].translation}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
