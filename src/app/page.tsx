'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GenreFilter } from '@/components/GenreFilter';
import { useState } from 'react';

export const dynamic = 'force-dynamic'; // ← 毎リクエストで実行させる

type Article = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
};

async function getArticles(): Promise<Article[]> {
  const apiKey = process.env.NEWS_API_KEY!;
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=${apiKey}`,
    { cache: 'no-store' }               // Edge でも Node でも OK
  );
  const data = await res.json();
  return data.articles ?? [];
}

export default async function Home() {
  const articles = await getArticles();

  // ↓フィルター UI 用（クライアント側で状態管理したい場合）
  const [genre, setGenre] = useState<'all' | 'tech' | 'economy' | 'politics' | 'science'>('all');

  return (
    <main className="p-6 space-y-4 max-w-2xl mx-auto">
      <GenreFilter value={genre} onChange={setGenre} />

      {articles
        .filter(a => genre === 'all' || a.description?.includes(genre))
        .map((a, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{a.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{a.description}</p>
              <p className="text-sm text-gray-400">{a.publishedAt.slice(0, 10)}</p>
              <a className="text-blue-500 underline text-sm" href={a.url} target="_blank" rel="noopener noreferrer">
                記事を読む →
              </a>
            </CardContent>
          </Card>
        ))}
    </main>
  );
}
