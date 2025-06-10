import { NextResponse } from 'next/server';

export const runtime = 'edge'; // edge で実行。node にしたい場合は 'nodejs'

export async function POST(req: Request) {
  const { text } = await req.json();

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an excellent news editor.',
        },
        {
          role: 'user',
          content: `
記事を3行で英語要約し、最後に1行Insight。
その後、まとめて日本語訳を返してください。
----
${text}
          `.trim(),
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errTxt = await res.text();
    return NextResponse.json({ error: errTxt }, { status: 500 });
  }

  const data = await res.json();
  const answer: string = data.choices?.[0]?.message?.content || '';

  // 空行で英語ブロック / 日本語ブロックを分割
  const [en, ja = ''] = answer.split(/\n{2,}/);

  return NextResponse.json({ en: en.trim(), ja: ja.trim() });
}
