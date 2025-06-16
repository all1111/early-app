/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  
    // ――― 画像 CDN 設定 ―――
    images: {
      // 基本的によく使うニュースサイト CDN をまとめて許可
      remotePatterns: [
        // Bloomberg
        { protocol: "https", hostname: "assets.bwbx.io" },
  
        // Washington Post
        { protocol: "https", hostname: "www.washingtonpost.com" },
  
        // CNN / Turner
        { protocol: "https", hostname: "cdn.cnn.com" },
  
        // AP News
        { protocol: "https", hostname: "storage.googleapis.com" },
  
        // Reuters
        { protocol: "https", hostname: "cloudfront-us-east-2.images.arcpublishing.com" },
  
        // Wall Street Journal（ここを追加）
        { protocol: "https", hostname: "images.wsj.net" },
        { protocol: "https", hostname: "s.wsj.net" },
  
        // 汎用 fallback（MMA Junkie, ESPN 等）
        { protocol: "https", hostname: "**.usatoday.com" },
        { protocol: "https", hostname: "**.gannett-cdn.com" },
      ],
      // 画像を 300×180px に統一して扱う場合でも、
      // 実際には元サイズを取得して Next.js がレスポンシブ変換します。
    },
  
    // ――― ESLint で “any” を許可（API ルート限定）―――
    eslint: {
      ignoreDuringBuilds: true,
    },
  
    // ――― Webpack や experimental 設定など入れたければここに ―――
  };
  
  module.exports = nextConfig;
  