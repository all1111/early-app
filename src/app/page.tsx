"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

/* ---------- 型 ---------- */
type Article = {
  title: string;
  content: string;
  publishedAt: string;
  url: string;
};

type JPInfo = {
  titleJa: string;
  summary: string;
  insight: string;
};

/* ---------- 相対時間変換 ---------- */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  const mins = Math.round(sec / 60);
  const hours = Math.round(mins / 60);
  const days = Math.round(hours / 24);
  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  if (mins > 0) return `${mins}分前`;
  return "たった今";
}

/* ---------- ページ ---------- */
export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [infos, setInfos] = useState<Record<string, JPInfo>>({});

  /* 📰 NewsAPI ------------------------------------------------ */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(data.articles ?? []);
    })();
  }, []);

  /* 🤖 GPT 要約 ------------------------------------------------ */
  useEffect(() => {
    if (!articles.length) return;

    (async () => {
      for (const article of articles) {
        if (infos[article.title]) continue; // 既に取得済みならスキップ

        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: article.title,
            content: article.content ?? "",
          }),
        });

        const data: JPInfo = await res.json();
        setInfos(prev => ({ ...prev, [article.title]: data }));
      }
    })();
  }, [articles, infos]);

  /* ---------- 表示 ---------- */
  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      {articles.map(article => {
        const info = infos[article.title];

        return (
          <Card key={article.title}>
            <CardHeader>
              {/* 日本語訳タイトルが届いたら差し替える */}
              <CardTitle className="text-lg font-semibold">
                {info?.titleJa ?? article.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-xs text-gray-500">{timeAgo(article.publishedAt)}</p>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                記事を読む →
              </a>

              {info && (
                <>
                  <h4 className="font-bold pt-3">要約</h4>
                  <p className="text-sm whitespace-pre-wrap">{info.summary}</p>

                  <h4 className="font-bold pt-3">インサイト</h4>
                  <p className="text-sm whitespace-pre-wrap">{info.insight}</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </main>
  );
}
