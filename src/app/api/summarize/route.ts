import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=5`;

  const res = await fetch(url, {
    headers: {
      "X-Api-Key": apiKey || "",
    },
  });

  if (!res.ok) {
    console.error("NewsAPI fetch failed", res.status);
    return NextResponse.json({ articles: [] });
  }

  const data = await res.json();
  return NextResponse.json({ articles: data.articles || [] });
}
