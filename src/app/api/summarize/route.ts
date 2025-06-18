import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { title, content, country = "US" } = await req.json();

    // セキュアなサーバーサイドOpenAI APIを使用
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article: {
          title,
          description: content,
          country
        },
        type: 'summarize'
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API call failed:", response.status);
      return NextResponse.json({
        titleJa: title,
        descriptionJa: "要約を生成できませんでした",
        insightJa: "解説を生成できませんでした", 
        impactJa: "影響分析を生成できませんでした",
        audioScript: "音声スクリプトを生成できませんでした"
      });
    }

    const result = await response.json();
    
    return NextResponse.json({
      titleJa: result.titleJa || title,
      descriptionJa: result.descriptionJa || "要約を生成できませんでした",
      insightJa: result.insightJa || "解説を生成できませんでした",
      impactJa: result.impactJa || "影響分析を生成できませんでした",
      audioScript: result.audioScript || "音声スクリプトを生成できませんでした"
    });

  } catch (err: unknown) {
    const e = err as Error;
    console.error("[/api/summarize] error", e);

    return NextResponse.json({
      titleJa: "エラーが発生しました",
      descriptionJa: "要約を生成できませんでした",
      insightJa: "解説を生成できませんでした",
      impactJa: "影響分析を生成できませんでした",
      audioScript: "音声スクリプトを生成できませんでした"
    });
  }
}
