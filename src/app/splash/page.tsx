"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // スプラッシュアニメーション開始
    setIsVisible(true);
    
    // 3秒後にホーム画面に遷移
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* アニメーション背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-800/20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping delay-300" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping delay-700" />
      </div>

      {/* メインコンテンツ */}
      <div 
        className={`relative z-10 text-center px-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}
      >
        {/* ロゴ */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-6xl md:text-7xl font-bold text-white mb-2 tracking-tight">
              EARLY
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-lg blur opacity-25 animate-pulse" />
          </div>
          <div className="flex items-center justify-center mt-4">
            <div className="w-8 h-0.5 bg-white/60 rounded-full mr-3" />
            <span className="text-white/90 text-lg font-medium">🌍</span>
            <div className="w-8 h-0.5 bg-white/60 rounded-full ml-3" />
          </div>
        </div>

        {/* キャッチコピー */}
        <div 
          className={`space-y-3 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <h2 className="text-xl md:text-2xl text-white/95 font-semibold">
            世界のニュースを
          </h2>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            日本語要約で、<br />
            日本への影響と共に
          </p>
        </div>

        {/* サブテキスト */}
        <div 
          className={`mt-8 transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <p className="text-sm text-white/70">
            AI要約 • 影響分析 • 音声配信
          </p>
        </div>

        {/* ローディングインジケーター */}
        <div 
          className={`mt-12 transform transition-all duration-1000 delay-1500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      </div>

      {/* 下部の装飾 */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-2000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="text-xs text-white/50">
          Powered by AI
        </div>
      </div>
    </div>
  );
}