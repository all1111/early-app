// frontend/src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const dynamic = "force-dynamic";      // 毎回呼び出し

// POST /api/summarize
export async function POST(req: NextRequest) {
  console.log("API hit /api/summarize");

  const { content } = await req.json();      // page.tsx から渡すデータ

  const prompt = `以下の英語記事を3行のInsightで要約し、最後に日本語訳を付けてください。\n\n${content}`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const answer = chat.choices[0].message.content ?? "";

  return NextResponse.json({ result: answer.trim() });
}
