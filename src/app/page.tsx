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

type Insight = {
  titleJa: string;
  insightEn: string;
  insightJa: string;
};

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [insights, setInsights] = useState<Record<string, Insight>>({});

  // --- NewsAPI で取得 -------------------------------------------------
  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles || []);
    };
    fetchNews();
  }, []);

  // --- GPT 要約 + 翻訳 -------------------------------------------------
  useEffect(() => {
    const summarizeAll = async () => {
      const results: Record<string, Insight> = {};
      for (const a of articles) {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: a.title, content: a.content }),
        });
        const data = await res.json();
        results[a.title] = data; // titleJa / insightEn / insightJa
      }
      setInsights(results);
    };
    if (articles.length) summarizeAll();
  }, [articles]);

  // --- 画面 -----------------------------------------------------------
  return (
    <div className="p-6 space-y-6">
      {articles.map((a) => {
        const info = insights[a.title];
        return (
          <Card key={a.title}>
            <CardHeader>
              {/* 英語タイトル */}
              <CardTitle className="text-base font-semibold">
                {a.title}
              </CardTitle>

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

              {/* Insight EN & JP */}
              {info && (
                <>
                  <h4 className="font-semibold">Insight</h4>
                  <p className="whitespace-pre-wrap text-sm">
                    {info.insightEn}
                  </p>

                  <h4 className="font-semibold mt-1">Translation</h4>
                  <p className="whitespace-pre-wrap text-sm">
                    {info.insightJa}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
