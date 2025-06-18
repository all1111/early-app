"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Share, Download } from "lucide-react";
import { LoadingState } from "@/components/loading-state";

interface AudioData {
  title: string;
  script: string;
  image: string;
}

function PodcastContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setAudioData(parsedData);
        generateAudio(parsedData.script);
      } catch (error) {
        console.error("Failed to parse audio data:", error);
        router.push('/home');
      }
    } else {
      router.push('/home');
    }
  }, [searchParams, router]);

  const generateAudio = async (text: string) => {
    setIsLoading(true);
    try {
      // 音声生成APIの実装（モック）
      // 実際の実装では、OpenAI TTS APIや他の音声生成サービスを使用
      console.log("Generating audio for:", text);
      
      // モックの音声ファイル（実際の実装では生成された音声を使用）
      if (audioRef.current) {
        audioRef.current.src = "/mock-audio.mp3"; // モック音声ファイル
      }
    } catch (error) {
      console.error("Failed to generate audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      const newTime = (value / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: audioData?.title,
          text: "EARLYで音声ニュースを聞いています",
          url: window.location.href,
        });
      } catch {
        console.log('Share cancelled');
      }
    }
  };

  if (!audioData) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 w-full bg-black/20 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          
          <div className="text-sm font-medium text-white">
            音声再生
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Share className="h-5 w-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Download className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-8">
        {/* アルバムアート */}
        <div className="relative mb-8">
          <div className="w-80 h-80 max-w-[80vw] max-h-[80vw] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={audioData.image}
              alt={audioData.title}
              width={320}
              height={320}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          
          {/* 音符アニメーション */}
          {isPlaying && (
            <div className="absolute -top-4 -right-4 text-white text-2xl animate-bounce">
              🎵
            </div>
          )}
        </div>

        {/* タイトル */}
        <div className="text-center mb-8 max-w-md">
          <h1 className="text-xl font-bold text-white mb-2 leading-tight">
            {audioData.title}
          </h1>
          <p className="text-white/70 text-sm">
            EARLY ニュース
          </p>
        </div>

        {/* プログレスバー */}
        <div className="w-full max-w-md mb-6">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex justify-between text-xs text-white/70 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* コントロールボタン */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button
            onClick={skipBackward}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <SkipBack className="h-6 w-6 text-white" />
          </button>
          
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-8 w-8 text-white fill-current" />
            ) : (
              <Play className="h-8 w-8 text-white fill-current ml-1" />
            )}
          </button>
          
          <button
            onClick={skipForward}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <SkipForward className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* 音量コントロール */}
        <div className="flex items-center space-x-3 max-w-xs w-full">
          <Volume2 className="h-5 w-5 text-white/70" />
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="80"
            className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
          />
        </div>

        {/* スクリプトプレビュー */}
        {audioData.script && (
          <div className="mt-8 max-w-md w-full bg-black/20 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="text-white font-medium mb-2 text-sm">スクリプト</h3>
            <p className="text-white/80 text-xs leading-relaxed line-clamp-4">
              {audioData.script}
            </p>
          </div>
        )}
      </div>

      {/* オーディオ要素 */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

export default function PodcastPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PodcastContent />
    </Suspense>
  );
}