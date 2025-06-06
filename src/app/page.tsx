'use client'

import { useState } from 'react'
import GenreFilter from '../components/GenreFilter'
import { articles } from './data/articles'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState('all')

  const filteredArticles =
    selectedGenre === 'all'
      ? articles
      : articles.filter((article) => article.genre === selectedGenre)

  return (
    <main className="p-6 space-y-4 max-w-2xl mx-auto">
      <GenreFilter selected={selectedGenre} onChange={setSelectedGenre} />

      {filteredArticles.map((article) => (
        <Card key={article.id}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-gray-600 whitespace-pre-wrap">{article.summary}</p>
            <p className="text-sm text-gray-500">{article.insight}</p>
            <p className="text-sm text-gray-400 mt-1">{article.date}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm"
            >
              記事を読む →
            </a>
          </CardContent>
        </Card>
      ))}
    </main>
  )
}
