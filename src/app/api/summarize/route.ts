// frontend/src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = "force-dynamic";          // ←毎回呼び出し

// POST /api/summarize
export async function POST(req: NextRequest) {
  console.log("API hit /api/summarize");

  // ① page.tsx から { title, content } を受け取る
  const { title, content } = await req.json();

  const prompt = `
以下は英語のニュース記事です。タイトルと本文を読んで処理してください。

Title:
${title}

Content:
${content}

---

**出力フォーマット（Markdown）**

TitleJa:
<タイトルを日本語訳 1 行>

Insight:
<要約・洞察を英語で 2〜3 行>

Translation:
<Insight を日本語に翻訳 2〜3 行>
`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const answer = chat.choices[0].message.content ?? "";

  // ② Markdown 3 ブロックを抽出
  const m = answer.match(
    /TitleJa:\s*([\s\S]*?)\n+Insight:\s*([\s\S]*?)\n+Translation:\s*([\s\S]*)/i
  );

  return NextResponse.json({
    titleJa: (m?.[1] || "").trim(),
    insightEn: (m?.[2] || "").trim(),
    insightJa: (m?.[3] || "").trim(),
  });
}
