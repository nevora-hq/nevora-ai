// 記事「【毛穴タイプ別】黒ずみ・開き・たるみ毛穴、それぞれに合う化粧水・美容液比較」
// (content/articles/2026-07-26_毛穴ケア比較.md)専用のレンダリング処理をまとめたファイル。
// lib/posts.js の renderChartHtml から chart.type に応じて呼び出される追加分岐と、
// この記事のslugのときだけ実行するH2セクション交互背景・表の横スクロール対応・
// 独自目次の処理を提供する。他記事の描画・既存chartタイプの挙動には一切影響しない
// (lib/kusumiWidgets.js / lib/hairTypeWidgets.js と同じ設計方針)。
// クライアント側JS不要(静的HTML/SVG文字列)。

import { pickHeadingEmoji } from "./tocEmoji";

export const PORE_CARE_SLUG = "2026-07-26_毛穴ケア比較";

// テーマカラー: テラコッタ#D98362 / ピーチクリーム#FBEEE4 / チャコール#40363A
const THEME = {
  terracotta: "#D98362",
  terracottaDark: "#B4674A",
  peach: "#FBEEE4",
  charcoal: "#40363A",
};

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripTags(text) {
  return String(text || "").replace(/<[^>]+>/g, "").trim();
}

// ① 毛穴タイプ3面図: 黒ずみ毛穴(鼻の黒い点)/開き毛穴(丸く開いた毛穴)/
// たるみ毛穴(涙型に伸びた毛穴)を、色だけに頼らずラベル・形状の違いで描き分ける。
// 記事冒頭のセルフチェックを図解として補強する目的(2026-08-08スマホ可読性改善)。
export function renderPoreTypesFacesHtml() {
  const title = "毛穴タイプ3面図:黒ずみ・開き・たるみ";
  const items = [
    {
      x: 20,
      label: "黒ずみ毛穴",
      sub: "鼻に黒いポツポツ",
      pores: [
        { cx: 45, cy: 60, r: 3 },
        { cx: 60, cy: 68, r: 3.2 },
        { cx: 52, cy: 78, r: 2.6 },
        { cx: 68, cy: 82, r: 2.8 },
      ],
      poreFill: "#5C4A42",
      poreShape: "circle",
    },
    {
      x: 140,
      label: "開き毛穴",
      sub: "丸く開いて見える",
      pores: [
        { cx: 165, cy: 62, r: 4.5 },
        { cx: 182, cy: 70, r: 5 },
        { cx: 172, cy: 82, r: 4.2 },
        { cx: 190, cy: 86, r: 4.6 },
      ],
      poreFill: "#C9A98F",
      poreShape: "circle",
    },
    {
      x: 260,
      label: "たるみ毛穴",
      sub: "涙型に伸びて見える",
      pores: [
        { cx: 285, cy: 60, rx: 2.6, ry: 6 },
        { cx: 302, cy: 70, rx: 2.8, ry: 7 },
        { cx: 292, cy: 82, rx: 2.4, ry: 6.5 },
        { cx: 310, cy: 88, rx: 2.6, ry: 6 },
      ],
      poreFill: "#B98A6B",
      poreShape: "ellipse",
    },
  ];

  const groups = items
    .map((it) => {
      const poreShapes = it.pores
        .map((p) =>
          it.poreShape === "circle"
            ? `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="${it.poreFill}" />`
            : `<ellipse cx="${p.cx}" cy="${p.cy}" rx="${p.rx}" ry="${p.ry}" fill="${it.poreFill}" />`
        )
        .join("");
      return `<g>
        <ellipse cx="${it.x + 55}" cy="72" rx="34" ry="40" fill="#F6E4D6" stroke="#8B6F52" stroke-width="2" />
        ${poreShapes}
        <text x="${it.x + 55}" y="150" text-anchor="middle" class="pc-face-label">${escapeHtmlText(
          it.label
        )}</text>
        <text x="${it.x + 55}" y="167" text-anchor="middle" class="pc-face-sub">${escapeHtmlText(it.sub)}</text>
      </g>`;
    })
    .join("");

  return `<figure class="article-chart pc-faces">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 400 180" class="pc-faces-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 黒ずみ毛穴は鼻に黒いポツポツ、開き毛穴は丸く開いて見え、たるみ毛穴は涙型に伸びて見える">
      <title>毛穴タイプ別の見た目の違い</title>
      <!-- viewBoxWidth 360→400(2026-08-17、項目35が最右パネル〔たるみ毛穴〕の
           subラベル「涙型に伸びて見える」がviewBox右端をはみ出すことを実測で
           検出。パネル位置(x=20/140/260)は変更せず右側の余白のみ拡張して解消)。 -->
      <rect x="0" y="0" width="400" height="180" rx="10" fill="#FFFFFF" />
      ${groups}
      <line x1="128" y1="14" x2="128" y2="175" stroke="${THEME.peach}" stroke-width="1.5" stroke-dasharray="3 5" />
      <line x1="248" y1="14" x2="248" y2="175" stroke="${THEME.peach}" stroke-width="1.5" stroke-dasharray="3 5" />
    </svg>
    <p class="pc-diagram-caption">形と場所の違いで見分けられます。迷ったら鏡で頬・鼻を近くで見てみてください。</p>
  </figure>`;
}

// ② 選び方3軸アイコン: 成分・使い心地・価格帯を丸アイコン+短いラベルで
// 視覚的に提示する(「選び方の基準」見出し直後、本文の前に置くことで
// テキストのみの説明が続くのを防ぐ)。
export function renderPoreAxisIconsHtml() {
  const title = "選び方の3つの軸";
  const items = [
    { x: 60, icon: "🧪", label: "成分", sub: "タイプに合うか" },
    { x: 180, icon: "✋", label: "使い心地", sub: "さっぱり/しっとり" },
    { x: 300, icon: "💰", label: "価格帯", sub: "プチプラ〜デパコス" },
  ];
  const groups = items
    .map(
      (it) => `<g>
        <circle cx="${it.x}" cy="55" r="42" fill="${THEME.peach}" stroke="${THEME.terracotta}" stroke-width="2" />
        <text x="${it.x}" y="66" text-anchor="middle" font-size="30">${it.icon}</text>
        <text x="${it.x}" y="118" text-anchor="middle" class="pc-axis-label">${escapeHtmlText(it.label)}</text>
        <text x="${it.x}" y="134" text-anchor="middle" class="pc-axis-sub">${escapeHtmlText(it.sub)}</text>
      </g>`
    )
    .join("");

  return `<figure class="article-chart pc-axis-icons">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 360 145" class="pc-axis-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 成分がタイプに合うか、使い心地がさっぱりかしっとりか、価格帯がプチプラかデパコスかの3つで考える">
      <title>毛穴ケアアイテムの選び方3軸</title>
      ${groups}
    </svg>
  </figure>`;
}

// ③ テクスチャーダイヤル: 収れん化粧水(さっぱり)⇔エイジングケア美容液(しっとり)の
// 使用感の違いを横棒+マーカーで視覚化する。「実際に比較して感じた違い」見出し直後に
// 配置し、写真+長文パラグラフが連続する手前で読者の目を休める役割を持たせる。
export function renderPoreTextureDialHtml() {
  const title = "使い心地の違い:さっぱり ⇔ しっとり";
  return `<figure class="article-chart pc-dial">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 360 110" class="pc-dial-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 収れん化粧水はさっぱり寄り、エイジングケア美容液はしっとり寄りに位置する">
      <title>収れん化粧水とエイジングケア美容液の使用感比較</title>
      <rect x="20" y="46" width="320" height="10" rx="5" fill="${THEME.peach}" />
      <circle cx="90" cy="51" r="12" fill="${THEME.terracotta}" />
      <circle cx="270" cy="51" r="12" fill="${THEME.terracottaDark}" />
      <text x="20" y="30" class="pc-dial-end">さっぱり</text>
      <text x="300" y="30" text-anchor="end" class="pc-dial-end">しっとり</text>
      <text x="90" y="86" text-anchor="middle" class="pc-dial-item">収れん化粧水</text>
      <text x="270" y="86" text-anchor="middle" class="pc-dial-item">エイジングケア美容液</text>
      <text x="90" y="102" text-anchor="middle" class="pc-dial-item2">開き毛穴向け</text>
      <text x="270" y="102" text-anchor="middle" class="pc-dial-item2">たるみ毛穴向け</text>
    </svg>
  </figure>`;
}

// ✅ チェックリスト(frontmatterのcharts[].itemsから生成)。
export function renderPoreChecklistHtml(chart) {
  const { title = "今日からできるチェックリスト", items } = chart || {};
  const list = (Array.isArray(items) ? items : [])
    .map((item) => `<li>${escapeHtmlText(item)}</li>`)
    .join("");

  return `<div class="pc-checklist">
    <p class="pc-checklist-title">✅ ${escapeHtmlText(title)}</p>
    <ul>${list}</ul>
  </div>`;
}

// 記事末の「まとめカード」(結論3〜5行+次の一歩+関連記事リンク)。
export function renderPoreSummaryCardHtml(chart) {
  const { conclusion, nextStep, links } = chart || {};
  const conclusionItems = (Array.isArray(conclusion) ? conclusion : [])
    .map((c) => `<li>${escapeHtmlText(c)}</li>`)
    .join("");
  const linkItems = (Array.isArray(links) ? links : [])
    .map((l) => `<li><a href="${escapeHtmlText(l.url)}">${escapeHtmlText(l.label)}</a></li>`)
    .join("");

  return `<div class="pc-summary-card">
    <h3>結論はこの通り</h3>
    <ul>${conclusionItems}</ul>
    ${nextStep ? `<h3>今日の次の一歩</h3><p>${escapeHtmlText(nextStep)}</p>` : ""}
    ${linkItems ? `<h3>あわせて読みたい記事</h3><ul>${linkItems}</ul>` : ""}
  </div>`;
}

const TOC_EMOJI_BY_KEYWORD = [
  [/涙型|伸びていた/, "😳"],
  [/1位|調査結果/, "📊"],
  [/選び方|基準/, "🧭"],
  [/実際に比較/, "🧴"],
  [/タイプ別|処方|注意点/, "⚗️"],
  [/パック|ピーリング/, "⚠️"],
  [/向いている人|次に読みたい/, "🙋"],
  [/まとめ/, "🎯"],
];

// 目次: <details>で折りたたみ、各項目に絵文字を付けた、この記事専用の目次ブロック。
export function renderPoreTocHtml(toc) {
  if (!Array.isArray(toc) || toc.length === 0) return "";
  const items = toc
    .filter((item) => item.level === 2)
    .map((item) => {
      const emoji = pickHeadingEmoji(stripTags(item.text), TOC_EMOJI_BY_KEYWORD);
      const emojiSpan = emoji
        ? `<span class="pc-toc-emoji" aria-hidden="true">${emoji}</span>`
        : "";
      return `<li class="pc-toc-item"><a href="#${item.id}">${emojiSpan}${escapeHtmlText(item.text)}</a></li>`;
    })
    .join("");

  return `<details class="pc-toc"><summary>📖 目次(タップで開閉)</summary><ol class="pc-toc-list">${items}</ol></details>`;
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。charts/accordions/マスコットの挿入が
// すべて終わったあと、最後に一度だけ実行する。
export function wrapPoreSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["pc-section-plain", "pc-section-tint", "pc-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part;
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="pc-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}

// 幅の広い表(タイプ別処方・注意点の表など)を横スクロール対応divで包み、
// 「→ 横にスクロールできます」のヒント文を添える。テーブル自体の中身は変更しない。
export function wrapPoreTables(html) {
  return html.replace(
    /<table>([\s\S]*?)<\/table>/g,
    (match) =>
      `<p class="pc-scroll-hint">→ 横にスクロールできます</p><div class="pc-scroll-wrap"><table class="pc-table">${match
        .replace(/^<table>/, "")
        .replace(/<\/table>$/, "")}</table></div>`
  );
}
