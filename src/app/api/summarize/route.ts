// src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { articles } = await req.json();      // ← 必ず配列

    /* GPT-4o に丸投げして一括和訳＋要約＋解説を生成させる */
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: `
以下の JSON 配列は英語ニュースです。
各要素ごとに次のフィールドを追加してください。
- titleJa   : 日本語タイトル
- summaryJa : 3 行以内の要約 (日本語)
- insightJa : 約 400〜500 字の解説 (日本語)

JSON だけを返してください。\n\n${JSON.stringify(articles)}
        `.trim(),
        },
      ],
    });

    /* GPT から返ってくるのは articles 配列だけの想定 */
    const enriched = JSON.parse(chat.choices[0].message.content ?? "[]");
    return NextResponse.json(enriched);
  } catch (err: any) {
    console.error("[/api/summarize] error", err);
    return NextResponse.json(
      { message: err?.message ?? "unexpected error" },
      { status: 500 },
    );
  }
}
