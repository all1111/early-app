'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ja'

dayjs.extend(relativeTime)
dayjs.locale('ja')

type Article = {
  id: string
  title: string
  titleJa: string
  insightJa: string
  publishedAt: string
  imageUrl: string
  url: string
  countryCode: string
}

const countryFlag = (code: string) => {
  const flags: { [key: string]: string } = {
    US: '🇺🇸',
    JP: '🇯🇵',
    GB: '🇬🇧',
    DE: '🇩🇪',
    FR: '🇫🇷',
    KR: '🇰🇷',
    CN: '🇨🇳',
  }
  return flags[code.toUpperCase()] || '🌐'
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setArticles(data.articles || []))
  }, [])

  return (
    <main className="p-6 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">EARLY ニュース解説</h1>
      {articles.slice(0, 10).map(article => (
        <div key={article.id} className="bg-white rounded shadow-md p-4 flex flex-col md:flex-row gap-4">
          <img
            src={article.imageUrl}
            alt="news"
            className="w-[300px] h-[180px] object-cover rounded"
          />
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold">
              {countryFlag(article.countryCode)} {article.titleJa}
            </h2>
            <p className="text-sm text-gray-500">
              🕒 {dayjs(article.publishedAt).fromNow()}　
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                🔗 オリジナル記事へ
              </a>
            </p>
            <p className="text-gray-700 whitespace-pre-wrap">
              <span className="font-bold">【解説】</span> {article.insightJa}
            </p>
          </div>
        </div>
      ))}
    </main>
  )
}
