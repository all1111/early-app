// frontend/src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  const prompt = `
英語ニュース本文:
${content}

--- 要求 ---
1. Insight を英語で 3 行
2. その直後に日本語訳を 3 行
「Insight:」「Translation:」の見出しは必ず付ける
`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const full = chat.choices[0].message.content ?? "";
  const [, insight = full, translation = ""] =
    full.match(/Insight:\s*([\s\S]*?)Translation:\s*([\s\S]*)/i) || [];

  return NextResponse.json({
    insight: insight.trim(),
    translation: translation.trim(),
  });
}
