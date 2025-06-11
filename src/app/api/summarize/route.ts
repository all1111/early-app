// src/app/api/summarize/route.ts

export async function POST(req: Request) {
  console.log('API hit'); // ← Vercelログ確認用の追記

  try {
    const { article } = await req.json();

    // ここでOpenAIに投げたり、要約処理を行う想定
    // 仮で成功レスポンスだけ返す
    return new Response(JSON.stringify({
      message: 'summarization success',
      received: article
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process request'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
