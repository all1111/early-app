"use client";
export const dynamic = "force-dynamic"; // 毎リクエストで最新

import Image from "next/image";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
dayjs.extend(relativeTime);
dayjs.locale("ja");

type Article = {
  id: string;            // →   /api/news で付与
  title: string;         // 英語タイトル
  titleJa: string;       // 日本語タイトル (GPT 和訳)
  url: string;           // オリジナル記事 URL
  publishedAt: string;   // ISO 文字列
  imageUrl: string;      // 300×180 サムネ
  summaryJa: string;     // 要約（日本語 3 行前後）
  insightJa: string;     // 解説（日本語 ≒ 400〜500字）
  countryCode: string;   // 例 "us"  → 🇺🇸
};

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /** ① まずサーバー側 API から「英語の記事 10 件」取得  */
    const fetchNews = async () => {
      const res = await fetch("/api/news?limit=10");      // ← 自前実装済みの NewsAPI ラッパー
      const data = await res.json();                      // data.articles: Article[] (英語)
      /** ② OpenAI に「タイトル和訳・要約・解説」をまとめて生成させる */
      const res2 = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: data.articles }), // まとめて送信してコスト削減
      });
      const enriched = (await res2.json()) as Article[];
      setArticles(enriched);
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) return <p className="p-6">🌀 読み込み中…</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {articles.map((a) => (
        <article
          key={a.id}
          className="border rounded-lg p-4 shadow-sm mb-6 bg-white"
        >
          {/* ---------- タイトル & 国旗 ---------- */}
          <h2 className="text-lg font-bold mb-1">
            {countryFlag(a.countryCode)} {a.titleJa}
          </h2>

          {/* ---------- 投稿日時（相対） ---------- */}
          <div className="text-xs text-gray-500 mb-1">
            {dayjs(a.publishedAt).fromNow()}
          </div>

          {/* ---------- 記事リンク ---------- */}
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
          >
            記事を読む →
          </a>

          {/* ---------- 画像 ---------- */}
          <div className="my-2">
            <Image
              src={a.imageUrl || "/noimage.svg"}
              width={300}
              height={180}
              alt={a.titleJa}
              className="rounded object-cover w-[300px] h-[180px]"
            />
          </div>

          {/* ---------- 要約 ---------- */}
          <p className="text-sm font-bold">【要約】</p>
          <p className="text-sm mb-2 whitespace-pre-wrap">{a.summaryJa}</p>

          {/* ---------- 解説 ---------- */}
          <p className="text-sm font-bold">【解説】</p>
          <p className="text-sm whitespace-pre-wrap">{a.insightJa}</p>
        </article>
      ))}
    </main>
  );
}

/* 国コード → 絵文字 🇯🇵 変換（簡易版） */
function countryFlag(code: string) {
  if (!code) return "";
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65))
  );
}
