const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 完全静的エクスポート(out/ に静的ファイルだけを出力し、サーバー実行の Function を使わない)。
  // redirects()・headers()・middleware は静的エクスポートでは使えない。
  // 記事を非公開にして旧URLを統合先へ転送したいときは、サイト本体に vercel.json を置き、
  // redirects に定義する(日本語スラッグは percent-encoded の source と日本語のままの source の両方を書く)。
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
