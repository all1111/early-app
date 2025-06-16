"use client";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import type { FC } from "react";
import { flagEmoji } from "@/lib/utils";

dayjs.extend(relativeTime);
dayjs.locale("ja");

type Article = {
  title: string;
  titleJa: string;
  descriptionJa: string;   // ← 要約
  insightJa: string;       // ← 解説(500字前後)
  url: string;
  image: string;           // 300x180 固定
  publishedAt: string;
  country: string;         // ISO-2 (JP/US/GB…)
};

export default async function Page() {
  /** /api/news で 10 件取り、サーバー側で GPT 処理済み JSON を返す構成 */
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN}/api/news`, {
    cache: "no-store",
  });
  const { articles }: { articles: Article[] } = await res.json();

  if (!Array.isArray(articles)) {
    console.error("data is not array", { articles });
    return <p>読み込み中…</p>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 p-4">
      {articles.map((a) => (
        <ArticleCard key={a.url} {...a} />
      ))}
    </div>
  );
}

const ArticleCard: FC<Article> = ({
  title,
  titleJa,
  descriptionJa,
  insightJa,
  url,
  image,
  publishedAt,
  country,
}) => (
  <article className="border rounded-xl p-4 space-y-2 shadow-sm">
    <h2 className="font-semibold leading-snug flex items-start gap-1">
      <span className="text-xl">{flagEmoji(country)}</span>
      <span>{titleJa || title}</span>
    </h2>

    <time className="text-xs text-gray-500">
      {dayjs(publishedAt).fromNow()}
    </time>

    <a href={url} target="_blank" rel="noopener" className="text-sm text-blue-600 underline">
      記事を読む →
    </a>

    <Image
      src={image}
      alt={title}
      width={300}
      height={180}
      className="rounded-md object-cover w-[300px] h-[180px]"
      unoptimized
    />

    <section className="text-sm leading-relaxed space-y-1">
      <p>【要約】{descriptionJa}</p>
      <p>【解説】{insightJa}</p>
    </section>
  </article>
);
