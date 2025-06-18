import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build" 
});

type CurrentsArticle = {
  title: string;
  description: string;
  url: string;
  image: string;
  published: string;
  country: string[];
};

export type ProcessedArticle = {
  title: string;
  titleJa: string;
  descriptionJa: string;
  insightJa: string;
  impactJa: string;
  audioScript: string;
  url: string;
  image: string;
  publishedAt: string;
  country: string;
};

export async function getNewsArticles(): Promise<ProcessedArticle[]> {
  try {
    // 環境変数の確認
    if (!process.env.CURRENTS_API_KEY) {
      console.error("CURRENTS_API_KEY is not set");
      return [];
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return [];
    }

    // Currents APIから海外ニュースを取得
    const apiKey = process.env.CURRENTS_API_KEY;
    const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}&language=en&country=us,gb,ca,au&page_size=10`;

    const res = await fetch(url, { 
      cache: "no-store",
      next: { revalidate: 300 } // 5分間キャッシュ
    });

    if (!res.ok) {
      console.error("Currents API error:", res.status, await res.text());
      return [];
    }

    const data = await res.json();
    const articles = data.news || [];

    if (!Array.isArray(articles) || articles.length === 0) {
      console.warn("No articles received from Currents API");
      return [];
    }

    // 各記事をOpenAI GPTで処理（並列処理で高速化）
    const processedArticles = await Promise.allSettled(
      articles.slice(0, 8).map(async (article: CurrentsArticle) => {
        try {
          return await processArticleWithAI(article);
        } catch (error) {
          console.error("Error processing article:", article.title, error);
          return null;
        }
      })
    );

    // 成功した記事のみを抽出
    const validArticles = processedArticles
      .filter((result): result is PromiseFulfilledResult<ProcessedArticle> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    return validArticles;
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return [];
  }
}

async function processArticleWithAI(article: CurrentsArticle): Promise<ProcessedArticle> {
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

記事タイトル: ${article.title}
記事内容: ${article.description || article.title}
`.trim();

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "あなたは日本のニュース解説者です。海外ニュースを日本の視聴者向けに分かりやすく解説します。" },
      { role: "user", content: prompt }
    ],
    max_tokens: 1500,
    temperature: 0.7,
  });

  const result = chat.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(result || "{}");
    
    return {
      title: article.title,
      titleJa: parsed.titleJa || article.title,
      descriptionJa: parsed.descriptionJa || "要約を取得できませんでした",
      insightJa: parsed.insightJa || "解説を取得できませんでした",
      impactJa: parsed.impactJa || "影響分析を取得できませんでした",
      audioScript: parsed.audioScript || "音声スクリプトを取得できませんでした",
      url: article.url,
      image: article.image || "/placeholder-news.jpg",
      publishedAt: article.published,
      country: article.country[0] || "US",
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    // フォールバック: AI処理なしでも記事を表示
    return {
      title: article.title,
      titleJa: article.title,
      descriptionJa: article.description || "要約を取得できませんでした",
      insightJa: "AI処理中にエラーが発生しました",
      impactJa: "影響分析を取得できませんでした",
      audioScript: "音声スクリプトを取得できませんでした",
      url: article.url,
      image: article.image || "/placeholder-news.jpg",
      publishedAt: article.published,
      country: article.country[0] || "US",
    };
  }
}