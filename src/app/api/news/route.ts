import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";   // 毎回最新を取得

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY!;   // Vercel の環境変数
  const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error("NewsAPI error:", res.status, await res.text());
    return NextResponse.json({ articles: [] }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ articles: data.articles ?? [] });
}
