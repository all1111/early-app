import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  console.log("API hit");

  const { article } = await req.json();

  const prompt = `以下は英語のニュース記事です。\n\n${article}\n\nこの内容の要点（Insight）を3行で要約し、そのあとに日本語で翻訳してください。形式は以下に従ってください：\n\nInsight:\n...\n\nTranslation:\n...`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const responseText = chat.choices[0].message.content || "";

  // InsightとTranslationの抽出
  const match = responseText.match(/Insight:\s*([\s\S]*?)Translation:\s*([\s\S]*)/);

  const insightPart = match?.[1]?.trim() || "";
  const translationPart = match?.[2]?.trim() || "";

  return NextResponse.json({
    insight: insightPart,
    translation: translationPart,
  });
}
