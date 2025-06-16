// src/app/api/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // ────────────────── リクエストボディ ──────────────────
    // page.tsx から送られてくる JSON は
    // { title: string; content: string; image?: string; countryCode?: string }
    //----------------------------------------------------------------------
    const { title, content } = await req.json();

    // ────────────── ChatGPT へのプロンプト ──────────────
    const prompt = `
# 指示
以下の英文ニュース記事について
1行目 : 記事タイトルの日本語訳  
2行目 : 【解説】 と書き出す  
3行目以降 : 400 文字以内でわかりやすく解説する  
`.trim();

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `タイトル: ${title}\n\n本文:\n${content}`,
        },
      ],
    });

    //---------------------------------------------------------------
    // 生成結果をそのまま返却
    //---------------------------------------------------------------
    return NextResponse.json({ result: chat.choices[0].message.content });
  } catch (err: unknown) {
    // eslint で any を禁止しているため unknown → Error にアサーション
    const e = err as Error;
    console.error("[/api/summarize] error", e);

    return NextResponse.json(
      { message: e.message ?? "unexpected error" },
      { status: 500 },
    );
  }
}
