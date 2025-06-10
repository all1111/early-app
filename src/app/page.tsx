import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic'; // 毎リクエスト最新データ

type Article = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
};

type Enriched = Article & { en: string; ja: string };

async function fetchNews(): Promise<Article[]> {
  const res = await fetch(
    'https://newsapi.org/v2/top-headlines?language=en&pageSize=5',
    {
      headers: { 'X-Api-Key': process.env.NEWS_API_KEY! },
      cache: 'no-store',
    }
  );
  const data = await res.json();
  return data.articles ?? [];
}

async function summarize(text: string) {
  // サーバ側から自分の API を叩く
  const endpoint =
    (process.env.NEXT_PUBLIC_SITE_URL || '') + '/api/summarize';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error('Summarize API error', await res.text());
    return { en: '', ja: '' };
  }
  return (await res.json()) as { en: string; ja: string };
}

export default async function Home() {
  const articles = await fetchNews();

  // GPT 要約・翻訳を並列取得
  const enriched: Enriched[] = await Promise.all(
    articles.map(async (a) => {
      const { en, ja } = await summarize(a.description || a.title);
      return { ...a, en, ja };
    })
  );

  return (
    <main className="p-6 space-y-4 max-w-2xl mx-auto">
      {enriched.map((a, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>{a.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 日本語（要約+insight） */}
            <p className="mb-2 text-sm whitespace-pre-wrap">{a.ja}</p>
            {/* 英語原文（オプションで小さく表示） */}
            <p className="text-xs text-gray-500 whitespace-pre-wrap">{a.en}</p>
            <p className="text-sm text-gray-400 mt-1">
              {a.publishedAt.slice(0, 10)}
            </p>
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
