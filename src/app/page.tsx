// ❶ ここに 'use client' は置かない（サーバー側で実行させる）
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic"; // ← 毎リクエスト新鮮なデータ

type Article = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
};

async function getNews(): Promise<Article[]> {
  const res = await fetch(
    "https://newsapi.org/v2/top-headlines?language=en&pageSize=5",
    {
      headers: { "X-Api-Key": process.env.NEWS_API_KEY! },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("NewsAPI error:", res.statusText);
    return [];
  }

  const data = await res.json();
  return data.articles ?? [];
}

export default async function Home() {
  const articles = await getNews();

  return (
    <main className="p-6 space-y-4 max-w-2xl mx-auto">
      {articles.map((a, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>{a.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-gray-600 line-clamp-2">
              {a.description}
            </p>
            <p className="text-sm text-gray-400">{a.publishedAt.slice(0, 10)}</p>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              記事を読む →
            </a>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
