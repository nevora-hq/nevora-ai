#!/usr/bin/env node
/**
 * マスコットのSVGから、サイトのブランド資産一式(ロゴ・ファビコン)を生成する。
 *
 *   node scripts/generate-brand-assets.js
 *
 * 入力(scripts/generate-mascots.js が生成する):
 *   public/images/mascot/aimin-normal.png相当のSVG … 全身。logo.png に使う
 *   public/images/mascot/aimin-face.svg            … 顔+しっぽ。logo-mark・favicon一式に使う
 *
 * 出力(public配下):
 *   images/logo.png        512x512  構造化データのlogo
 *   images/logo-mark.png   128x128  ヘッダー左のマーク
 *   favicon-16/32/48.png, icon-192/512.png, apple-touch-icon.png, favicon.ico
 *
 * **OGP画像(images/ogp.png)はここでは作らない。**
 * OGPの生成は scripts/generate-ogp.js に一本化している(複数スクリプトが同じ
 * ファイルを書くと、実行順によって一方の結果がもう一方に上書きされるため)。
 *
 * マスコットを描き直したときは、generate-mascots.js を実行してから本スクリプトを実行する。
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const MASCOT_DIR = path.join(PUBLIC_DIR, "images", "mascot");
const FULL_SVG = path.join(MASCOT_DIR, "aimin-normal.svg");
const FACE_SVG = path.join(MASCOT_DIR, "aimin-face.svg");

const out = (rel) => {
  const p = path.join(PUBLIC_DIR, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  return p;
};

// SVGを高解像度でラスタライズし、透過の余白を落としてから、
// 指定サイズの正方形に「余白率 pad」で収める。
// trim()を挟むことで、原画ごとの余白量の差に影響されず見た目の大きさが揃う。
async function squareFit(svgPath, size, pad = 0.06, background = { r: 0, g: 0, b: 0, alpha: 0 }) {
  const raster = await sharp(svgPath, { density: 600 })
    .resize({ width: 1200, fit: "inside" })
    .png()
    .toBuffer();
  const trimmed = await sharp(raster).trim().png().toBuffer();
  const inner = Math.round(size * (1 - pad * 2));
  const fitted = await sharp(trimmed)
    .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: fitted, gravity: "centre" }])
    .png()
    .toBuffer();
}

// PNGを内包するICO(Vista以降で標準的な形式)を自前で組み立てる。
// sharpは.icoを書き出せないため、ICONDIR/ICONDIRENTRYを手で作る。
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + count * 16;
  for (const { size, data } of pngBuffers) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.data)]);
}

async function main() {
  for (const f of [FULL_SVG, FACE_SVG]) {
    if (!fs.existsSync(f)) {
      console.error(`  [NG] 元のSVGが見つかりません: ${f}`);
      console.error("      先に node scripts/generate-mascots.js を実行してください。");
      process.exit(1);
    }
  }

  const written = [];

  // ---- ロゴ(全身) ----
  fs.writeFileSync(out("images/logo.png"), await squareFit(FULL_SVG, 512, 0.06));
  written.push("images/logo.png");

  // ---- ヘッダーのマーク・ファビコン(顔アップ。小サイズでも潰れないよう余白は最小) ----
  fs.writeFileSync(out("images/logo-mark.png"), await squareFit(FACE_SVG, 128, 0.02));
  written.push("images/logo-mark.png");

  const icoSizes = [16, 32, 48];
  const icoPngs = [];
  for (const size of [...icoSizes, 192, 512]) {
    const buf = await squareFit(FACE_SVG, size, 0.02);
    const name = size <= 48 ? `favicon-${size}.png` : `icon-${size}.png`;
    fs.writeFileSync(out(name), buf);
    written.push(name);
    if (icoSizes.includes(size)) icoPngs.push({ size, data: buf });
  }
  fs.writeFileSync(out("favicon.ico"), buildIco(icoPngs));
  written.push("favicon.ico");

  // apple-touch-iconは透過を持てない(iOSが黒で埋める)ため白背景で焼き込む。
  fs.writeFileSync(
    out("apple-touch-icon.png"),
    await sharp(await squareFit(FACE_SVG, 180, 0.08))
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer()
  );
  written.push("apple-touch-icon.png");

  let total = 0;
  for (const rel of written) {
    const kb = fs.statSync(path.join(PUBLIC_DIR, rel)).size / 1024;
    total += kb;
    console.log(`  ${rel.padEnd(28)} ${kb.toFixed(1)} KB`);
  }
  console.log(`\n合計 ${written.length}点 / ${total.toFixed(1)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
