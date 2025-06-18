import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

// OpenAIクライアントの初期化 - サーバーサイドでのみ使用
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // APIキーの存在確認
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { article, type = "summarize" } = body;

    if (!article || !article.title) {
      return NextResponse.json(
        { error: "Article data is required" },
        { status: 400 }
      );
    }

    let prompt = "";
    let systemMessage = "";

    if (type === "summarize") {
      systemMessage = "あなたは日本のニュース解説者です。海外ニュースを日本の視聴者向けに分かりやすく解説します。";
      prompt = `
以下の英文記事を日本語で要約してください。JSON形式で回答：

{
  "titleJa": "記事タイトルの日本語訳",
  "descriptionJa": "要約（150文字以内）",
  "insightJa": "解説（250文字以内）",
  "impactJa": "日本への影響（200文字以内）",
  "audioScript": "音声用スクリプト（300文字以内）"
}

タイトル: ${article.title}
内容: ${(article.description || article.title).slice(0, 500)}
`.trim();
    } else if (type === "audio") {
      systemMessage = "あなたは音声配信用のスクリプト作成者です。自然で聞きやすい日本語で作成してください。";
      prompt = `
以下のニュース記事について、音声配信用のスクリプトを作成してください。
500文字以内で、自然な話し言葉で作成してください。

タイトル: ${article.titleJa || article.title}
要約: ${article.descriptionJa}
解説: ${article.insightJa}
日本への影響: ${article.impactJa}
`.trim();
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content;

    if (type === "summarize") {
      try {
        const parsed = JSON.parse(result || "{}");
        return NextResponse.json({
          titleJa: parsed.titleJa || article.title,
          descriptionJa: parsed.descriptionJa || "要約を生成できませんでした",
          insightJa: parsed.insightJa || "解説を生成できませんでした",
          impactJa: parsed.impactJa || "影響分析を生成できませんでした",
          audioScript: parsed.audioScript || "音声スクリプトを生成できませんでした"
        });
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        return NextResponse.json({
          titleJa: article.title,
          descriptionJa: "要約を生成できませんでした",
          insightJa: "解説を生成できませんでした",
          impactJa: "影響分析を生成できませんでした",
          audioScript: "音声スクリプトを生成できませんでした"
        });
      }
    } else if (type === "audio") {
      return NextResponse.json({
        audioScript: result || "音声スクリプトを生成できませんでした"
      });
    }

    return NextResponse.json({ result });

  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // エラーの詳細をログに記録（APIキーは除外）
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

    return NextResponse.json(
      { error: "Failed to process with OpenAI" },
      { status: 500 }
    );
  }
}