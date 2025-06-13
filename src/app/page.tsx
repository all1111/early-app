"use client";
export const dynamic = "force-dynamic"; // 毎回最新データ

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
  summary: string;  // 要約（日本語）
  insight: string;  // インサイト（日本語）
};

/* ---------- 画面 ---------- */
export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [infos, setInfos] = useState<Record<string, JPInfo>>({});

  /* 📰 ニュース取得 -------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setArticles(data.articles ?? []);
      } catch (err) {
        console.error("ニュース取得失敗", err);
      }
    })();
  }, []);

  /* 🤖 要約 & インサイト取得 ---------------------------------------- */
  useEffect(() => {
    if (!articles.length) return;

    (async () => {
      for (const article of articles) {
        if (infos[article.title]) continue; // 既に取得済みならスキップ

        try {
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
        } catch (err) {
          console.error("要約生成失敗", err);
        }
      }
    })();
  }, [articles, infos]);

  /* ---------- 描画 ---------- */
  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      {articles.map(article => {
        const info = infos[article.title];

        return (
          <Card key={article.title}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {article.title /* ←英語タイトルそのまま */ }
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-xs text-gray-500">{article.publishedAt}</p>

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
                  <h4 className="font-bold pt-2">要約</h4>
                  <p className="text-sm whitespace-pre-wrap">{info.summary}</p>

                  <h4 className="font-bold pt-2">インサイト</h4>
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
