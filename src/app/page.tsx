import { NewsCard } from "@/components/NewsCard";
import { getNewsArticles } from "@/lib/news";
import { Suspense } from "react";

function LoadingState() {
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
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3 shadow-sm bg-white animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState() {
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
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">
          ニュースの読み込み中にエラーが発生しました
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          再読み込み
        </button>
      </div>
    </div>
  );
}

async function NewsContent() {
  try {
    const articles = await getNewsArticles();

    if (!Array.isArray(articles) || articles.length === 0) {
      return <ErrorState />;
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
          <div className="mt-2 text-sm text-gray-500">
            最終更新: {new Date().toLocaleString('ja-JP')}
          </div>
        </header>
        
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {articles.map((a, index) => (
            <NewsCard key={`${a.url}-${index}`} {...a} />
          ))}
        </div>
        
        <footer className="text-center py-8 text-sm text-gray-500">
          <p>データ取得に時間がかかる場合があります</p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Error loading news:", error);
    return <ErrorState />;
  }
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NewsContent />
    </Suspense>
  );
}
