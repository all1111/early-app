// frontend/src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { kv } from "@vercel/kv";          // ★ Vercel KV SDK を追加

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = "force-dynamic";   // Edge/Lambda どちらでも毎回呼び出し

/* ---------- 型 ---------- */
interface JPInfo {
  titleJa: string;
  summary: string;   // 3 行の要約（日本語）
  insight: string;   // 400 文字以内の洞察（日本語）
}

/* ---------- POST /api/summarize ---------- */
export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  /* ① KV キャッシュをチェック */
  const cacheKey = `sum:${title}`;
  const cached = await kv.get<JPInfo>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  /* ② GPT へリクエスト（日本語オンリー） */
  const prompt = `
以下は英語ニュースのタイトルと本文です。

[Title]
${title}

[Body]
${content}

---

1行目: タイトルの日本語訳
2〜4行目: 記事の要約（日本語、合計3行）
5行目: 洞察を日本語で400文字以内

必ず次の JSON 形式で出力:
{
  "titleJa": "...",
  "summary": "...",
  "insight": "..."
}`.trim();

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },   // JSON で返させる
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  /* ③ JSON をパースして返却 */
  const data: JPInfo = JSON.parse(chat.choices[0].message.content ?? "{}");

  /* ④ KV に 7 日間キャッシュ */
  await kv.set(cacheKey, data, { ex: 60 * 60 * 24 * 7 });

  return NextResponse.json(data);
}
