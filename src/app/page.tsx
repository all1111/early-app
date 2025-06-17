import { NewsCard, type Article } from "@/components/NewsCard";

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
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <header className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🌍 EARLY ニュース
        </h1>
        <p className="text-gray-600">
          海外ニュースを日本語で、日本への影響と共に
        </p>
      </header>
      
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {articles.map((a) => (
          <NewsCard key={a.url} {...a} />
        ))}
      </div>
    </div>
  );
}
