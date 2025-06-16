/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // ここに “リモート画像を配信しているドメイン” を列挙
      remotePatterns: [
        // Bloomberg（例）
        {
          protocol: 'https',
          hostname: '**.bwx.io',
        },
        // Washington Post
        {
          protocol: 'https',
          hostname: '**.washingtonpost.com',
        },
        // Salt Lake Tribune（例）
        {
          protocol: 'https',
          hostname: '**.sltrib.com',
        },
        // ─────────────────────────────
        // 必要に応じて追加
        // { protocol: 'https', hostname: '**.cnn.com' },
        // { protocol: 'https', hostname: '**.nytimes.com' },
        // ……
        // ─────────────────────────────
        //
        // 最終手段：全部許可（課金増の可能性あり）
        // { protocol: 'https', hostname: '**' },
      ],
    },
  };
  
  module.exports = nextConfig;
  