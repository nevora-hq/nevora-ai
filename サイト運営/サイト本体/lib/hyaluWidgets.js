// 「ヒアルロン酸・コラーゲン・セラミドの違い」記事
// (content/articles/2026-08-02_ヒアルロン酸コラーゲンセラミドの違い.md)専用の
// SVG図解・目次・表スクロール対応ウィジェット(2026-08-07 スマホ可読性リニューアル)。
// NEVORAポイント/注意ボックスはlib/microneedleExtras.jsのrenderTipHtml/renderWarningHtml
// (chart type: tip/warning)を、まとめカード・チェックリスト・冒頭サマリーはlib/maegamiWidgets.js
// のrenderConclusionCardHtml/renderChecklistHtml/renderQuickSummaryCardHtmlをそのまま再利用し
// (色はCSS変数の.hyalu-articleスコープ上書きで対応)、重複実装しない。
// 他記事のchart typeには影響しないよう、type名で分岐する(lib/posts.js参照)。

import { pickHeadingEmoji } from "./tocEmoji";

export const HYALU_SLUG = "2026-08-02_ヒアルロン酸コラーゲンセラミドの違い";

// この記事全体で使う3成分の固有色(DONUT_PALETTEと同系統でCVD安全性を意識)。
// ヒアルロン酸=青、コラーゲン=オレンジ、セラミド=緑で記事全体を統一する。
export const HYALU_COLORS = {
  ha: "#2a78d6",
  col: "#eb6834",
  cer: "#1baf7a",
};

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripTags(text) {
  return String(text || "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// ① 肌の3層構造(角質層・表皮・真皮)に3成分の位置関係を色分けして示す図。
// セラミドは角質層で細胞のすき間を埋める役割、ヒアルロン酸とコラーゲンは
// 真皮にあることを一目で示す(情報を持つ図のためrole="img"+<title>を付与)。
export function renderSkinLayerDiagramHtml() {
  const title = "肌の3層構造と3成分の位置関係";

  let corneocytes = "";
  const brickPositions = [
    [16, 26], [66, 26], [116, 26], [166, 26], [216, 26], [266, 26], [316, 26],
    [40, 44], [90, 44], [140, 44], [190, 44], [240, 44], [290, 44],
  ];
  brickPositions.forEach(([x, y]) => {
    corneocytes += `<rect x="${x}" y="${y}" width="42" height="16" rx="3" fill="#eef6fb" stroke="${HYALU_COLORS.cer}" stroke-width="1.4" stroke-dasharray="2 2" />`;
  });

  return `<figure class="article-chart hyalu-diagram">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 360 240" class="hyalu-diagram-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 角質層はセラミドが細胞のすき間を埋めて水分の蒸発を防ぎ、真皮ではヒアルロン酸が水分を抱え込み、コラーゲンが線維の網目でハリを支えている">
      <title>肌の3層構造と、ヒアルロン酸・コラーゲン・セラミドがそれぞれ働く場所を示した断面図</title>
      <rect x="0" y="0" width="360" height="240" rx="10" fill="#F4FAFD" />

      <text x="12" y="16" class="hyalu-diagram-layer-label">角質層</text>
      ${corneocytes}

      <rect x="8" y="66" width="344" height="34" rx="4" fill="#fdf6ee" stroke="#e6d8c4" stroke-width="1" />
      <text x="12" y="88" class="hyalu-diagram-layer-label">表皮</text>

      <rect x="8" y="104" width="344" height="120" rx="8" fill="#fff" stroke="#dbeaf3" stroke-width="1" />
      <text x="12" y="122" class="hyalu-diagram-layer-label">真皮</text>

      <path d="M20 150 Q 50 130, 80 150 T 140 150 T 200 150 T 260 150 T 320 150" fill="none" stroke="${HYALU_COLORS.col}" stroke-width="4" stroke-linecap="round" />
      <path d="M20 175 Q 50 195, 80 175 T 140 175 T 200 175 T 260 175 T 320 175" fill="none" stroke="${HYALU_COLORS.col}" stroke-width="4" stroke-linecap="round" opacity="0.7" />

      <g fill="${HYALU_COLORS.ha}">
        <circle cx="60" cy="205" r="7" /><circle cx="95" cy="200" r="9" /><circle cx="135" cy="207" r="6" />
        <circle cx="180" cy="200" r="9" /><circle cx="225" cy="206" r="7" /><circle cx="270" cy="199" r="9" />
        <circle cx="310" cy="206" r="6" />
      </g>
    </svg>
    <ul class="hyalu-diagram-legend">
      <li><span class="hyalu-legend-dot" style="background:${HYALU_COLORS.cer}" aria-hidden="true"></span>セラミド(角質層のすき間を埋める)</li>
      <li><span class="hyalu-legend-dot" style="background:${HYALU_COLORS.col}" aria-hidden="true"></span>コラーゲン(真皮の線維でハリを支える)</li>
      <li><span class="hyalu-legend-dot" style="background:${HYALU_COLORS.ha}" aria-hidden="true"></span>ヒアルロン酸(真皮で水分を抱え込む)</li>
    </ul>
    <p class="hyalu-diagram-note">※肌の構造をイメージしやすくするための模式図です。実際の細胞の形・比率を正確に示すものではありません。</p>
  </figure>`;
}

// ④ 3つのたとえをイラスト化(コラーゲン=三重らせんの束/ヒアルロン酸=水を抱えるスポンジ/
// セラミド=レンガをつなぐモルタル)。装飾用途のためaria-hidden、説明はfigcaption/pの
// 可視テキストで担保する。
export function renderMetaphorTrioHtml() {
  const collagenSvg = `<svg viewBox="0 0 120 120" class="hyalu-metaphor-svg" aria-hidden="true">
    <path d="M20 20 C 50 40, 30 60, 60 80 S 90 100, 100 100" fill="none" stroke="${HYALU_COLORS.col}" stroke-width="6" stroke-linecap="round" />
    <path d="M15 35 C 45 55, 25 75, 55 95 S 85 110, 100 108" fill="none" stroke="${HYALU_COLORS.col}" stroke-width="6" stroke-linecap="round" opacity="0.65" />
    <path d="M25 10 C 55 30, 35 50, 65 70 S 95 90, 108 88" fill="none" stroke="${HYALU_COLORS.col}" stroke-width="6" stroke-linecap="round" opacity="0.4" />
  </svg>`;

  const hyaluronicSvg = `<svg viewBox="0 0 120 120" class="hyalu-metaphor-svg" aria-hidden="true">
    <path d="M25 40 C 20 20, 55 12, 65 25 C 85 15, 105 35, 92 55 C 105 70, 90 95, 68 92 C 60 108, 30 105, 28 88 C 10 85, 8 55, 25 40 Z" fill="#eaf3fb" stroke="${HYALU_COLORS.ha}" stroke-width="4" />
    <circle cx="45" cy="50" r="6" fill="${HYALU_COLORS.ha}" />
    <circle cx="70" cy="45" r="5" fill="${HYALU_COLORS.ha}" />
    <circle cx="60" cy="70" r="6" fill="${HYALU_COLORS.ha}" />
    <circle cx="80" cy="68" r="5" fill="${HYALU_COLORS.ha}" />
  </svg>`;

  const ceramideSvg = `<svg viewBox="0 0 120 120" class="hyalu-metaphor-svg" aria-hidden="true">
    <rect x="10" y="20" width="40" height="20" rx="3" fill="#eafaf1" stroke="${HYALU_COLORS.cer}" stroke-width="3" />
    <rect x="55" y="20" width="40" height="20" rx="3" fill="#eafaf1" stroke="${HYALU_COLORS.cer}" stroke-width="3" />
    <rect x="30" y="45" width="40" height="20" rx="3" fill="#eafaf1" stroke="${HYALU_COLORS.cer}" stroke-width="3" />
    <rect x="75" y="45" width="40" height="20" rx="3" fill="#eafaf1" stroke="${HYALU_COLORS.cer}" stroke-width="3" />
    <rect x="10" y="70" width="40" height="20" rx="3" fill="#eafaf1" stroke="${HYALU_COLORS.cer}" stroke-width="3" />
    <rect x="55" y="70" width="40" height="20" rx="3" fill="#eafaf1" stroke="${HYALU_COLORS.cer}" stroke-width="3" />
    <line x1="10" y1="42" x2="115" y2="42" stroke="${HYALU_COLORS.cer}" stroke-width="2" stroke-dasharray="3 3" />
    <line x1="10" y1="67" x2="115" y2="67" stroke="${HYALU_COLORS.cer}" stroke-width="2" stroke-dasharray="3 3" />
  </svg>`;

  return `<figure class="hyalu-metaphor-trio">
    <figcaption class="chart-title">3つのたとえで見る、それぞれの役割</figcaption>
    <div class="hyalu-metaphor-grid">
      <div class="hyalu-metaphor-card hyalu-metaphor-col">
        ${collagenSvg}
        <p class="hyalu-metaphor-name">コラーゲン</p>
        <p class="hyalu-metaphor-desc">三重らせんの束のように絡み合い、肌のハリを支える土台になる</p>
      </div>
      <div class="hyalu-metaphor-card hyalu-metaphor-ha">
        ${hyaluronicSvg}
        <p class="hyalu-metaphor-name">ヒアルロン酸</p>
        <p class="hyalu-metaphor-desc">水を抱えるスポンジのように、たっぷりの水分を抱え込む</p>
      </div>
      <div class="hyalu-metaphor-card hyalu-metaphor-cer">
        ${ceramideSvg}
        <p class="hyalu-metaphor-name">セラミド</p>
        <p class="hyalu-metaphor-desc">レンガをつなぐモルタルのように、細胞のすき間を埋めて水分を守る</p>
      </div>
    </div>
  </figure>`;
}

// (2) 目次: <details>で折りたたみ、各項目に絵文字を付けた、この記事専用の目次ブロック。
// 見出しは固定のためキーワード一致で絵文字を割り当てる(他記事のTOC実装と同じ方式)。
const TOC_EMOJI_BY_KEYWORD = [
  [/違いを1枚/, "🔍"],
  [/ヒアルロン酸/, "💧"],
  [/コラーゲン/, "🕸️"],
  [/セラミド/, "🧱"],
  [/たとえ/, "🎨"],
  [/選べば/, "🧭"],
  [/誤解/, "⚠️"],
  [/成分表示/, "🔎"],
  [/よくある質問/, "❓"],
  [/まとめ/, "📝"],
];

export function renderHyaluTocHtml(toc) {
  if (!Array.isArray(toc) || toc.length === 0) return "";
  const items = toc
    .filter((item) => item.level === 2)
    .map((item) => {
      const emoji = pickHeadingEmoji(stripTags(item.text), TOC_EMOJI_BY_KEYWORD);
      const emojiSpan = emoji
        ? `<span class="hyalu-toc-emoji" aria-hidden="true">${emoji}</span>`
        : "";
      return `<li class="hyalu-toc-item"><a href="#${item.id}">${emojiSpan}${escapeHtmlText(item.text)}</a></li>`;
    })
    .join("");

  return `<details class="hyalu-toc"><summary>📖 目次(タップで開閉)</summary><ol class="hyalu-toc-list">${items}</ol></details>`;
}

// 冒頭「⏱ 30秒でわかる」サマリーカード(lib/maegamiWidgets.jsのrenderQuickSummaryCardHtml)の
// 直後、本文最初のH2見出しの直前に目次を追加する。挿入位置はH2見出しの直前という
// 安全な境界に限定する(insertQuickSummaryCard/insertMascotCommentと同じ方式)。
// サマリーカードは既存の共通処理(lib/posts.jsのinsertQuickSummaryCard)で先に挿入済みの
// 状態でこの関数を呼ぶことで、「サマリーカード→目次→本文」の順序になる。
export function insertHyaluToc(html, tocHtml) {
  if (!tocHtml) return html;
  const headingRe = /<h2[ >]/;
  const match = headingRe.exec(html);
  if (!match) return html;
  const at = match.index;
  return html.slice(0, at) + tocHtml + html.slice(at);
}

// 広い表(比較表・目的別選び方表)がスマホ幅で横スクロールしてしまう問題への対応。
// overflow-x:autoの枠+「→ 横にスクロールできます」の注記でラップする
// (lib/hairTypeWidgets.jsのwrapHairTypeTablesと同じ方式)。
export function wrapHyaluTables(html) {
  return html
    .replace(
      /<table>/g,
      `<div class="table-scroll-wrap"><p class="table-scroll-note">→ 横にスクロールできます</p><table>`
    )
    .replace(/<\/table>/g, `</table></div>`);
}
