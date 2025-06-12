// ------------- ここから -------------
import { NextResponse } from "next/server";

// Vercel の Environment Variables に登録したキー
const apiKey = process.env.NEWS_API_KEY!;   // 例: 123abc…

export async function GET() {
  const res = await fetch(
    "https://newsapi.org/v2/top-headlines?language=en&pageSize=5",
    { headers: { "X-Api-Key": apiKey } }
  );

  // 失敗した場合は空配列を返しておく
  if (!res.ok) {
    console.error("NewsAPI error:", res.status);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ articles: data.articles ?? [] });
}
// ------------- ここまで -------------
