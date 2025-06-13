import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { content } = await req.json();

  const prompt =
    `以下の英語ニュースを3行の Insight にまとめ、その後に日本語訳を3行で返してください。\n\n${content}`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const result = chat.choices[0].message.content?.trim() ?? "";
  return NextResponse.json({ result });
}
