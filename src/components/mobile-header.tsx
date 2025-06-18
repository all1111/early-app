"use client";

import { Bell, Settings, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function MobileHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* ロゴ部分 */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">
            EARLY
          </div>
          <div className="text-sm text-muted-foreground">
            🌍
          </div>
        </div>

        {/* 右側のアクション */}
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="検索"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
          
          <button 
            className="p-2 hover:bg-accent rounded-full transition-colors relative"
            aria-label="通知"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="テーマ切り替え"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 更新時間表示 */}
      <div className="px-4 pb-2">
        <div className="text-xs text-muted-foreground">
          最終更新: {new Date().toLocaleString('ja-JP', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </header>
  );
}