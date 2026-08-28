// 記事「マイクロニードル美容液・ニードルパッチおすすめ比較」
// (content/articles/2026-08-02_マイクロニードル美容液比較.md)専用のレンダリング処理をまとめたファイル。
// lib/posts.js の renderChartHtml から chart.type に応じて呼び出される追加分岐と、
// この記事のslugのときだけ実行するセクション分割・独自目次・マスコットSVGの処理を提供する。
// 他記事の描画・既存chartタイプ(bar/stat/donut/prosCons/quadrant等)の挙動には一切影響しない。
// (「リップ比較」記事用の lib/lipCompareExtras.js と同じ設計方針を踏襲している)

import { pickHeadingEmoji } from "./tocEmoji";

export const MICRONEEDLE_SLUG = "2026-08-02_マイクロニードル美容液比較";

const MN_PURPLE = "#7B61FF";
const MN_GOLD = "#D9B86A";

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// frontmatterのchart文字列に**bold**記法だけ簡易対応させる
// (このファイルの関数群はremarkを通さず直接HTML文字列を組み立てているため)。
function mnBoldify(text) {
  return escapeHtmlText(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

// 水滴型マスコット「ネヴォラちゃん」の顔をインラインSVGで生成する。
// expression: "smile" | "idea" | "warning" | "worried"
export function mascotFaceSvg(expression, title) {
  const face =
    `<path d="M32 6 C46 22 57 35 57 46 A25 25 0 1 1 7 46 C7 35 18 22 32 6 Z" fill="#FBF7FF" stroke="${MN_PURPLE}" stroke-width="2.5"/>`;
  const bangs = `<path d="M13 33 Q32 15 51 33" fill="none" stroke="${MN_GOLD}" stroke-width="6" stroke-linecap="round"/>`;
  const cheeks =
    '<ellipse cx="20" cy="44" rx="4.5" ry="3" fill="#F3B6C9" opacity="0.7"/><ellipse cx="44" cy="44" rx="4.5" ry="3" fill="#F3B6C9" opacity="0.7"/>';

  let eyes = '<circle cx="23" cy="40" r="2.6" fill="#3a2e57"/><circle cx="41" cy="40" r="2.6" fill="#3a2e57"/>';
  let mouth = '<path d="M24 50 Q32 56 40 50" fill="none" stroke="#3a2e57" stroke-width="2.4" stroke-linecap="round"/>';
  let extra = "";

  if (expression === "idea") {
    extra = `<circle cx="32" cy="1" r="4.5" fill="${MN_GOLD}"/><path d="M28 1 h8 M30 -3 v-3 M24 -1 l-3 -2 M40 -1 l3 -2" stroke="${MN_GOLD}" stroke-width="1.6"/>`;
    mouth = '<circle cx="32" cy="51" r="2.2" fill="#3a2e57"/>';
  } else if (expression === "warning") {
    eyes =
      '<path d="M20 38 L26 40" stroke="#3a2e57" stroke-width="2" stroke-linecap="round"/><path d="M44 38 L38 40" stroke="#3a2e57" stroke-width="2" stroke-linecap="round"/><circle cx="23" cy="41.5" r="2.2" fill="#3a2e57"/><circle cx="41" cy="41.5" r="2.2" fill="#3a2e57"/>';
    mouth = '<rect x="28" y="49" width="8" height="3.5" rx="1.5" fill="#3a2e57"/>';
    extra =
      '<circle cx="52" cy="10" r="8" fill="#e8590c"/><rect x="50.5" y="5" width="3" height="7" rx="1.2" fill="#fff"/><rect x="50.5" y="13.5" width="3" height="3" rx="1.2" fill="#fff"/>';
  } else if (expression === "worried") {
    eyes =
      '<path d="M20 39 Q23 37 26 39" stroke="#3a2e57" stroke-width="1.8" fill="none"/><path d="M38 39 Q41 37 44 39" stroke="#3a2e57" stroke-width="1.8" fill="none"/><circle cx="23" cy="41" r="2.2" fill="#3a2e57"/><circle cx="41" cy="41" r="2.2" fill="#3a2e57"/>';
    mouth = '<path d="M25 52 Q32 47 39 52" fill="none" stroke="#3a2e57" stroke-width="2.2" stroke-linecap="round"/>';
  }

  return `<svg viewBox="-6 -8 76 74" width="56" height="56" class="mn-mascot-svg" role="img" aria-label="${escapeHtmlText(
    title
  )}"><title>${escapeHtmlText(title)}</title>${face}${bangs}${cheeks}${eyes}${mouth}${extra}</svg>`;
}

// (1) 冒頭「⏱30秒でわかる」サマリーカード(chart type: "quickSummary")
export function renderQuickSummaryHtml(chart) {
  const { conclusions = [], forWho = [] } = chart || {};
  const conclusionItems = conclusions.map((c) => `<li>${mnBoldify(c)}</li>`).join("");
  const forWhoItems = forWho.map((c) => `<li>${mnBoldify(c)}</li>`).join("");
  return `<figure class="mn-quick-summary"><figcaption class="mn-quick-summary-title"><span aria-hidden="true">⏱</span>30秒でわかるこの記事の結論</figcaption><div class="mn-quick-summary-body"><div class="mn-quick-summary-col"><p class="mn-quick-summary-label">結論</p><ul>${conclusionItems}</ul></div><div class="mn-quick-summary-col"><p class="mn-quick-summary-label">こんな人向け</p><ul>${forWhoItems}</ul></div></div></figure>`;
}

// (3) 💡NEVORAポイント(chart type: "tip") / ⚠️注意ボックス(chart type: "warning")
// マスコットの吹き出し+アクセント枠で表示する。
export function renderTipHtml(chart) {
  const { text, expression = "idea" } = chart || {};
  return `<aside class="mn-tip">${mascotFaceSvg(
    expression,
    "ネヴォラちゃん(ひらめき)"
  )}<div class="mn-tip-bubble"><p class="mn-tip-label">💡 NEVORAポイント</p><p>${mnBoldify(text)}</p></div></aside>`;
}

export function renderWarningHtml(chart) {
  const { text } = chart || {};
  return `<aside class="mn-warning">${mascotFaceSvg(
    "warning",
    "ネヴォラちゃん(注意)"
  )}<div class="mn-warning-bubble"><p class="mn-warning-label">⚠️ 注意</p><p>${mnBoldify(text)}</p></div></aside>`;
}

// ⑧ 📝体験メモ(chart type: "memo")
export function renderMemoHtml(chart) {
  const { lines = [] } = chart || {};
  const items = lines.map((l) => `<p>${mnBoldify(l)}</p>`).join("");
  return `<figure class="mn-memo"><figcaption class="mn-memo-title"><span aria-hidden="true">📝</span>体験メモ(個人の感想です)</figcaption><div class="mn-memo-body">${items}</div></figure>`;
}

// (7) 記事末尾のまとめカード(chart type: "finalSummary")
export function renderFinalSummaryHtml(chart) {
  const { conclusions = [], nextStep = "", links = [] } = chart || {};
  const conclusionItems = conclusions.map((c) => `<li>${mnBoldify(c)}</li>`).join("");
  const linkItems = links
    .map((l) => `<li><a href="${escapeHtmlText(l.url)}">${escapeHtmlText(l.label)}</a></li>`)
    .join("");
  const linksHtml = links.length
    ? `<div class="mn-final-summary-links"><p class="mn-final-summary-label">関連記事</p><ul>${linkItems}</ul></div>`
    : "";
  return `<figure class="mn-final-summary"><figcaption class="mn-final-summary-title"><span aria-hidden="true">✅</span>まとめ</figcaption><ul class="mn-final-summary-conclusions">${conclusionItems}</ul><p class="mn-final-summary-next"><span aria-hidden="true">👉</span>次の一歩: ${mnBoldify(
    nextStep
  )}</p>${linksHtml}</figure>`;
}

// ① SVG3コマ手順図: 貼る → 体温で溶ける → 有効成分が角質層へ(chart type: "steps3")
export function renderStepsHtml(chart) {
  const { title, steps = [] } = chart || {};
  const icons = [
    `<rect x="14" y="26" width="42" height="30" rx="6" fill="#FBF7FF" stroke="${MN_PURPLE}" stroke-width="2"/><circle cx="26" cy="41" r="2" fill="${MN_PURPLE}"/><circle cx="35" cy="36" r="2" fill="${MN_PURPLE}"/><circle cx="44" cy="41" r="2" fill="${MN_PURPLE}"/><circle cx="35" cy="48" r="2" fill="${MN_PURPLE}"/>`,
    `<line x1="24" y1="18" x2="24" y2="34" stroke="${MN_GOLD}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 3"/><line x1="35" y1="14" x2="35" y2="34" stroke="${MN_GOLD}" stroke-width="3" stroke-linecap="round"/><line x1="46" y1="18" x2="46" y2="34" stroke="${MN_GOLD}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 3"/><rect x="14" y="34" width="42" height="22" rx="6" fill="#FFF7E8" stroke="${MN_GOLD}" stroke-width="2"/>`,
    `<rect x="10" y="14" width="50" height="10" fill="#FDEBD3"/><rect x="10" y="24" width="50" height="14" fill="#F6E4FF"/><rect x="10" y="38" width="50" height="14" fill="#EDE3FF"/><path d="M35 6 v14" stroke="${MN_PURPLE}" stroke-width="2.5" marker-end="url(#mnArrow)"/><path d="M22 6 v10" stroke="${MN_PURPLE}" stroke-width="2" opacity="0.6"/><path d="M48 6 v10" stroke="${MN_PURPLE}" stroke-width="2" opacity="0.6"/>`,
  ];

  const panels = steps
    .map((s, i) => {
      return `<li class="mn-steps-panel"><span class="mn-steps-num">${i + 1}</span><svg viewBox="0 0 70 62" class="mn-steps-icon" role="img" aria-label="${escapeHtmlText(
        s.title
      )}"><defs><marker id="mnArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="${MN_PURPLE}"/></marker></defs>${
        icons[i] || icons[0]
      }</svg><p class="mn-steps-title">${escapeHtmlText(s.title)}</p><p class="mn-steps-desc">${escapeHtmlText(
        s.desc
      )}</p></li>`;
    })
    .join("");

  return `<figure class="mn-steps"><figcaption class="chart-title">${escapeHtmlText(
    title || ""
  )}</figcaption><ol class="mn-steps-list">${panels}</ol></figure>`;
}

// ② SVGスケール図: 針の長さ(200μm/500μm/800μm)と到達する層(chart type: "needleScale")
export function renderNeedleScaleHtml(chart) {
  const { title, items = [], source, sourceUrl } = chart || {};
  const width = 320;
  const height = 220;
  const skinTop = 30;
  const maxDepth = 150;
  const layers = [
    { label: "角質層", from: 0, to: 18, fill: "#FDEBD3" },
    { label: "表皮", from: 18, to: 70, fill: "#F6E4FF" },
    { label: "真皮", from: 70, to: 150, fill: "#EDE3FF" },
  ];

  const layerRects = layers
    .map(
      (l) =>
        `<rect x="60" y="${skinTop + l.from}" width="220" height="${
          l.to - l.from
        }" fill="${l.fill}"/><text x="270" text-anchor="end" y="${
          skinTop + (l.from + l.to) / 2 + 4
        }" class="mn-scale-layer-label">${escapeHtmlText(l.label)}</text>`
    )
    .join("");

  const maxItem = Math.max(...items.map((it) => Number(it.microns) || 0), 1);
  const needles = items
    .map((it, i) => {
      const x = 100 + i * 60;
      const depthPx = (Number(it.microns) / maxItem) * maxDepth;
      const y2 = skinTop + depthPx;
      return `<g><line x1="${x}" y1="${skinTop - 12}" x2="${x}" y2="${y2}" stroke="${MN_PURPLE}" stroke-width="4" stroke-linecap="round"><title>${escapeHtmlText(
        `${it.microns}μm: ${it.target}`
      )}</title></line><circle cx="${x}" cy="${skinTop - 12}" r="4" fill="${MN_GOLD}"/><text x="${x}" y="${
        skinTop - 18
      }" text-anchor="middle" class="mn-scale-needle-label">${escapeHtmlText(`${it.microns}μm`)}</text></g>`;
    })
    .join("");

  const legendItems = items
    .map(
      (it) =>
        `<li><span class="mn-scale-dot" aria-hidden="true"></span>${escapeHtmlText(
          `${it.microns}μm`
        )} … ${escapeHtmlText(it.target)}</li>`
    )
    .join("");

  const sourceHtml = source
    ? `<figcaption class="chart-source">出典: ${
        sourceUrl
          ? `<a href="${escapeHtmlText(
              sourceUrl
            )}" target="_blank" rel="nofollow noopener noreferrer">${escapeHtmlText(source)}</a>`
          : escapeHtmlText(source)
      }</figcaption>`
    : "";

  return `<figure class="mn-scale"><figcaption class="chart-title">${escapeHtmlText(
    title || ""
  )}</figcaption><svg viewBox="0 0 ${width} ${height}" class="mn-scale-svg" role="img" aria-label="${escapeHtmlText(
    title || ""
  )}">${layerRects}${needles}</svg><ul class="mn-scale-legend">${legendItems}</ul>${sourceHtml}</figure>`;
}

// ⑤ SVGフローチャート: 目的別の選び方診断(chart type: "flowDiagnosis")
export function renderFlowHtml(chart) {
  const { title, root, branches = [] } = chart || {};
  const width = 320;
  const boxW = 92;
  const gap = 12;
  const startX = (width - (boxW * branches.length + gap * (branches.length - 1))) / 2;
  const rootY = 14;
  const branchY = 96;
  const rootBoxW = 220;

  const lines = branches
    .map((b, i) => {
      const bx = startX + i * (boxW + gap) + boxW / 2;
      return `<path d="M${width / 2} ${rootY + 34} L${bx} ${branchY}" stroke="${MN_PURPLE}" stroke-width="2" fill="none"/>`;
    })
    .join("");

  const boxes = branches
    .map((b, i) => {
      const bx = startX + i * (boxW + gap);
      return `<g><rect x="${bx}" y="${branchY}" width="${boxW}" height="30" rx="8" fill="#FBF7FF" stroke="${MN_PURPLE}" stroke-width="2"/><text x="${
        bx + boxW / 2
      }" y="${branchY + 13}" text-anchor="middle" class="mn-flow-cond">${escapeHtmlText(
        b.condition
      )}</text><rect x="${bx}" y="${branchY + 44}" width="${boxW}" height="34" rx="8" fill="${MN_GOLD}" opacity="0.25" stroke="${MN_GOLD}" stroke-width="2"/><text x="${
        bx + boxW / 2
      }" y="${branchY + 63}" text-anchor="middle" class="mn-flow-result">${escapeHtmlText(
        b.result
      )}</text><path d="M${bx + boxW / 2} ${branchY + 30} L${bx + boxW / 2} ${branchY + 44}" stroke="${MN_PURPLE}" stroke-width="2"/></g>`;
    })
    .join("");

  return `<figure class="mn-flow"><figcaption class="chart-title">${escapeHtmlText(
    title || ""
  )}</figcaption><svg viewBox="0 0 ${width} 200" class="mn-flow-svg" role="img" aria-label="${escapeHtmlText(
    title || ""
  )}"><rect x="${
    (width - rootBoxW) / 2
  }" y="${rootY}" width="${rootBoxW}" height="34" rx="8" fill="${MN_PURPLE}"/><text x="${
    width / 2
  }" y="${rootY + 21}" text-anchor="middle" class="mn-flow-root">${escapeHtmlText(
    root || ""
  )}</text>${lines}${boxes}</svg></figure>`;
}

function stripTags(text) {
  return String(text || "").replace(/<[^>]+>/g, "").trim();
}

const TOC_EMOJI_BY_KEYWORD = [
  [/一晩で毛穴|半信半疑/, "🤔"],
  [/違うの|使用感|頻度|価格/, "🔍"],
  [/3ステップ|届くまで/, "🩹"],
  [/深さ|針の長さ/, "📏"],
  [/タイプ別|特徴/, "🧴"],
  [/診断|向いている/, "🧭"],
  [/比較する/, "📊"],
  [/コスト/, "💰"],
  [/気をつけたい/, "⚠️"],
  [/次に読みたい/, "📖"],
  [/よくある質問|FAQ/i, "❓"],
  [/まとめ/, "✅"],
  [/出典/, "📚"],
];

// (2) 目次: <details>で折りたたみ、各項目に絵文字を付けた、この記事専用の目次ブロック。
// 既存の共通コンポーネント(components/ArticleToc.js)は他記事にも使われているため
// 変更せず、この記事だけ本文HTMLの先頭に独自の目次を追加する。
export function renderMicroneedleTocHtml(toc) {
  if (!Array.isArray(toc) || toc.length === 0) return "";
  const items = toc
    .filter((item) => item.level === 2)
    .map((item) => {
      const emoji = pickHeadingEmoji(stripTags(item.text), TOC_EMOJI_BY_KEYWORD);
      const emojiSpan = emoji
        ? `<span class="mn-toc-emoji" aria-hidden="true">${emoji}</span>`
        : "";
      return `<li class="mn-toc-item"><a href="#${item.id}">${emojiSpan}${escapeHtmlText(item.text)}</a></li>`;
    })
    .join("");

  return `<details class="mn-toc" open><summary>📖 目次(タップで開閉)</summary><ol class="mn-toc-list">${items}</ol></details>`;
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。見出しの直前で区切るため、charts/accordions/
// マスコットの挿入がすべて終わったあと、最後に一度だけ実行する。
export function wrapMicroneedleSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["mn-section-plain", "mn-section-tint", "mn-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part;
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="mn-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}
