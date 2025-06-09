/* ------------ src/app/page.tsx ------------ */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GenreFilter from '@/components/GenreFilter'

type Article = {
  title: string
  description?: string
  publishedAt?: string
  url: string
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`
  )
  const data = await res.json()
  return {
    props: { articles: data.articles ?? [] },
  }
}

export default function Home({ articles }: { articles: Article[] }) {
  return (
    <main className="p-6 space-y-4 max-w-2xl mx-auto">
      <GenreFilter />
      {articles.map((a, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>{a.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-gray-600 line-clamp-2">
              {a.description ?? 'No description'}
            </p>
            <p className="text-sm text-gray-400">{a.publishedAt?.slice(0, 10)}</p>
            <a
              href={a.url}
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
