"use client";

import { Home, Headphones, Settings, Globe } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    icon: Home,
    label: "ホーム",
    href: "/home",
    active: (pathname: string) => pathname === "/home"
  },
  {
    icon: Globe,
    label: "記事",
    href: "/article",
    active: (pathname: string) => pathname.startsWith("/article")
  },
  {
    icon: Headphones,
    label: "音声",
    href: "/podcast",
    active: (pathname: string) => pathname.startsWith("/podcast")
  },
  {
    icon: Settings,
    label: "設定",
    href: "/settings",
    active: (pathname: string) => pathname === "/settings"
  }
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/40">
      <div className="flex items-center justify-around px-4 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active(pathname);
          
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] py-2 px-1 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-transform duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              
              {/* アクティブインジケーター */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}