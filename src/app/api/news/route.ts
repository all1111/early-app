import { NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type CurrentsArticle = {
  title: string;
  description: string;
  url: string;
  image: string;
  published: string;
  country: string[];
};

type ProcessedArticle = {
  title: string;
  titleJa: string;
  descriptionJa: string;
  insightJa: string;
  impactJa: string;
  audioScript: string;
  url: string;
  image: string;
  publishedAt: string;
  country: string;
};

export async function GET() {
  try {
    // Currents APIから海外ニュースを取得
    const apiKey = process.env.CURRENTS_API_KEY!;
    const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}&language=en&country=us,gb,ca,au&page_size=10`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error("Currents API error:", res.status, await res.text());
      return NextResponse.json({ articles: [] }, { status: 500 });
    }

    const data = await res.json();
    const articles = data.news || [];

    // 各記事をOpenAI GPTで処理
    const processedArticles = await Promise.all(
      articles.map(async (article: CurrentsArticle) => {
        try {
          const processed = await processArticleWithAI(article);
          return processed;
        } catch (error) {
          console.error("Error processing article:", error);
          return null;
        }
      })
    );

    // nullを除外
    const validArticles = processedArticles.filter((article): article is ProcessedArticle => article !== null);

    return NextResponse.json({ articles: validArticles });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}

async function processArticleWithAI(article: CurrentsArticle): Promise<ProcessedArticle> {
  const prompt = `
# 指示
以下の英文ニュース記事について、JSON形式で回答してください：

{
  "titleJa": "記事タイトルの日本語訳",
  "descriptionJa": "記事の要約（200文字以内）",
  "insightJa": "詳細解説（400文字以内）",
  "impactJa": "日本への影響分析（300文字以内）",
  "audioScript": "音声配信用のスクリプト（500文字以内、自然な話し言葉）"
}

記事タイトル: ${article.title}
記事内容: ${article.description}
`.trim();

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "あなたは日本のニュース解説者です。海外ニュースを日本の視聴者向けに分かりやすく解説します。" },
      { role: "user", content: prompt }
    ],
  });

  const result = chat.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(result || "{}");
    
    return {
      title: article.title,
      titleJa: parsed.titleJa || article.title,
      descriptionJa: parsed.descriptionJa || "",
      insightJa: parsed.insightJa || "",
      impactJa: parsed.impactJa || "",
      audioScript: parsed.audioScript || "",
      url: article.url,
      image: article.image || "/placeholder-news.jpg",
      publishedAt: article.published,
      country: article.country[0] || "US",
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw error;
  }
}
