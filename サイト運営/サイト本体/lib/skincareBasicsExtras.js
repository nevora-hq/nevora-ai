// 「基礎化粧品とは？化粧水・乳液・美容液の役割と正しい順番、自分の肌質の見分け方」記事
// (content/articles/2026-07-26_基礎化粧品の基本知識と肌質診断.md)専用の
// マスコット「ネヴォラちゃん」コンポーネント群(2026-08-07 単調さ改善リニューアル)。
// lib/microneedleExtras.js(マイクロニードル記事)の設計をそのまま踏襲し、配色だけを
// この記事のテーマカラー(ミルクベージュ#C8A882 / アイボリー#FBF7F0 / グリーンティー#8FA37E)
// に変更している。lib/posts.js の renderChartHtml から chart.type で分岐して呼び出す。
// 他記事の描画・既存chartタイプの挙動には一切影響しない。

export const SKINCARE_BASICS_SLUG = "2026-07-26_基礎化粧品の基本知識と肌質診断";

const SKB_BEIGE = "#C8A882";
const SKB_GREEN = "#8FA37E";
const SKB_INK = "#4A3F35";

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// frontmatterのchart文字列に**bold**記法だけ簡易対応させる
// (このファイルの関数群はremarkを通さず直接HTML文字列を組み立てているため)。
function skbBoldify(text) {
  return escapeHtmlText(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

// マスコット「ネヴォラちゃん」の顔をインラインSVGで生成する。
// expression: "smile" | "idea" | "warning" | "worried"
export function mascotFaceSvg(expression, title) {
  const face =
    `<path d="M32 6 C46 22 57 35 57 46 A25 25 0 1 1 7 46 C7 35 18 22 32 6 Z" fill="${"#FBF7F0"}" stroke="${SKB_BEIGE}" stroke-width="2.5"/>`;
  const bangs = `<path d="M13 33 Q32 15 51 33" fill="none" stroke="${SKB_GREEN}" stroke-width="6" stroke-linecap="round"/>`;
  const cheeks =
    '<ellipse cx="20" cy="44" rx="4.5" ry="3" fill="#E8C7A9" opacity="0.7"/><ellipse cx="44" cy="44" rx="4.5" ry="3" fill="#E8C7A9" opacity="0.7"/>';

  let eyes = `<circle cx="23" cy="40" r="2.6" fill="${SKB_INK}"/><circle cx="41" cy="40" r="2.6" fill="${SKB_INK}"/>`;
  let mouth = `<path d="M24 50 Q32 56 40 50" fill="none" stroke="${SKB_INK}" stroke-width="2.4" stroke-linecap="round"/>`;
  let extra = "";

  if (expression === "idea") {
    extra = `<circle cx="32" cy="1" r="4.5" fill="${SKB_GREEN}"/><path d="M28 1 h8 M30 -3 v-3 M24 -1 l-3 -2 M40 -1 l3 -2" stroke="${SKB_GREEN}" stroke-width="1.6"/>`;
    mouth = `<circle cx="32" cy="51" r="2.2" fill="${SKB_INK}"/>`;
  } else if (expression === "warning") {
    eyes =
      `<path d="M20 38 L26 40" stroke="${SKB_INK}" stroke-width="2" stroke-linecap="round"/><path d="M44 38 L38 40" stroke="${SKB_INK}" stroke-width="2" stroke-linecap="round"/><circle cx="23" cy="41.5" r="2.2" fill="${SKB_INK}"/><circle cx="41" cy="41.5" r="2.2" fill="${SKB_INK}"/>`;
    mouth = `<rect x="28" y="49" width="8" height="3.5" rx="1.5" fill="${SKB_INK}"/>`;
    extra =
      '<circle cx="52" cy="10" r="8" fill="#B5652E"/><rect x="50.5" y="5" width="3" height="7" rx="1.2" fill="#fff"/><rect x="50.5" y="13.5" width="3" height="3" rx="1.2" fill="#fff"/>';
  } else if (expression === "worried") {
    eyes =
      `<path d="M20 39 Q23 37 26 39" stroke="${SKB_INK}" stroke-width="1.8" fill="none"/><path d="M38 39 Q41 37 44 39" stroke="${SKB_INK}" stroke-width="1.8" fill="none"/><circle cx="23" cy="41" r="2.2" fill="${SKB_INK}"/><circle cx="41" cy="41" r="2.2" fill="${SKB_INK}"/>`;
    mouth = `<path d="M25 52 Q32 47 39 52" fill="none" stroke="${SKB_INK}" stroke-width="2.2" stroke-linecap="round"/>`;
  }

  return `<svg viewBox="-6 -8 76 74" width="56" height="56" class="skb-mascot-svg" role="img" aria-label="${escapeHtmlText(
    title
  )}"><title>${escapeHtmlText(title)}</title>${face}${bangs}${cheeks}${eyes}${mouth}${extra}</svg>`;
}

// 冒頭「⏱ 30秒でわかる」サマリーカード(chart type: "skincareQuickSummary")
export function renderQuickSummaryHtml(chart) {
  const { conclusions = [], forWho = [] } = chart || {};
  const conclusionItems = conclusions.map((c) => `<li>${skbBoldify(c)}</li>`).join("");
  const forWhoItems = forWho.map((c) => `<li>${skbBoldify(c)}</li>`).join("");
  return `<figure class="skb-quick-summary"><figcaption class="skb-quick-summary-title"><span aria-hidden="true">⏱</span>30秒でわかるこの記事の結論</figcaption><div class="skb-quick-summary-body"><div class="skb-quick-summary-col"><p class="skb-quick-summary-label">結論</p><ul>${conclusionItems}</ul></div><div class="skb-quick-summary-col"><p class="skb-quick-summary-label">こんな人向け</p><ul>${forWhoItems}</ul></div></div></figure>`;
}

// 💡NEVORAポイント(chart type: "skincareTip") / ⚠️注意(chart type: "skincareWarning")
// マスコットの吹き出し+アクセント枠で表示する。
export function renderTipHtml(chart) {
  const { text, expression = "idea" } = chart || {};
  return `<aside class="skb-tip">${mascotFaceSvg(
    expression,
    "ネヴォラちゃん(ひらめき)"
  )}<div class="skb-tip-bubble"><p class="skb-tip-label">💡 NEVORAポイント</p><p>${skbBoldify(text)}</p></div></aside>`;
}

export function renderWarningHtml(chart) {
  const { text } = chart || {};
  return `<aside class="skb-warning">${mascotFaceSvg(
    "warning",
    "ネヴォラちゃん(注意)"
  )}<div class="skb-warning-bubble"><p class="skb-warning-label">⚠️ 注意</p><p>${skbBoldify(text)}</p></div></aside>`;
}

// 📝体験メモ(chart type: "skincareMemo")
export function renderMemoHtml(chart) {
  const { lines = [] } = chart || {};
  const items = lines.map((l) => `<p>${skbBoldify(l)}</p>`).join("");
  return `<figure class="skb-memo"><figcaption class="skb-memo-title"><span aria-hidden="true">📝</span>体験メモ(個人の感想です)</figcaption><div class="skb-memo-body">${items}</div></figure>`;
}

// 記事末尾のまとめカード(chart type: "skincareFinalSummary")
export function renderFinalSummaryHtml(chart) {
  const { conclusions = [], nextStep = "", links = [] } = chart || {};
  const conclusionItems = conclusions.map((c) => `<li>${skbBoldify(c)}</li>`).join("");
  const linkItems = links
    .map((l) => `<li><a href="${escapeHtmlText(l.url)}">${escapeHtmlText(l.label)}</a></li>`)
    .join("");
  const linksHtml = links.length
    ? `<div class="skb-final-summary-links"><p class="skb-final-summary-label">関連記事</p><ul>${linkItems}</ul></div>`
    : "";
  return `<figure class="skb-final-summary"><figcaption class="skb-final-summary-title"><span aria-hidden="true">✅</span>まとめ</figcaption><ul class="skb-final-summary-conclusions">${conclusionItems}</ul><p class="skb-final-summary-next"><span aria-hidden="true">👉</span>次の一歩: ${skbBoldify(
    nextStep
  )}</p>${linksHtml}</figure>`;
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。見出しの直前で区切るため、charts/accordions/
// マスコットの挿入がすべて終わったあと、最後に一度だけ実行する。
export function wrapSkincareBasicsSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["skb-section-plain", "skb-section-tint", "skb-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part;
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="skb-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}
