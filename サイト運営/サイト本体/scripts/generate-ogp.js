#!/usr/bin/env node
/**
 * SNSシェア用のOGP画像(public/images/ogp.png、1200x630)を生成する。
 *
 *   node scripts/generate-ogp.js
 *
 * 日本語テキストを含むため画像生成AIでは作れない(文字が崩れる)。
 * HTMLをChromium(playwright-core)で1200x630のまま描画してスクリーンショットする方式にし、
 * サイト本体と同じブランド色・書体・マスコットを使う。
 *
 * サイト名・キャッチコピーを変えたときは、下のTEXTを書き換えて再実行すること。
 * 出力先はcomponents/Layout.jsのDEFAULT_OG_IMAGEと一致させる。
 */
const path = require("path");
const fs = require("fs");
const playwright = require("playwright-core");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const OUT_PATH = path.join(PUBLIC_DIR, "images", "ogp.png");
const MASCOT_DIR = path.join(PUBLIC_DIR, "images", "mascot");

const WIDTH = 1200;
const HEIGHT = 630;

const TEXT = {
  eyebrow: "WEB MAGAZINE",
  title: "AI活用の総合ガイド",
  brand: "NEVORA",
  tagline: "ChatGPT・画像生成AI・業務効率化の情報",
};

// 右側に並べるマスコット(中央=サイト全体のネヴォミン、左右=カテゴリ担当)
const MASCOTS = ["kiramin-normal.svg", "nevomin-normal.svg", "tsuyamin-normal.svg"];

function svgDataUri(filename) {
  const svg = fs.readFileSync(path.join(MASCOT_DIR, filename), "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

function buildHtml() {
  const [left, center, right] = MASCOTS.map(svgDataUri);
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    /* サイト本体と同じ書体スタック。Google Fonts無しでも崩れないよう、
       Windowsに標準搭載の游ゴシック/游明朝へフォールバックさせる。 */
    font-family: "Zen Kaku Gothic New", "Yu Gothic", "Meiryo", sans-serif;
    color: #24242b;
    background:
      radial-gradient(620px 520px at 88% 50%, #ffffff 0%, rgba(255,255,255,0) 70%),
      linear-gradient(118deg, #fff5f8 0%, #fdf3f7 45%, #f2f0fb 100%);
  }
  .wrap { display: flex; width: 100%; height: 100%; align-items: center; }
  .copy { flex: 0 0 700px; padding-left: 84px; }
  .eyebrow {
    font-size: 24px; font-weight: 700; letter-spacing: 0.34em;
    /* 淡いピンク背景の上でもコントラスト6:1以上を確保するため、
       ブランド色そのもの(#d6336c、約4.9:1)ではなくprimary-darkを使う。 */
    color: #b32657; margin-bottom: 26px;
  }
  .title {
    font-family: "Shippori Mincho", "Yu Mincho", "YuMincho", serif;
    font-size: 56px; font-weight: 700; letter-spacing: 0.03em; line-height: 1.2;
    white-space: nowrap;
  }
  .brand {
    font-size: 100px; font-weight: 800; letter-spacing: 0.09em;
    line-height: 1.1; margin: 6px 0 22px;
  }
  .rule { width: 470px; height: 3px; background: linear-gradient(90deg, #d6336c 0%, #e9a2bd 100%); }
  .tagline { margin-top: 22px; font-size: 26px; letter-spacing: 0.06em; color: #52525f; }
  .art { flex: 1; position: relative; height: 100%; }
  .ring {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 430px; height: 430px; border-radius: 50%;
    background: radial-gradient(circle at 50% 45%, #ffffff 0%, #fdeef4 62%, #f6ecfa 100%);
    box-shadow: 0 18px 48px rgba(214, 51, 108, 0.12);
  }
  .mascots {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -46%);
    display: flex; align-items: flex-end; gap: 18px;
  }
  .mascots img { display: block; }
  .m-side { width: 116px; }
  .m-main { width: 186px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="copy">
      <p class="eyebrow">${TEXT.eyebrow}</p>
      <p class="title">${TEXT.title}</p>
      <p class="brand">${TEXT.brand}</p>
      <div class="rule"></div>
      <p class="tagline">${TEXT.tagline}</p>
    </div>
    <div class="art">
      <div class="ring"></div>
      <div class="mascots">
        <img class="m-side" src="${left}" alt="">
        <img class="m-main" src="${center}" alt="">
        <img class="m-side" src="${right}" alt="">
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  const browser = await playwright.chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    await page.setContent(buildHtml(), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    await page.screenshot({ path: OUT_PATH, type: "png" });
  } finally {
    await browser.close();
  }
  const kb = fs.statSync(OUT_PATH).size / 1024;
  console.log(`${path.relative(PUBLIC_DIR, OUT_PATH).replace(/\\/g, "/")}: ${WIDTH}x${HEIGHT} / ${kb.toFixed(1)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
