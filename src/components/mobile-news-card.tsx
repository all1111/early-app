"use client";

import Image from "next/image";
import { Clock, ExternalLink, Play, Globe } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { flagEmoji } from "@/lib/utils";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("ja");

interface Article {
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
}

interface MobileNewsCardProps {
  article: Article;
}

export function MobileNewsCard({ article }: MobileNewsCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    const articleData = encodeURIComponent(JSON.stringify(article));
    router.push(`/article?data=${articleData}`);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audioData = encodeURIComponent(JSON.stringify({
      title: article.titleJa,
      script: article.audioScript,
      image: article.image
    }));
    router.push(`/podcast?data=${audioData}`);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article 
      className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 画像とメタデータ */}
      <div className="relative">
        <Image
          src={article.image}
          alt={article.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
          unoptimized
        />
        
        {/* オーバーレイ情報 */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <span className="text-white text-sm">{flagEmoji(article.country)}</span>
            <Globe className="h-3 w-3 text-white/80" />
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <button
            onClick={handlePlayAudio}
            className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-2 transition-colors"
            aria-label="音声再生"
          >
            <Play className="h-4 w-4 fill-current" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <Clock className="h-3 w-3 text-white/80" />
            <span className="text-white text-xs font-medium">
              {dayjs(article.publishedAt).fromNow()}
            </span>
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-4 space-y-3">
        {/* タイトル */}
        <h2 className="font-bold text-lg leading-tight text-foreground line-clamp-2">
          {article.titleJa || article.title}
        </h2>

        {/* 要約 */}
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {article.descriptionJa}
        </p>

        {/* 日本への影響（プレビュー） */}
        <div className="bg-accent/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-semibold text-primary">🇯🇵 日本への影響</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {article.impactJa}
          </p>
        </div>

        {/* アクションボタン */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleExternalLink}
            className="flex items-center space-x-2 text-primary text-sm font-medium hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            <span>元記事</span>
          </button>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>詳細を見る</span>
            <div className="w-1 h-1 bg-current rounded-full" />
            <span>音声</span>
            <div className="w-1 h-1 bg-current rounded-full" />
            <span>分析</span>
          </div>
        </div>
      </div>
    </article>
  );
}