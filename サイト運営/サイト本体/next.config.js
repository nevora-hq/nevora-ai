const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 完全静的エクスポート(out/ に静的ファイルだけを出力し、サーバー実行の Function を使わない)。
  // redirects() は静的エクスポートでは使えないため、旧記事URLの転送は vercel.json に置く。
  // 記事を「記事データ/非公開アーカイブ」へ移すとそのslugは404になるため、統合先への
  // 301は vercel.json の redirects に定義する(復活させる記事は先にその定義を削除する)。
  // 日本語スラッグはクローラーからは percent-encoded で届くため、sourceはエンコード済みで書く。
  output: "export",
};

// NEXT_PUBLIC_SITE_URL未設定時、components/Layout.jsはcanonical/OGPタグを
// 丸ごと出力しないフェイルセーフ設計になっている(安全側だが検知されにくい)。
// ビルド時点で気づけるよう、`next build`(本番ビルド)では未設定をエラーにし、
// `next dev`では警告のみに留める。
module.exports = (phase) => {
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    const message =
      "[next.config.js] NEXT_PUBLIC_SITE_URL が未設定です。canonical/OGP(components/Layout.js)が出力されなくなります。";
    if (phase === PHASE_PRODUCTION_BUILD) {
      throw new Error(message);
    }
    console.warn(message);
  }
  return nextConfig;
};
