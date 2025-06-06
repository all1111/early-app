export type Article = {
    id: string
    title: string
    summary: string
    insight: string
    date: string
    genre: 'politics' | 'economy' | 'tech' | 'science'
    url: string
  }
  
  export const articles: Article[] = [
    {
      id: '1',
      title: 'South Korean stocks rise 2% to lead gains in Asia...',
      summary: '株式先物はほとんど変動せず...',
      insight: 'テクノロジー株の動向が市場全体の方向性を左右...',
      date: '2025-06-04',
      genre: 'tech',
      url: '#',
    },
    {
      id: '2',
      title: 'AI-Powered Financial Markets Show Record Growth',
      summary: '金融市場のAIによる自動取引が過去最高の取引量を記録...',
      insight: 'AIトレーディングにより価格発見が高速化している...',
      date: '2025-06-03',
      genre: 'economy',
      url: '#',
    },
    {
      id: '3',
      title: 'Government Announces New AI Policy Framework',
      summary: '政府がAI規制の新フレームワークを発表...',
      insight: 'AI開発の倫理・プライバシー対応が焦点に...',
      date: '2025-06-02',
      genre: 'politics',
      url: '#',
    },
    {
      id: '4',
      title: 'Breakthrough in Quantum Computing Promises New AI Capabilities',
      summary: '量子コンピューティングの進展によりAI性能が飛躍的に向上...',
      insight: '量子×AIは次世代の技術革新の鍵になる可能性...',
      date: '2025-06-01',
      genre: 'science',
      url: '#',
    },
  ]
  