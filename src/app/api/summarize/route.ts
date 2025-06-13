// frontend/src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  /* ✅ 日本語だけ返すようプロンプトを最小化 */
  const prompt = `
以下のニュース記事を読んでください。

1. 記事全体を **3行の日本語** で要約してください（Summary）。
2. そのあと **1行の日本語** で洞察（Insight）を書いてください。

フォーマットは必ず次の JSON で：
{
  "summary": "...",
  "insight": "..."
}

タイトル: ${title}
本文:
${content}`.trim();

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" }, // ← JSON だけ返す指定
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json(JSON.parse(chat.choices[0].message.content || "{}"));
}
