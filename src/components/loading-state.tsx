"use client";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダースケルトン */}
      <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-16 h-6 bg-muted rounded animate-pulse" />
            <div className="w-6 h-6 bg-muted rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />
            <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />
            <div className="w-9 h-9 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
        <div className="px-4 pb-2">
          <div className="w-32 h-3 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* コンテンツスケルトン */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
            {/* 画像スケルトン */}
            <div className="w-full h-48 bg-muted animate-pulse" />
            
            {/* コンテンツスケルトン */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="w-full h-5 bg-muted rounded animate-pulse" />
                <div className="w-3/4 h-5 bg-muted rounded animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-4 bg-muted rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-muted rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-muted rounded animate-pulse" />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="w-24 h-3 bg-muted rounded animate-pulse mb-2" />
                <div className="w-full h-3 bg-muted rounded animate-pulse" />
                <div className="w-4/5 h-3 bg-muted rounded animate-pulse mt-1" />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                <div className="w-32 h-3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ボトムナビゲーションスケルトン */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/40">
        <div className="flex items-center justify-around px-4 py-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center min-w-[60px] py-2 px-1">
              <div className="w-5 h-5 bg-muted rounded animate-pulse mb-1" />
              <div className="w-8 h-3 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}