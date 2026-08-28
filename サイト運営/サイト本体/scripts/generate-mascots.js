#!/usr/bin/env node
/**
 * NEVORA AIのマスコットSVG(メイン1体 + カテゴリ担当12体)× 3ポーズを生成する。
 *
 *   node scripts/generate-mascots.js          … 全39ファイルを生成
 *   node scripts/generate-mascots.js aimin    … keyの前方一致で絞り込み
 *
 * 造形の仕様は docs/mascot-prompts.md(吹き出し+四芒星、#1e5fa8系配色)に準拠する。
 * 全キャラで体・顔・手足のジオメトリを共有し、輪郭色/塗り色/持ち物だけを差し替えることで、
 * 12体を並べても同じシリーズに見えるようにしている。
 *
 * 出力: public/images/mascot/<key>-<pose>.svg
 *   pose = normal(挨拶) / research(補足) / matome(まとめ)
 *   → lib/categoryMascot.js の normalImage / researchImage / matomeImage と対応する
 */
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.join(__dirname, "..", "public", "images", "mascot");

// ---------------------------------------------------------------------------
// キャラクター定義。color=輪郭線、soft=体の塗り、blush=ほおの赤み、motif=持ち物
// 色は lib/categoryMeta.js のカテゴリ色に合わせている(メインはブランド色)。
// ---------------------------------------------------------------------------
const CHARACTERS = [
  { key: "aimin", name: "アイミンちゃん", color: "#1e5fa8", soft: "#f4f8fc", blush: "#8fb8dd", motif: null },
  { key: "chamin", name: "チャミンちゃん", color: "#1c7ed6", soft: "#dff0ff", blush: "#8ec5f0", motif: "bubbles" },
  { key: "egamin", name: "エガミンちゃん", color: "#ae3ec9", soft: "#f5e3fb", blush: "#d69ce6", motif: "palette" },
  { key: "mubimin", name: "ムビミンちゃん", color: "#e8590c", soft: "#ffe8d9", blush: "#f4a97a", motif: "play" },
  { key: "kakimin", name: "カキミンちゃん", color: "#0ca678", soft: "#dff7ee", blush: "#7fd3b8", motif: "quill" },
  { key: "codemin", name: "コードミンちゃん", color: "#3b5bdb", soft: "#e3e8fd", blush: "#9aabee", motif: "brackets" },
  { key: "jidomin", name: "ジドウミンちゃん", color: "#495057", soft: "#eef0f2", blush: "#a4abb2", motif: "gears" },
  { key: "kasegimin", name: "カセギミンちゃん", color: "#f08c00", soft: "#fff3d6", blush: "#f7c473", motif: "growth" },
  { key: "kurabemin", name: "クラベミンちゃん", color: "#d6336c", soft: "#ffe3ec", blush: "#ef94b3", motif: "scale" },
  { key: "manamin", name: "マナミンちゃん", color: "#5f3dc4", soft: "#ece6fb", blush: "#a794e3", motif: "book" },
  { key: "bizmin", name: "ビズミンちゃん", color: "#c2255c", soft: "#fde3ee", blush: "#e28aac", motif: "clipboard" },
  { key: "kurashimin", name: "クラシミンちゃん", color: "#2f9e44", soft: "#e6f7ea", blush: "#8fcd9c", motif: "mug" },
  { key: "newsmin", name: "ニューミンちゃん", color: "#f59f00", soft: "#fff6da", blush: "#f7cd72", motif: "news" },
];

const POSES = {
  normal: "",
  research: "(リサーチポーズ)",
  matome: "(まとめポーズ)",
};

// ---------------------------------------------------------------------------
// 共通パーツ。240x240のviewBoxで、既存マスコット(しずく型)と同じ線の太さ・
// 顔まわりの寸法感に合わせてある。
// ---------------------------------------------------------------------------
const STROKE = 6;

// 体: 角丸の吹き出し。左下にしっぽが出る。
const BODY_PATH = [
  "M91 42",
  "H149",
  "A46 46 0 0 1 195 88",
  "V132",
  "A46 46 0 0 1 149 178",
  "H118",
  "L76 204",
  "L88 178",
  "H91",
  "A46 46 0 0 1 45 132",
  "V88",
  "A46 46 0 0 1 91 42",
  "Z",
].join(" ");

function shadow(c) {
  return `<ellipse cx="120" cy="216" rx="54" ry="9" fill="${c.color}" opacity="0.08"/>`;
}

function body(c) {
  return `<path d="${BODY_PATH}" fill="${c.soft}" stroke="${c.color}" stroke-width="${STROKE}" stroke-linejoin="round"/>`;
}

// 四芒星(ひらめき)。体の右上に浮かせる。
function star(c, cx, cy, r) {
  const inner = r * 0.32;
  const p = [
    `M${cx} ${cy - r}`,
    `L${cx + inner} ${cy - inner}`,
    `L${cx + r} ${cy}`,
    `L${cx + inner} ${cy + inner}`,
    `L${cx} ${cy + r}`,
    `L${cx - inner} ${cy + inner}`,
    `L${cx - r} ${cy}`,
    `L${cx - inner} ${cy - inner}`,
    "Z",
  ].join(" ");
  return `<path d="${p}" fill="${c.color}"/>`;
}

function sparkles(c) {
  return `${star(c, 196, 40, 15)}${star(c, 214, 66, 8)}`;
}

function blush(c) {
  return (
    `<circle cx="88" cy="128" r="10" fill="${c.blush}" opacity="0.55"/>` +
    `<circle cx="152" cy="128" r="10" fill="${c.blush}" opacity="0.55"/>`
  );
}

// 目。open=丸い点、arch=「^ ^」(考えている)、happy=にっこり閉じた目
function eyes(c, type) {
  if (type === "arch") {
    return (
      `<path d="M92 108 Q100 99 108 108" stroke="#24242b" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M132 108 Q140 99 148 108" stroke="#24242b" stroke-width="5" fill="none" stroke-linecap="round"/>`
    );
  }
  if (type === "happy") {
    return (
      `<path d="M92 110 Q100 100 108 110" stroke="#24242b" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M132 110 Q140 100 148 110" stroke="#24242b" stroke-width="5" fill="none" stroke-linecap="round"/>`
    );
  }
  return (
    `<circle cx="100" cy="108" r="7" fill="#24242b"/>` +
    `<circle cx="140" cy="108" r="7" fill="#24242b"/>` +
    `<circle cx="102.5" cy="105" r="2.2" fill="#fff"/>` +
    `<circle cx="142.5" cy="105" r="2.2" fill="#fff"/>`
  );
}

// 口。smile=やさしい笑み、flat=少し真剣、wide=満足そうな笑顔
function mouth(c, type) {
  if (type === "flat") {
    return `<path d="M112 132 H128" stroke="${c.color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  if (type === "wide") {
    return `<path d="M106 128 Q120 144 134 128" stroke="${c.color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  return `<path d="M108 130 Q120 141 132 130" stroke="${c.color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
}

// 足。しっぽ(左下)と重ならないよう右寄りに置く。
function legs(c) {
  return (
    `<path d="M134 176 v18" stroke="${c.color}" stroke-width="${STROKE}" stroke-linecap="round"/>` +
    `<path d="M160 176 v18" stroke="${c.color}" stroke-width="${STROKE}" stroke-linecap="round"/>`
  );
}

// 腕。left/right それぞれ down(垂らす)/up(上げる)
function arms(c, left, right) {
  const l =
    left === "up"
      ? `<path d="M48 146 q-22 -4 -27 -28" stroke="${c.color}" stroke-width="${STROKE}" fill="none" stroke-linecap="round"/>`
      : `<path d="M48 148 q-20 6 -24 22" stroke="${c.color}" stroke-width="${STROKE}" fill="none" stroke-linecap="round"/>`;
  const r =
    right === "up"
      ? `<path d="M192 146 q22 -4 27 -28" stroke="${c.color}" stroke-width="${STROKE}" fill="none" stroke-linecap="round"/>`
      : `<path d="M192 148 q20 6 24 22" stroke="${c.color}" stroke-width="${STROKE}" fill="none" stroke-linecap="round"/>`;
  return l + r;
}

// ---------------------------------------------------------------------------
// 持ち物。いずれも 0,0 起点・約40x40の座標系で描き、translate/scaleで配置する。
// 輪郭は輪郭線と同じ色、塗りは体と同じ淡色に統一する。
// ---------------------------------------------------------------------------
const MOTIFS = {
  magnifier: (c) =>
    `<circle cx="16" cy="16" r="13" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>` +
    `<path d="M26 26 L38 38" stroke="${c.color}" stroke-width="5" stroke-linecap="round"/>`,
  notebook: (c) =>
    `<rect x="4" y="6" width="32" height="28" rx="4" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>` +
    `<path d="M12 15 H28 M12 21 H28 M12 27 H22" stroke="${c.color}" stroke-width="3" stroke-linecap="round"/>`,
  bubbles: (c) =>
    `<rect x="2" y="6" width="24" height="18" rx="6" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>` +
    `<path d="M9 24 L7 32 L16 24" fill="${c.soft}" stroke="${c.color}" stroke-width="4" stroke-linejoin="round"/>` +
    `<rect x="20" y="18" width="18" height="14" rx="5" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>`,
  palette: (c) =>
    `<path d="M20 4 C31 4 38 12 38 20 C38 26 33 28 29 28 C26 28 24 30 24 33 C24 36 22 37 19 37 C10 37 3 30 3 20 C3 11 10 4 20 4 Z" fill="${c.soft}" stroke="${c.color}" stroke-width="4" stroke-linejoin="round"/>` +
    `<circle cx="13" cy="14" r="3.2" fill="${c.color}"/>` +
    `<circle cx="24" cy="12" r="3.2" fill="${c.color}"/>` +
    `<circle cx="31" cy="20" r="3.2" fill="${c.color}"/>`,
  play: (c) =>
    `<rect x="3" y="6" width="34" height="26" rx="6" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>` +
    `<path d="M16 13 L27 19 L16 25 Z" fill="${c.color}"/>`,
  quill: (c) =>
    `<path d="M34 5 C22 8 12 18 8 31 L14 33 C20 22 27 14 34 5 Z" fill="${c.soft}" stroke="${c.color}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M8 31 L3 37" stroke="${c.color}" stroke-width="4" stroke-linecap="round"/>`,
  brackets: (c) =>
    `<rect x="2" y="6" width="36" height="28" rx="6" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>` +
    `<path d="M15 14 L9 20 L15 26 M25 14 L31 20 L25 26" stroke="${c.color}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  gears: (c) =>
    `<circle cx="15" cy="16" r="10" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>` +
    `<circle cx="15" cy="16" r="3" fill="${c.color}"/>` +
    `<path d="M15 2 V6 M15 26 V30 M1 16 H5 M25 16 H29" stroke="${c.color}" stroke-width="3.5" stroke-linecap="round"/>` +
    `<circle cx="30" cy="29" r="7" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>`,
  growth: (c) =>
    `<path d="M4 32 L15 21 L22 27 L36 11" fill="none" stroke="${c.color}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M27 10 H37 V20" fill="none" stroke="${c.color}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="10" cy="10" r="6" fill="${c.soft}" stroke="${c.color}" stroke-width="3.5"/>`,
  scale: (c) =>
    `<path d="M20 5 V33 M6 12 H34" stroke="${c.color}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M1 12 L6 22 H-4 Z" transform="translate(6 0)" fill="${c.soft}" stroke="${c.color}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="M29 12 L34 22 H24 Z" fill="${c.soft}" stroke="${c.color}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="M12 33 H28" stroke="${c.color}" stroke-width="4" stroke-linecap="round"/>`,
  book: (c) =>
    `<path d="M20 10 C15 6 8 5 3 6 V31 C8 30 15 31 20 34 C25 31 32 30 37 31 V6 C32 5 25 6 20 10 Z" fill="${c.soft}" stroke="${c.color}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M20 10 V34" stroke="${c.color}" stroke-width="3.5"/>`,
  clipboard: (c) =>
    `<rect x="6" y="6" width="28" height="30" rx="4" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>` +
    `<rect x="14" y="1" width="12" height="8" rx="3" fill="${c.soft}" stroke="${c.color}" stroke-width="3.5"/>` +
    `<path d="M13 18 H27 M13 25 H23" stroke="${c.color}" stroke-width="3" stroke-linecap="round"/>`,
  mug: (c) =>
    `<path d="M6 10 H28 V26 A8 8 0 0 1 20 34 H14 A8 8 0 0 1 6 26 Z" fill="${c.soft}" stroke="${c.color}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M28 15 H33 A5 5 0 0 1 33 25 H28" fill="none" stroke="${c.color}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M13 4 Q16 1 13 -2 M21 4 Q24 1 21 -2" stroke="${c.color}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  news: (c) =>
    `<rect x="3" y="8" width="30" height="26" rx="3" fill="${c.soft}" stroke="${c.color}" stroke-width="4"/>` +
    `<path d="M33 14 H38 V30 A4 4 0 0 1 33 34" fill="${c.soft}" stroke="${c.color}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="M9 16 H27 M9 22 H27 M9 28 H20" stroke="${c.color}" stroke-width="3" stroke-linecap="round"/>`,
};

// 持ち物を右手のあたりに置く。scaleは40pxの座標系を実寸に落とす倍率。
function held(c, motif, { x = 194, y = 126, scale = 0.95 } = {}) {
  if (!motif || !MOTIFS[motif]) return "";
  return `<g transform="translate(${x} ${y}) scale(${scale})">${MOTIFS[motif](c)}</g>`;
}

// ---------------------------------------------------------------------------
// ポーズ組み立て
// ---------------------------------------------------------------------------
function buildSvg(c, pose) {
  const label = `マスコットキャラクター ${c.name}${POSES[pose]}`;
  let parts = [shadow(c), body(c), sparkles(c), blush(c)];

  if (pose === "normal") {
    // 挨拶。メインは右手を上げて手を振り、カテゴリ担当は持ち物を掲げる。
    parts.push(eyes(c, "open"), mouth(c, "smile"), legs(c));
    parts.push(arms(c, "down", c.motif ? "down" : "up"));
    if (c.motif) parts.push(held(c, c.motif));
  } else if (pose === "research") {
    // 補足。虫めがねを持って調べている。
    parts.push(eyes(c, "arch"), mouth(c, "flat"), legs(c));
    parts.push(arms(c, "down", "down"));
    parts.push(held(c, "magnifier"));
  } else {
    // まとめ。両手を広げ、箇条書きのノートを見せる。
    parts.push(eyes(c, "happy"), mouth(c, "wide"), legs(c));
    parts.push(arms(c, "up", "up"));
    parts.push(held(c, "notebook"));
  }

  return `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
  ${parts.join("\n  ")}
</svg>
`;
}

// ファビコン/ロゴマーク用。体としっぽ・顔だけの切り出し。
// 手足・浮いた星・影を持たないため、16pxまで縮めても形が潰れない。
function buildFaceSvg(c) {
  const label = `マスコットキャラクター ${c.name}(顔アップ)`;
  const parts = [
    body(c),
    blush(c),
    eyes(c, "open"),
    mouth(c, "smile"),
  ];
  return `<svg viewBox="38 35 164 178" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
  ${parts.join("\n  ")}
</svg>
`;
}

function main() {
  const filters = process.argv.slice(2);
  const targets = filters.length
    ? CHARACTERS.filter((c) => filters.some((f) => c.key.startsWith(f)))
    : CHARACTERS;
  if (!targets.length) {
    console.error(`該当するキャラクターがありません: ${filters.join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  let count = 0;
  for (const c of targets) {
    for (const pose of Object.keys(POSES)) {
      const file = path.join(OUT_DIR, `${c.key}-${pose}.svg`);
      fs.writeFileSync(file, buildSvg(c, pose), "utf8");
      count++;
    }
    if (c.key === "aimin") {
      fs.writeFileSync(path.join(OUT_DIR, `${c.key}-face.svg`), buildFaceSvg(c), "utf8");
      count++;
    }
    console.log(`  ${c.key.padEnd(12)} ${c.name.padEnd(14)} ${c.color}  3ポーズ`);
  }
  console.log(`\n合計 ${count}ファイル → ${path.relative(process.cwd(), OUT_DIR)}`);
}

main();
