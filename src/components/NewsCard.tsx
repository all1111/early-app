"use client";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import type { FC } from "react";
import { flagEmoji } from "@/lib/utils";

dayjs.extend(relativeTime);
dayjs.locale("ja");

export type Article = {
  title: string;
  titleJa: string;
  descriptionJa: string;   // ← 要約
  insightJa: string;       // ← 解説(400字前後)
  impactJa: string;        // ← 日本への影響分析
  audioScript: string;     // ← 音声配信用スクリプト
  url: string;
  image: string;           // 300x180 固定
  publishedAt: string;
  country: string;         // ISO-2 (JP/US/GB…)
};

export const NewsCard: FC<Article> = ({
  title,
  titleJa,
  descriptionJa,
  insightJa,
  impactJa,
  audioScript,
  url,
  image,
  publishedAt,
  country,
}) => (
  <article className="border rounded-xl p-4 space-y-3 shadow-sm bg-white hover:shadow-md transition-shadow">
    <header className="space-y-2">
      <h2 className="font-bold text-lg leading-snug flex items-start gap-2">
        <span className="text-2xl flex-shrink-0">{flagEmoji(country)}</span>
        <span className="text-gray-900">{titleJa || title}</span>
      </h2>

      <div className="flex items-center justify-between">
        <time className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {dayjs(publishedAt).fromNow()}
        </time>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener" 
          className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
        >
          記事を読む →
        </a>
      </div>
    </header>

    <div className="relative">
      <Image
        src={image}
        alt={title}
        width={300}
        height={180}
        className="rounded-lg object-cover w-full h-[200px] shadow-sm"
        unoptimized
      />
    </div>

    <section className="space-y-3 text-sm leading-relaxed">
      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        <h3 className="font-semibold text-blue-800 mb-1">📝 要約</h3>
        <p className="text-gray-700">{descriptionJa}</p>
      </div>

      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
        <h3 className="font-semibold text-green-800 mb-1">💡 解説</h3>
        <p className="text-gray-700">{insightJa}</p>
      </div>

      <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
        <h3 className="font-semibold text-orange-800 mb-1">🇯🇵 日本への影響</h3>
        <p className="text-gray-700">{impactJa}</p>
      </div>

      {audioScript && (
        <details className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
          <summary className="font-semibold text-purple-800 cursor-pointer hover:text-purple-600">
            🎧 音声配信スクリプト
          </summary>
          <p className="text-gray-700 mt-2 pl-4 border-l-2 border-purple-200">{audioScript}</p>
        </details>
      )}
    </section>
  </article>
);