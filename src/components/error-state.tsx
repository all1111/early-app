"use client";

import { RefreshCw, AlertCircle } from "lucide-react";

interface ErrorStateProps {
  onRetry?: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-sm">
        {/* エラーアイコン */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        {/* エラーメッセージ */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            接続エラー
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            ニュースの読み込みに失敗しました。<br />
            ネットワーク接続を確認して再試行してください。
          </p>
        </div>

        {/* 再試行ボタン */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>再試行</span>
          </button>
        )}

        {/* サポート情報 */}
        <div className="text-xs text-muted-foreground">
          問題が続く場合は、しばらく時間をおいて再度お試しください
        </div>
      </div>
    </div>
  );
}