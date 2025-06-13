// src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数
});

export const dynamic = "force-dynamic"; // 毎回呼び出し

// ────────────────────────
//  POST /api/summarize
//  body: { content: "英語本文またはタイトル" }
//  return: { insight: "...", translation: "..." }
// ────────────────────────
export async function POST(req: NextRequest) {
  console.log("API hit /api/summarize");

  const { content } = await req.json();

  const prompt = [
    "以下は英語のニュース記事です。",
    "",
    content,
    "",
    "この内容を3行で英語要約(**Insight**)し、続けて日本語訳(**Translation**)を返してください。",
    "フォーマットは下記：",
    "",
    "Insight:",
    "...",
    "",
    "Translation:",
    "...",
  ].join("\n");

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = chat.choices[0].message.content ?? "";

  // 正規表現で抽出
  const match = raw.match(/Insight:\s*([\s\S]*?)Translation:\s*([\s\S]*)/);
  const insight = match?.[1]?.trim() ?? "";
  const translation = match?.[2]?.trim() ?? "";

  return NextResponse.json({ insight, translation });
}
