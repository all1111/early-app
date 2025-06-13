// frontend/src/app/page.tsx
"use client";
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
  const [insights, setInsights] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/news");
      const d = await r.json();
      setArticles(d.articles ?? []);
    })();
  }, []);

  useEffect(() => {
    if (!articles.length) return;
    (async () => {
      for (const a of articles) {
        if (insights[a.title]) continue;
        const r = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: a.content || a.title }),
        });
        const d = await r.json();
        setInsights((p) => ({
          ...p,
          [a.title]: `**Insight**\n${d.insight}\n\n**Translation**\n${d.translation}`,
        }));
      }
    })();
  }, [articles, insights]);

  return (
    <div className="p-6 space-y-6">
      {articles.map((a) => (
        <Card key={a.title}>
          <CardHeader>
            <CardTitle>{a.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-500">{a.publishedAt}</p>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              記事を読む →
            </a>
            {insights[a.title] && (
              <p
                className="prose text-sm whitespace-pre-wrap mt-2"
                dangerouslySetInnerHTML={{ __html: insights[a.title] }}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
