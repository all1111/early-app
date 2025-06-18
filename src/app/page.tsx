import { NewsCard } from "@/components/NewsCard";
import { getNewsArticles } from "@/lib/news";

export default async function Page() {
  try {
    const articles = await getNewsArticles();

    if (!Array.isArray(articles)) {
      console.error("data is not array", { articles });
      return (
        <div className="max-w-4xl mx-auto space-y-8 p-4">
          <p className="text-center text-gray-500">ニュースを読み込み中...</p>
        </div>
      );
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
  } catch (error) {
    console.error("Error loading news:", error);
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
        <p className="text-center text-red-500">
          ニュースの読み込み中にエラーが発生しました
        </p>
      </div>
    );
  }
}
