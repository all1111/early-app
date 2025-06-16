/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      remotePatterns: [
        /* これまで追加したドメイン ------------------------------- */
        { protocol: 'https', hostname: 'ichef.bbci.co.uk' },      // BBC
        { protocol: 'https', hostname: 'static01.nyt.com' },      // NYTimes
        { protocol: 'https', hostname: 'media.cnn.com' },         // CNN
        { protocol: 'https', hostname: 'static.politico.com' },   // Politico
        { protocol: 'https', hostname: 'mmjunkie.usatoday.com' }, // USA Today (旧表記)
        { protocol: 'https', hostname: 'assets.bwbx.io' },        // Bloomberg
  
        /* ←↑ ここまではそのまま ------------------------------- */
  
        /* 🆕 追加：MMA Junkie (USA TODAY Network) 画像 CDN */
        { protocol: 'https', hostname: 'mmajunkie.usatoday.com' },
      ],
    },
  };
  