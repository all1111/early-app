import { NextResponse } from "next/server";
import { getNewsArticles } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await getNewsArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
