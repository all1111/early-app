'use client'

import { Button } from './ui/button'

const genres = ['all', 'politics', 'economy', 'tech', 'science']

const genreLabels: { [key: string]: string } = {
  all: 'すべて',
  politics: '政治',
  economy: '経済',
  tech: 'テクノロジー',
  science: 'サイエンス',
}

type GenreFilterProps = {
  selected: string
  onChange: (genre: string) => void
}

export default function GenreFilter({ selected, onChange }: GenreFilterProps) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {genres.map((genre) => (
        <Button
          key={genre}
          variant={selected === genre ? 'default' : 'outline'}
          onClick={() => onChange(genre)}
        >
          {genreLabels[genre]}
        </Button>
      ))}
    </div>
  )
}
