'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ja';

dayjs.extend(relativeTime);
dayjs.locale('ja');

type Article = {
  title: string;
  titleJa?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  insight?: string;
  insightJa?: string;
  country?: string;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch('/data/articles.json');
      const raw = await res.json();

      const sorted = raw.articles
        .slice(0, 10)
        .map((a: Article) => ({
          ...a,
          imageUrl: a.imageUrl || 'https://placehold.co/300x180?text=No+Image',
        }));

      setArticles(sorted);
    };

    fetchArticles();
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {articles.map((a, i) => {
        const flagEmoji = getFlagEmoji(a.country);
        const timeAgo = dayjs(a.publishedAt).fromNow();

        return (
          <div key={i} className="bg-white shadow p-4 rounded space-y-2">
            <h2 className="text-lg font-bold">{a.titleJa || a.title}</h2>
            <p className="text-sm text-gray-500">{flagEmoji} {timeAgo}</p>
            <a href={a.url} className="text-blue-600 text-sm underline" target="_blank" rel="noopener noreferrer">
              記事を読む →
            </a>
            <img src={a.imageUrl} alt="thumbnail" className="w-[300px] h-[180px] object-cover rounded border" />
            <div className="mt-2">
              <strong>【解説】</strong>
              <p className="text-sm mt-1 whitespace-pre-wrap">{a.insightJa || a.insight || '（解説なし）'}</p>
            </div>
          </div>
        );
      })}
    </main>
  );
}

// 安全な国コードからフラグ絵文字に変換する関数
function getFlagEmoji(countryCode?: string) {
  if (!countryCode || countryCode.length !== 2) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
