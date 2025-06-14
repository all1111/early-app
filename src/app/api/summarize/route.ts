// frontend/src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = "force-dynamic"; // 毎回呼び出し

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();   // page.tsx から受け取る

  /* --- ChatGPT へのプロンプト ------------------------------- */
  const prompt = `
以下は英語ニュースです。

[Title]
${title}

[Body]
${content}

---

1行目で必ず「タイトルの日本語訳」を返し、続けて
- 3行で要約（日本語）
- 1行でインサイト（日本語）

次の JSON 形式だけで出力してください：
{
  "titleJa": "...",
  "summary": "...",
  "insight": "..."
}`.trim();

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }, // ←JSONで返させる
  });

  /* GPT からの JSON をそのまま返却 -------------------------- */
  const data = JSON.parse(chat.choices[0].message.content!);
  return NextResponse.json(data); // { titleJa, summary, insight }
}
