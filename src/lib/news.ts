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

// タイムアウト付きfetch関数
async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 3000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// タイムアウト付きAI処理関数
async function processWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Operation timeout')), timeout)
    )
  ]);
}

export async function getNewsArticles(): Promise<ProcessedArticle[]> {
  const startTime = Date.now();
  
  try {
    // 環境変数の確認
    if (!process.env.CURRENTS_API_KEY) {
      console.error("CURRENTS_API_KEY is not set");
      return getFallbackArticles();
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY is not set, using fallback");
      return getFallbackArticles();
    }

    // Currents APIから海外ニュースを取得（3秒タイムアウト）
    const apiKey = process.env.CURRENTS_API_KEY;
    const url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}&language=en&country=us,gb,ca,au&page_size=6`;

    const res = await fetchWithTimeout(url, { 
      timeout: 3000,
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      console.error("Currents API error:", res.status);
      return getFallbackArticles();
    }

    const data = await res.json();
    const articles = data.news || [];

    if (!Array.isArray(articles) || articles.length === 0) {
      console.warn("No articles received from Currents API");
      return getFallbackArticles();
    }

    // 処理時間管理（最大8秒で全処理完了）
    const maxProcessingTime = 8000;
    const remainingTime = maxProcessingTime - (Date.now() - startTime);
    
    if (remainingTime <= 1000) {
      console.warn("Insufficient time remaining, using fallback");
      return getFallbackArticles();
    }

    // 同時処理数を制限（3記事まで）
    const limitedArticles = articles.slice(0, 3);
    const processingTimeout = Math.min(remainingTime - 500, 5000); // 最大5秒、余裕を持たせる

    // 各記事をAI処理（限定的並列処理）
    const processedArticles = await Promise.allSettled(
      limitedArticles.map(async (article: CurrentsArticle) => {
        try {
          return await processWithTimeout(
            processArticleWithAI(article),
            processingTimeout / limitedArticles.length
          );
        } catch (error) {
          console.error("Error processing article:", article.title, error);
          return createFallbackArticle(article);
        }
      })
    );

    // 成功した記事とフォールバック記事を組み合わせ
    const validArticles = processedArticles
      .filter((result): result is PromiseFulfilledResult<ProcessedArticle> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    // 最低限の記事数を保証
    if (validArticles.length === 0) {
      return getFallbackArticles();
    }

    // 不足分をフォールバック記事で補完
    const remainingArticles = articles.slice(3, 6);
    const fallbackArticles = remainingArticles.map(createFallbackArticle);
    
    return [...validArticles, ...fallbackArticles].slice(0, 6);

  } catch (error) {
    console.error("Error fetching news articles:", error);
    return getFallbackArticles();
  }
}

// 高速化されたAI処理関数
async function processArticleWithAI(article: CurrentsArticle): Promise<ProcessedArticle> {
  const prompt = `
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

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "簡潔で正確な日本語要約を作成してください。" },
      { role: "user", content: prompt }
    ],
    max_tokens: 800, // トークン数を削減
    temperature: 0.3, // 速度重視
  });

  const result = chat.choices[0].message.content;
  
  try {
    const parsed = JSON.parse(result || "{}");
    
    return {
      title: article.title,
      titleJa: parsed.titleJa || article.title,
      descriptionJa: parsed.descriptionJa || "要約処理中です",
      insightJa: parsed.insightJa || "解説を生成中です",
      impactJa: parsed.impactJa || "影響分析を生成中です",
      audioScript: parsed.audioScript || "音声スクリプトを生成中です",
      url: article.url,
      image: article.image || "/placeholder-news.jpg",
      publishedAt: article.published,
      country: article.country[0] || "US",
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return createFallbackArticle(article);
  }
}

// フォールバック記事作成関数
function createFallbackArticle(article: CurrentsArticle): ProcessedArticle {
  return {
    title: article.title,
    titleJa: article.title,
    descriptionJa: article.description || "記事の詳細はリンクからご確認ください",
    insightJa: "この記事の詳細な解説は元記事をご覧ください",
    impactJa: "日本への影響については元記事で詳細をご確認ください",
    audioScript: "この記事について詳しくは元記事をご確認ください",
    url: article.url,
    image: article.image || "/placeholder-news.jpg",
    publishedAt: article.published,
    country: article.country[0] || "US",
  };
}

// デフォルト記事データ
function getFallbackArticles(): ProcessedArticle[] {
  const now = new Date().toISOString();
  
  return [
    {
      title: "Global Technology Update",
      titleJa: "グローバル技術動向",
      descriptionJa: "最新の技術動向についてお伝えします。詳細は後ほど更新予定です。",
      insightJa: "技術の進歩により、私たちの生活やビジネスに大きな変化が期待されています。",
      impactJa: "日本の技術業界にも新たなイノベーションの波が訪れる可能性があります。",
      audioScript: "今日の技術ニュースをお伝えします。詳細は記事をご確認ください。",
      url: "#",
      image: "/placeholder-news.jpg",
      publishedAt: now,
      country: "US",
    },
    {
      title: "Economic News Update",
      titleJa: "経済ニュース更新",
      descriptionJa: "世界経済の最新動向についてお伝えします。更新をお待ちください。",
      insightJa: "経済指標の変動により、市場に新たな動きが見られています。",
      impactJa: "日本経済への影響について詳細な分析が必要です。",
      audioScript: "経済ニュースをお届けします。詳細は記事でご確認ください。",
      url: "#",
      image: "/placeholder-news.jpg",
      publishedAt: now,
      country: "GB",
    },
    {
      title: "International Relations",
      titleJa: "国際関係ニュース",
      descriptionJa: "国際政治の最新動向についてお伝えします。続報をお待ちください。",
      insightJa: "国際関係の変化により、地政学的な影響が予想されます。",
      impactJa: "日本の外交政策にも変化が必要になる可能性があります。",
      audioScript: "国際関係のニュースをお伝えします。詳細は記事をご覧ください。",
      url: "#",
      image: "/placeholder-news.jpg",
      publishedAt: now,
      country: "CA",
    }
  ];
}