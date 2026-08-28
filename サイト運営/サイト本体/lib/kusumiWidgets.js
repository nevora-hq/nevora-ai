// 記事「【くすみタイプ別】乾燥性・血行不良性・角質肥厚性、原因に合う化粧水・美容液比較」
// (content/articles/2026-07-26_くすみケア比較.md)専用のレンダリング処理をまとめたファイル。
// lib/posts.js の renderChartHtml から chart.type に応じて呼び出される追加分岐と、
// この記事のslugのときだけ実行するセクション分割・独自目次の処理を提供する。
// 他記事の描画・既存chartタイプ(bar/stat/donut/prosCons/quadrant/lineChart等)の
// 挙動には一切影響しない(lipCompareExtras.js / hairTypeWidgets.js と同じ設計方針)。
// クライアント側JS不要(静的HTML/SVG文字列)。

import { pickHeadingEmoji } from "./tocEmoji";

export const KUSUMI_SLUG = "2026-07-26_くすみケア比較";

// テーマカラー: モーブ#A78BAF / シャンパンピンク#F0DCE0 / チャコール#3E3A42
const THEME = {
  mauve: "#A78BAF",
  mauveDark: "#7C5D89",
  champagne: "#F0DCE0",
  charcoal: "#3E3A42",
};

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// SVGのtext要素は自動折返しできないため、短い2行に手動で分割する簡易ヘルパー。
function wrapForSvg(text, maxLen) {
  const str = String(text || "");
  if (str.length <= maxLen) return [str, ""];
  const mid = str.slice(0, maxLen).lastIndexOf(" ");
  const cut = mid > 3 ? mid : maxLen;
  return [str.slice(0, cut).trim(), str.slice(cut).trim()];
}

// ① 頬クローズアップ3面図: 乾燥性(白っぽくカサつく)/血行不良性(青紫〜茶色っぽい)/
// 角質肥厚性(黄色っぽくゴワつく)を色味の違いで描き分ける。色だけに頼らないよう、
// タイプ名ラベルと質感を表すテクスチャ(点・ハッチング)も併記する。
export function renderKusumiFacesHtml() {
  const title = "くすみタイプ別 頬クローズアップの見え方";
  const items = [
    {
      x: 15,
      base: "#F6E9DE",
      overlay: `<g opacity="0.55"><circle cx="55" cy="70" r="3" fill="#EADFD2" /><circle cx="70" cy="60" r="2.4" fill="#EADFD2" /><circle cx="42" cy="58" r="2" fill="#EADFD2" /><circle cx="60" cy="88" r="2.6" fill="#EADFD2" /></g>`,
      label: "乾燥性",
      sub: "白っぽくカサつき",
      sub2: "キメが粗く見える",
    },
    {
      x: 158,
      base: "#DCCBE0",
      overlay: `<path d="M138 96 q37 10 74 0" stroke="#8E6B93" stroke-width="6" fill="none" opacity="0.35" stroke-linecap="round" />`,
      label: "血行不良性",
      sub: "青紫〜茶色っぽく",
      sub2: "目の下が沈んで見える",
    },
    {
      x: 301,
      base: "#EDE0B8",
      overlay: `<g opacity="0.5" stroke="#B49B4B" stroke-width="2"><path d="M266 60 l10 10 M280 55 l10 10 M294 62 l10 10 M272 78 l10 10 M288 82 l10 10" /></g>`,
      label: "角質肥厚性",
      sub: "黄色っぽくゴワつき",
      sub2: "触るとザラつく",
    },
  ];

  const groups = items
    .map(
      (it) => `<g>
        <ellipse cx="${it.x + 55}" cy="72" rx="34" ry="40" fill="${it.base}" stroke="#8B6F52" stroke-width="2" />
        ${it.overlay}
        <circle cx="${it.x + 40}" cy="62" r="2.5" fill="#5C4A42" />
        <circle cx="${it.x + 70}" cy="62" r="2.5" fill="#5C4A42" />
        <text x="${it.x + 55}" y="150" text-anchor="middle" class="kusumi-face-label">${escapeHtmlText(
          it.label
        )}</text>
        <text x="${it.x + 55}" y="166" text-anchor="middle" class="kusumi-face-sub">${escapeHtmlText(it.sub)}</text>
        <text x="${it.x + 55}" y="185" text-anchor="middle" class="kusumi-face-sub">${escapeHtmlText(it.sub2)}</text>
      </g>`
    )
    .join("");

  return `<figure class="article-chart kusumi-faces">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 420 205" class="kusumi-faces-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 乾燥性は白っぽくカサついてキメが粗く見え、血行不良性は青紫〜茶色っぽく目の下が沈んで見え、角質肥厚性は黄色っぽくゴワついて触るとザラつく">
      <title>くすみタイプ別の頬の色味・質感の違い</title>
      <rect x="0" y="0" width="420" height="205" rx="10" fill="#FBF7F5" />
      ${groups}
      <line x1="141" y1="24" x2="141" y2="198" stroke="#E8DCE2" stroke-width="1.5" stroke-dasharray="3 5" />
      <line x1="284" y1="24" x2="284" y2="198" stroke="#E8DCE2" stroke-width="1.5" stroke-dasharray="3 5" />
    </svg>
    <p class="kusumi-diagram-caption">色味だけでなく、質感(カサつき・沈み・ザラつき)も一緒に確認すると見分けやすくなります。</p>
  </figure>`;
}

// ② 診断フローチャート: 入浴後に明るくなる?/午後に濃くなる?/肌がゴワつく?の
// 3問で3タイプへ分岐する図解。本文の「あなたのくすみタイプ診断」チェックリストを図解化。
export function renderKusumiDiagnosisFlowHtml() {
  const title = "3つの質問でわかる くすみタイプ診断フロー";
  const questions = [
    { q: "Q1. 入浴後は肌が明るくなる?", a: "はい → 乾燥性タイプへ" },
    { q: "Q2. 午後〜夕方に顔色が濃くなる?", a: "はい → 血行不良性タイプへ" },
    { q: "Q3. 触ると肌がゴワつく?", a: "はい → 角質肥厚性タイプへ" },
  ];

  const boxes = questions
    .map((item, i) => {
      const y = 20 + i * 62;
      return `<g>
        <rect x="16" y="${y}" width="328" height="44" rx="10" fill="#FFFFFF" stroke="${THEME.mauve}" stroke-width="2" />
        <text x="30" y="${y + 18}" class="kusumi-flow-q">${escapeHtmlText(item.q)}</text>
        <text x="30" y="${y + 36}" class="kusumi-flow-a">${escapeHtmlText(item.a)}</text>
        ${
          i < questions.length - 1
            ? `<line x1="180" y1="${y + 44}" x2="180" y2="${
                y + 62
              }" stroke="${THEME.mauve}" stroke-width="2" marker-end="url(#kusumiFlowArrow)" />`
            : ""
        }
      </g>`;
    })
    .join("");

  const tableRows = questions
    .map((item) => `<tr><td>${escapeHtmlText(item.q)}</td><td>${escapeHtmlText(item.a)}</td></tr>`)
    .join("");

  return `<figure class="article-chart kusumi-flow">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 360 210" class="kusumi-flow-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 入浴後に明るくなる、午後に濃くなる、肌がゴワつくの3問に順に答えてタイプを判定する図">
      <title>くすみタイプ診断フローチャート(3問)</title>
      <defs>
        <marker id="kusumiFlowArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="${THEME.mauve}" />
        </marker>
      </defs>
      <rect x="0" y="0" width="360" height="210" rx="10" fill="${THEME.champagne}" />
      ${boxes}
    </svg>
    <details class="chart-table-toggle">
      <summary>診断内容を文章で見る</summary>
      <table class="chart-table">
        <thead><tr><th>質問</th><th>あてはまる場合のタイプ</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </details>
  </figure>`;
}

// ③ マトリクス表: 成分×タイプ(◎○△×)。色だけに頼らず記号を併用する。
export function renderKusumiMatrixHtml(chart) {
  const { title, rows } = chart || {};
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const MARK_LABEL = {
    "◎": "非常に向いている",
    "○": "向いている",
    "△": "場合による",
    "×": "向いていない",
  };

  const bodyRows = rows
    .map((r) => {
      const cells = ["dry", "blood", "keratin"]
        .map((k) => {
          const mark = r[k] || "-";
          const cls =
            mark === "◎" ? "mark-good" : mark === "○" ? "mark-ok" : mark === "△" ? "mark-mid" : "mark-bad";
          return `<td class="kusumi-matrix-mark ${cls}"><span aria-hidden="true">${escapeHtmlText(
            mark
          )}</span><span class="sr-only">${escapeHtmlText(MARK_LABEL[mark] || mark)}</span></td>`;
        })
        .join("");
      return `<tr><th scope="row">${escapeHtmlText(r.name)}</th>${cells}</tr>`;
    })
    .join("");

  return `<figure class="article-chart kusumi-matrix-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "成分×タイプ対応表")}</figcaption>
    <p class="kusumi-scroll-hint">→ 横にスクロールできます</p>
    <div class="kusumi-scroll-wrap">
      <table class="kusumi-matrix-table">
        <thead><tr><th scope="col">成分</th><th scope="col">乾燥性</th><th scope="col">血行不良性</th><th scope="col">角質肥厚性</th></tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
    <p class="kusumi-diagram-caption">◎非常に向いている ○向いている △場合による ×向いていない</p>
  </figure>`;
}

// ⑤ 商品比較表: 化粧水・美容液6点(横スクロール)。
export function renderKusumiProductTableHtml(chart) {
  const { title, rows } = chart || {};
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const bodyRows = rows
    .map(
      (r) =>
        `<tr><td class="kusumi-product-name-cell">${escapeHtmlText(r.name)}</td><td>${escapeHtmlText(
          r.type
        )}</td><td>${escapeHtmlText(r.ingredient)}</td><td>${escapeHtmlText(r.texture)}</td><td>${escapeHtmlText(
          r.timing
        )}</td><td>${escapeHtmlText(r.price)}</td></tr>`
    )
    .join("");

  return `<figure class="article-chart kusumi-product-table-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "商品比較表")}</figcaption>
    <p class="kusumi-scroll-hint">→ 横にスクロールできます</p>
    <div class="kusumi-scroll-wrap">
      <table class="kusumi-product-table">
        <thead><tr><th>商品名(傾向例)</th><th>対応タイプ</th><th>主成分</th><th>テクスチャー</th><th>使用タイミング</th><th>価格帯目安</th></tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  </figure>`;
}

// ✅ 今日からできるチェックリスト(frontmatterのcharts[].itemsから生成)。
export function renderKusumiChecklistHtml(chart) {
  const { title = "今日からできるチェックリスト", items } = chart || {};
  const list = (Array.isArray(items) ? items : [])
    .map((item) => `<li>${escapeHtmlText(item)}</li>`)
    .join("");

  return `<div class="kusumi-checklist">
    <p class="kusumi-checklist-title">✅ ${escapeHtmlText(title)}</p>
    <ul>${list}</ul>
  </div>`;
}

// 記事末の「まとめカード」(結論3行+次の一歩+関連記事リンク)。
export function renderKusumiSummaryCardHtml(chart) {
  const { conclusion, nextStep, links } = chart || {};
  const conclusionItems = (Array.isArray(conclusion) ? conclusion : [])
    .map((c) => `<li>${escapeHtmlText(c)}</li>`)
    .join("");
  const linkItems = (Array.isArray(links) ? links : [])
    .map((l) => `<li><a href="${escapeHtmlText(l.url)}">${escapeHtmlText(l.label)}</a></li>`)
    .join("");

  return `<div class="kusumi-summary-card">
    <h3>結論はこの3つ</h3>
    <ul>${conclusionItems}</ul>
    ${nextStep ? `<h3>今日の次の一歩</h3><p>${escapeHtmlText(nextStep)}</p>` : ""}
    ${linkItems ? `<h3>あわせて読みたい記事</h3><ul>${linkItems}</ul>` : ""}
  </div>`;
}

function stripTags(text) {
  return String(text || "").replace(/<[^>]+>/g, "").trim();
}

const TOC_EMOJI_BY_KEYWORD = [
  [/診断|チェック/, "🔍"],
  [/5割|悩み|多い/, "📊"],
  [/原因|タイプ/, "🎨"],
  [/選び方|基準/, "🧭"],
  [/実際に比較|アプローチ/, "🧴"],
  [/成分|処方|注意点/, "⚗️"],
  [/対策|以外/, "🛁"],
  [/よくある質問|FAQ/i, "❓"],
  [/まとめ|次に読みたい/, "🎯"],
];

// 目次: <details>で折りたたみ、各項目に絵文字を付けた、この記事専用の目次ブロック。
export function renderKusumiTocHtml(toc) {
  if (!Array.isArray(toc) || toc.length === 0) return "";
  const items = toc
    .filter((item) => item.level === 2)
    .map((item) => {
      const emoji = pickHeadingEmoji(stripTags(item.text), TOC_EMOJI_BY_KEYWORD);
      const emojiSpan = emoji
        ? `<span class="kusumi-toc-emoji" aria-hidden="true">${emoji}</span>`
        : "";
      return `<li class="kusumi-toc-item"><a href="#${item.id}">${emojiSpan}${escapeHtmlText(item.text)}</a></li>`;
    })
    .join("");

  return `<details class="kusumi-toc"><summary>📖 目次(タップで開閉)</summary><ol class="kusumi-toc-list">${items}</ol></details>`;
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。charts/accordions/マスコットの挿入が
// すべて終わったあと、最後に一度だけ実行する。
export function wrapKusumiSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["kusumi-section-plain", "kusumi-section-tint", "kusumi-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part; // 最初のh2より前(独自目次など)はそのまま
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="kusumi-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}
