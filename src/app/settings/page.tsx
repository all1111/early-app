"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Moon, Bell, Globe, User, Volume2, Smartphone, Info, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

const settingsSections = [
  {
    title: "外観",
    items: [
      {
        id: "theme",
        icon: Moon,
        label: "ダークモード",
        type: "toggle",
        description: "暗い画面で目に優しく"
      }
    ]
  },
  {
    title: "通知",
    items: [
      {
        id: "push-notifications",
        icon: Bell,
        label: "プッシュ通知",
        type: "toggle",
        description: "新しいニュースを通知"
      },
      {
        id: "audio-notifications",
        icon: Volume2,
        label: "音声通知",
        type: "toggle",
        description: "音声での通知を有効化"
      }
    ]
  },
  {
    title: "言語・地域",
    items: [
      {
        id: "language",
        icon: Globe,
        label: "言語設定",
        type: "navigation",
        value: "日本語",
        description: "表示言語を変更"
      },
      {
        id: "region",
        icon: Smartphone,
        label: "地域設定",
        type: "navigation",
        value: "日本",
        description: "ニュースの地域設定"
      }
    ]
  },
  {
    title: "アカウント",
    items: [
      {
        id: "profile",
        icon: User,
        label: "プロフィール",
        type: "navigation",
        description: "個人情報を管理"
      }
    ]
  },
  {
    title: "その他",
    items: [
      {
        id: "about",
        icon: Info,
        label: "アプリについて",
        type: "navigation",
        description: "バージョン情報・利用規約"
      }
    ]
  }
];

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    'push-notifications': true,
    'audio-notifications': false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleSetting = (settingId: string) => {
    if (settingId === 'theme') {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    } else {
      setSettings(prev => ({
        ...prev,
        [settingId]: !prev[settingId as keyof typeof prev]
      }));
    }
  };

  const handleNavigationSetting = (settingId: string) => {
    // 各設定項目の詳細画面への遷移
    console.log(`Navigate to ${settingId} settings`);
  };

  const getToggleValue = (settingId: string) => {
    if (settingId === 'theme') {
      return theme === 'dark';
    }
    return settings[settingId as keyof typeof settings] || false;
  };

  if (!mounted) return null;

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
          
          <div className="text-lg font-semibold text-foreground">
            設定
          </div>
          
          <div className="w-9" /> {/* スペーサー */}
        </div>
      </header>

      {/* プロフィールセクション */}
      <div className="px-4 py-6">
        <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">ユーザー</h2>
              <p className="text-sm text-muted-foreground">EARLYを使用中</p>
            </div>
          </div>
        </div>

        {/* 設定セクション */}
        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-2">
                {section.title}
              </h3>
              
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  const isLast = index === section.items.length - 1;
                  
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => item.type === 'toggle' 
                          ? handleToggleSetting(item.id)
                          : handleNavigationSetting(item.id)
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="p-2 bg-accent/50 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">
                              {item.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {item.type === 'toggle' && (
                            <div className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                              ${getToggleValue(item.id) ? 'bg-primary' : 'bg-muted'}
                            `}>
                              <span className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${getToggleValue(item.id) ? 'translate-x-6' : 'translate-x-1'}
                              `} />
                            </div>
                          )}
                          
                          {item.type === 'navigation' && (
                            <div className="flex items-center space-x-2">
                              {'value' in item && item.value && (
                                <span className="text-sm text-muted-foreground">
                                  {item.value}
                                </span>
                              )}
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </button>
                      
                      {!isLast && <div className="h-px bg-border/50 mx-4" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* アプリ情報 */}
        <div className="mt-8 text-center">
          <div className="text-2xl font-bold text-primary mb-2">EARLY</div>
          <div className="text-sm text-muted-foreground">
            バージョン 1.0.0
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            © 2024 EARLY. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}