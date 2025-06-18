import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build" 
});

export async function POST(req: NextRequest) {
  try {
    const { title, content, country = "US" } = await req.json();

    const prompt = `
# 指示
以下の英文ニュース記事について、JSON形式で回答してください：

{
  "titleJa": "記事タイトルの日本語訳",
  "descriptionJa": "記事の要約（200文字以内）",
  "insightJa": "詳細解説（400文字以内）",
  "impactJa": "日本への影響分析（300文字以内）",
  "audioScript": "音声配信用のスクリプト（500文字以内、自然な話し言葉）"
}

記事タイトル: ${title}
記事内容: ${content}
発信国: ${country}
`.trim();

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "あなたは日本のニュース解説者です。海外ニュースを日本の視聴者向けに分かりやすく解説します。" },
        { role: "user", content: prompt }
      ],
    });

    const result = chat.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(result || "{}");
      return NextResponse.json({
        titleJa: parsed.titleJa || title,
        descriptionJa: parsed.descriptionJa || "",
        insightJa: parsed.insightJa || "",
        impactJa: parsed.impactJa || "",
        audioScript: parsed.audioScript || ""
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json({
        titleJa: title,
        descriptionJa: "要約を生成できませんでした",
        insightJa: "解説を生成できませんでした",
        impactJa: "影響分析を生成できませんでした",
        audioScript: "音声スクリプトを生成できませんでした"
      });
    }
  } catch (err: unknown) {
    const e = err as Error;
    console.error("[/api/summarize] error", e);

    return NextResponse.json(
      { message: e.message ?? "unexpected error" },
      { status: 500 },
    );
  }
}
