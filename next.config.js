/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      remotePatterns: [
        /* 既存で許可していたドメイン
        -------------------------------------------------- */
        { protocol: 'https', hostname: 'ichef.bbci.co.uk' },      // BBC
        { protocol: 'https', hostname: 'static01.nyt.com' },      // NYTimes
        { protocol: 'https', hostname: 'media.cnn.com' },         // CNN
        { protocol: 'https', hostname: 'static.politico.com' },   // Politico
  
        /* 新しく 400 が出ていたドメイン
        -------------------------------------------------- */
        { protocol: 'https', hostname: 'mmjunkie.usatoday.com' }, // USA Today 画像 CDN
        { protocol: 'https', hostname: 'assets.bwbx.io' },        // Bloomberg 画像 CDN
  
        /* ↓必要に応じて追加していく（例）
        --------------------------------------------------
        { protocol: 'https', hostname: '**.washingtonpost.com' },
        { protocol: 'https', hostname: 'media.foxnews.com' },
        */
      ],
    },
  };
  