"use client";
export const dynamic = "force-dynamic"; // 毎リクエストで最新データ

import Image from "next/image";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

dayjs.extend(relativeTime);
dayjs.locale("ja");

/* ---------- 型定義 ---------- */
type Article = {
  title: string;            // 英語タイトル
  titleJa?: string;         // 日本語タイトル（任意）
  publishedAt: string;      // ISO 文字列
  url: string;              // 元記事 URL
  urlToImage?: string;      // サムネイル URL（任意）
  countryCode?: string;     // ISO2 国コード（任意）
  insight?: string;         // 日本語 500 字前後の解説（任意）
};

/* ---------- 国旗絵文字ユーティリティ ---------- */
const flagEmoji = (code?: string) =>
  code && code.length === 2
    ? String.fromCodePoint(
        ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
      )
    : "🏳️";

/* ---------- React コンポーネント ---------- */
export default function Page() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  /* ニュース取得 */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        const data = await res.json();

        // data が配列の場合 / {articles: [...]} の場合どちらにも対応
        const arr = Array.isArray(data) ? data : data.articles ?? [];
        if (Array.isArray(arr)) {
          setArticles(arr);
        } else {
          console.error("data is not array", data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="p-6">読み込み中…</p>;

  return (
    <div className="space-y-6 p-6">
      {articles.map((a, idx) => (
        <article
          key={idx}
          className="border rounded-md p-4 space-y-2 shadow-sm max-w-[340px]"
        >
          {/* タイトル（国旗 + 日本語タイトルがあればそちら優先） */}
          <h2 className="font-bold text-lg">
            {flagEmoji(a.countryCode)} {a.titleJa ?? a.title}
          </h2>

          {/* 投稿日時を相対表現 */}
          <p className="text-xs text-gray-500">
            {dayjs(a.publishedAt).fromNow()}
          </p>

          {/* 元記事リンク */}
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline"
          >
            記事を読む →
          </a>

          {/* サムネイル（300×180） */}
          <div className="w-[300px] h-[180px] bg-gray-200 rounded relative overflow-hidden flex items-center justify-center text-gray-400 select-none text-4xl">
            {a.urlToImage ? (
              <Image
                src={a.urlToImage}
                alt={a.title}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              "Image"
            )}
          </div>

          {/* 解説（Insight 日本語訳を 500 字前後で保存しておく想定） */}
          {a.insight && (
            <p className="whitespace-pre-wrap">
              <strong>【解説】</strong>
              {a.insight}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
