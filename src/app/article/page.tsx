"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Share, BookOpen, Globe, TrendingUp, Play } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { flagEmoji } from "@/lib/utils";
import { LoadingState } from "@/components/loading-state";

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

function ArticleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const articleData = JSON.parse(decodeURIComponent(data));
        setArticle(articleData);
      } catch (error) {
        console.error("Failed to parse article data:", error);
        router.push('/home');
      }
    } else {
      router.push('/home');
    }
  }, [searchParams, router]);

  const handlePlayAudio = () => {
    if (article) {
      const audioData = encodeURIComponent(JSON.stringify({
        title: article.titleJa,
        script: article.audioScript,
        image: article.image
      }));
      router.push(`/podcast?data=${audioData}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.titleJa || article?.title,
          text: article?.descriptionJa,
          url: window.location.href,
        });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!article) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="text-sm font-medium text-foreground">
            記事詳細
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <Share className="h-5 w-5" />
            </button>
            <button
              onClick={() => window.open(article.url, '_blank')}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* メイン画像 */}
      <div className="relative">
        <Image
          src={article.image}
          alt={article.title}
          width={400}
          height={250}
          className="w-full h-64 object-cover"
          unoptimized
        />
        
        {/* オーバーレイ情報 */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
            <span className="text-white text-sm">{flagEmoji(article.country)}</span>
            <Globe className="h-3 w-3 text-white/80" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-sm">
              {dayjs(article.publishedAt).fromNow()}
            </span>
          </div>
        </div>

        {/* 音声再生ボタン */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handlePlayAudio}
            className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-3 transition-colors shadow-lg"
          >
            <Play className="h-5 w-5 fill-current" />
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="px-4 py-6 space-y-6 pb-8">
        {/* タイトル */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            {article.titleJa || article.title}
          </h1>
          {article.titleJa && article.title !== article.titleJa && (
            <p className="text-sm text-muted-foreground italic">
              {article.title}
            </p>
          )}
        </div>

        {/* 要約セクション */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">要約</h2>
          </div>
          <p className="text-foreground leading-relaxed">
            {article.descriptionJa}
          </p>
        </div>

        {/* 解説セクション */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center space-x-2 mb-3">
            <Globe className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold text-foreground">詳細解説</h2>
          </div>
          <p className="text-foreground leading-relaxed">
            {article.insightJa}
          </p>
        </div>

        {/* 日本への影響セクション */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-5 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-foreground">🇯🇵 日本への影響</h2>
          </div>
          <p className="text-foreground leading-relaxed">
            {article.impactJa}
          </p>
        </div>

        {/* 音声スクリプトセクション */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-foreground">音声スクリプト</h2>
            </div>
            <button
              onClick={handlePlayAudio}
              className="text-primary text-sm font-medium hover:underline"
            >
              再生する
            </button>
          </div>
          <p className="text-foreground leading-relaxed">
            {article.audioScript}
          </p>
        </div>

        {/* 元記事リンク */}
        <div className="bg-accent/50 rounded-2xl p-4">
          <button
            onClick={() => window.open(article.url, '_blank')}
            className="w-full flex items-center justify-center space-x-2 text-primary font-medium hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            <span>元記事を読む</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ArticleContent />
    </Suspense>
  );
}