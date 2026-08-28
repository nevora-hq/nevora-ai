#!/usr/bin/env node
/**
 * トップページで使う写真素材(ヒーロー/カテゴリカード/セクションバンド)を
 * 元画像(PNG)からWebPに一括変換する。
 *
 *   node scripts/generate-site-images.js            … 全件生成
 *   node scripts/generate-site-images.js hero band  … キー前方一致で絞り込み
 *
 * 元画像はリポジトリ外(デスクトップの画像フォルダ)に置いたまま参照する。
 * 素材を差し替えたときは、下のMANIFESTのsrcを書き換えて再実行すれば
 * 出力側のファイル名・幅構成は保たれる。
 *
 * 出力の考え方:
 *   - responsive: true  … 640/1024/1600wの3枚 + srcset非対応向けの
 *                         フォールバック<name>.webp(=1600w)を出力。
 *                         画面幅いっぱいに敷くヒーロー・バンド用。
 *   - responsive: false … <name>.webp 1枚(既定800w)のみ。
 *                         カード内に収まるカテゴリ画像用(表示幅は最大でも
 *                         約380pxなので、DPR2でも800wで足りる)。
 * どちらも縦横比は元画像のまま出力し、トリミングはCSSのobject-fit/positionに任せる。
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// 元画像(ChatGPTで生成したPNG)の置き場。
// 画像を差し替えたときは、下のMANIFESTのsrcを新しいファイル名に書き換えて再実行する。
const SRC_DIR =
  "c:/Users/kokim/OneDrive/デスクトップ/画像フォルダ/各種サイト/AIサイト/ライブラリ/ホームページ用";
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const RESPONSIVE_WIDTHS = [640, 1024, 1600];
const RESPONSIVE_FALLBACK = 1600;
const CARD_WIDTH = 800;
const QUALITY = 78;

// key: 絞り込み用の識別子 / src: 元画像(SRC_DIR内のファイル名) / out: public配下の出力パス(拡張子なし)
// 元画像はいずれも1536x1024で生成したもの(docs/image-prompts.md のプロンプト1〜15に対応)。
// srcは意味の分かる固定名にしてある。素材を差し替えるときは同じ名前で上書きすれば、
// このファイルを書き換えずに再生成できる。
const MANIFEST = [
  // ---- ヒーロー(プロンプト1) ----
  // 左45%が白壁の余白。そこに白文字の見出しを重ねる
  { key: "hero", src: "home-hero.png", out: "images/hero/home-hero", responsive: true },

  // ---- セクションバンド(プロンプト2・3) ----
  // band-01: 左半分が白壁の余白。「あなたのAIの困りごとから探す」の見出しを重ねる
  { key: "band-01", src: "band-01.png", out: "images/band/band-01", responsive: true },
  // band-02: デスクの静物(テキストは重ねない)
  { key: "band-02", src: "band-02.png", out: "images/band/band-02", responsive: true },

  // ---- カテゴリカード(プロンプト4〜15。表示は4:3でトリミングされる) ----
  { key: "category-chat-ai", src: "category-chat-ai.png", out: "images/category/chat-ai" },
  { key: "category-image-ai", src: "category-image-ai.png", out: "images/category/image-ai" },
  { key: "category-video-audio-ai", src: "category-video-audio-ai.png", out: "images/category/video-audio-ai" },
  { key: "category-writing-ai", src: "category-writing-ai.png", out: "images/category/writing-ai" },
  { key: "category-coding-ai", src: "category-coding-ai.png", out: "images/category/coding-ai" },
  { key: "category-automation", src: "category-automation.png", out: "images/category/automation" },
  { key: "category-side-job", src: "category-side-job.png", out: "images/category/side-job" },
  { key: "category-tool-compare", src: "category-tool-compare.png", out: "images/category/tool-compare" },
  { key: "category-ai-basics", src: "category-ai-basics.png", out: "images/category/ai-basics" },
  { key: "category-business", src: "category-business.png", out: "images/category/business" },
  { key: "category-life-learning", src: "category-life-learning.png", out: "images/category/life-learning" },
  { key: "category-news-trend", src: "category-news-trend.png", out: "images/category/news-trend" },
];

async function emit(srcPath, outBase, width, suffix) {
  const outPath = suffix ? `${outBase}-${suffix}.webp` : `${outBase}.webp`;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);
  return outPath;
}

async function main() {
  const filters = process.argv.slice(2);
  const targets = filters.length
    ? MANIFEST.filter((m) => filters.some((f) => m.key.startsWith(f)))
    : MANIFEST;

  if (targets.length === 0) {
    console.error(`該当する素材がありません: ${filters.join(", ")}`);
    process.exit(1);
  }

  let total = 0;
  for (const item of targets) {
    const srcPath = path.join(SRC_DIR, item.src);
    if (!fs.existsSync(srcPath)) {
      console.error(`  [NG] 元画像が見つかりません: ${srcPath}`);
      process.exitCode = 1;
      continue;
    }
    const meta = await sharp(srcPath).metadata();
    const outBase = path.join(PUBLIC_DIR, item.out);

    const written = [];
    if (item.responsive) {
      // 元画像より大きい幅は拡大になるので作らない。最大幅は元画像の幅に丸め、
      // srcsetの最大候補と実ファイルが必ず一致するようにする。
      const maxWidth = Math.min(RESPONSIVE_FALLBACK, meta.width);
      const widths = [...new Set([...RESPONSIVE_WIDTHS.filter((w) => w < maxWidth), maxWidth])];
      for (const w of widths) {
        written.push(await emit(srcPath, outBase, w, String(w)));
      }
      // srcset非対応環境向けのフォールバックは最大幅のコピー
      written.push(await emit(srcPath, outBase, maxWidth, null));
      console.log(`    srcset幅: ${widths.join(", ")}`);
    } else {
      written.push(await emit(srcPath, outBase, CARD_WIDTH, null));
    }

    const kb = written.reduce((sum, p) => sum + fs.statSync(p).size, 0) / 1024;
    total += kb;
    console.log(
      `  ${item.key}: ${meta.width}x${meta.height} → ${written.length}枚 / 計${kb.toFixed(1)} KB`
    );
    console.log(`    ${written.map((p) => path.relative(PUBLIC_DIR, p).replace(/\\/g, "/")).join(", ")}`);
  }
  console.log(`\n合計 ${targets.length}素材 / ${total.toFixed(1)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
