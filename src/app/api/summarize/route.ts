import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = "force-dynamic";   // 毎回呼び出し

// 期待するリクエスト: { content: "英語の本文 …" }
export async function POST(req: NextRequest) {
  console.log("API hit /api/summarize");
  const { content } = await req.json();

  const prompt =
    `以下の英語ニュースを 3 行の Insight にまとめ、最後に日本語訳を付けてください。\n\n${content}`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const result = chat.choices[0].message.content?.trim() ?? "";
  return NextResponse.json({ result });
}
