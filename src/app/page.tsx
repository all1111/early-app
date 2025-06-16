// src/app/page.tsx
"use client";
export const dynamic = "force-dynamic";

import Image from "next/image";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
dayjs.extend(relativeTime);
dayjs.locale("ja");

type Article = {
  id: string;                    // ← 追加（key 用）
  title: string;
  titleJa: string;
  url: string;
  image: string;
  publishedAt: string;
  insightJa: string;
  countryEmoji: string;
};

export default function Page() {
  /** ❶ ① 初期値を「からの配列」にする  */
  const [articles, setArticles] = useState<Article[]>([]);

  /** ❷ NewsAPI → articles.json をフェッチ */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data/articles.json", { cache: "no-store" });
        if (!res.ok) throw new Error("fetch error");
        /** ❸ Array 判定でガード（.map エラー防止） */
        const data = await res.json();
        if (Array.isArray(data)) {
          setArticles(data as Article[]);
        } else {
          console.error("data is not array", data);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (!articles.length) {
    return <p style={{ padding: 24 }}>読み込み中...</p>;
  }

  /** ❹ 正常に配列なら map できる */
  return (
    <main style={{ padding: 24, maxWidth: 680, margin: "0 auto" }}>
      {articles.map((a) => (
        <article
          key={a.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontWeight: 600, fontSize: 18 }}>
            {a.countryEmoji}&nbsp;{a.titleJa || a.title}
          </h2>

          {/* 相対時間 */}
          <time
            dateTime={a.publishedAt}
            style={{ fontSize: 12, color: "#666" }}
          >
            {dayjs(a.publishedAt).fromNow()}
          </time>

          {/* オリジナル記事 */}
          <div style={{ margin: "4px 0 8px" }}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: "#167" }}
            >
              記事を読む →
            </a>
          </div>

          {/* 画像（300×180） */}
          <Image
            src={a.image}
            alt={a.title}
            width={300}
            height={180}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />

          {/* 解説 */}
          <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>
            <strong>【解説】</strong>
            <br />
            {a.insightJa}
          </p>
        </article>
      ))}
    </main>
  );
}
