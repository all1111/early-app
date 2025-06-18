import { NextResponse } from "next/server";
import { getNewsArticles } from "@/lib/news";

export const dynamic = "force-dynamic";
export const maxDuration = 10; // Vercel Function timeout: 10秒

export async function GET() {
  const startTime = Date.now();
  
  try {
    console.log("Starting news fetch...");
    
    // タイムアウト制御
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API timeout')), 9000) // 9秒でタイムアウト
    );
    
    const articlePromise = getNewsArticles();
    
    const articles = await Promise.race([articlePromise, timeoutPromise]);
    
    const duration = Date.now() - startTime;
    console.log(`News fetch completed in ${duration}ms`);
    
    return NextResponse.json({ 
      articles,
      meta: {
        fetchTime: duration,
        timestamp: new Date().toISOString(),
        count: Array.isArray(articles) ? articles.length : 0
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`API error after ${duration}ms:`, error);
    
    // フォールバック記事を返す
    return NextResponse.json({ 
      articles: [], 
      meta: {
        fetchTime: duration,
        timestamp: new Date().toISOString(),
        error: "Timeout or fetch error",
        count: 0
      }
    }, { 
      status: 200 // エラーでも200を返してクライアントで処理
    });
  }
}
