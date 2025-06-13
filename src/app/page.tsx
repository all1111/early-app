"use client";
export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

type Article = {
  title: string;
  content: string;        // NewsAPI から
  description: string;    // fallback
  publishedAt: string;
  url: string;
};

type Insight = {
  titleJa: string;
  insightEn: string;
  insightJa: string;
};

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [insights, setInsights] = useState<Record<string, Insight>>({});

  /* -------- NewsAPI -------- */
  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles || []);
    };
    fetchNews();
  }, []);

  /* -------- GPT 要約＆翻訳 -------- */
  useEffect(() => {
    if (!articles.length) return;

    (async () => {
      const result: Record<string, Insight> = {};
      for (const a of articles) {
        const body = JSON.stringify({
          title: a.title,
          content: a.content || a.description || a.title,
        });
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        result[a.title] = await res.json();
      }
      setInsights(result);
    })();
  }, [articles]);

  /* -------- 表示 -------- */
  return (
    <div className="p-6 space-y-6">
      {articles.map((a) => {
        const info = insights[a.title];
        const snippet =
          (a.content || a.description || "").split("[")[0].slice(0, 160) + "…";

        return (
          <Card key={a.title}>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{a.title}</CardTitle>

              {/* 日本語タイトル（あれば） */}
              {info?.titleJa && (
                <p className="text-sm text-gray-600 mt-1">{info.titleJa}</p>
              )}
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-xs text-gray-400">{a.publishedAt}</p>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                記事を読む →
              </a>

              {/* --- ① Insight 翻訳（JP）→ ② Insight 原文（EN） --- */}
              {info && (
                <>
                  <h4 className="font-semibold">Insight (JP)</h4>
                  <p className="whitespace-pre-wrap text-sm">{info.insightJa}</p>

                  <h4 className="font-semibold mt-1">Insight (EN)</h4>
                  <p className="whitespace-pre-wrap text-sm">{info.insightEn}</p>
                </>
              )}

              {/* 元記事スニペット（英語） */}
              <p className="text-xs text-gray-500 mt-2 line-clamp-3">{snippet}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
