// 「頭皮のかゆみ・フケに効くシャンプー比較」記事
// (content/articles/2026-08-02_頭皮かゆみフケシャンプー比較.md)専用の
// SVG/HTML図解ウィジェット(2026-08-07 スマホ可読性リニューアル)。
// 他記事のchart type(renderBarChartHtml等)には影響を与えないよう、lib/posts.js の
// renderChartHtml から type 名で分岐して呼び出す(在宅ワーク記事のlib/zaitakuSkincareWidgets.js
// と同じ設計方針)。クライアント側JS不要(静的HTML/SVG文字列)。装飾のみのSVGは aria-hidden、
// 情報を持つSVGには role="img" + <title> を付与する。

export const KSS_SLUG = "2026-08-02_頭皮かゆみフケシャンプー比較";

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① SVG頭皮断面比較図(chart type: "kssScalpCrossSection")。
// 乾燥タイプ(角質が細かく白くはがれる/皮脂少)と脂性タイプ(皮脂過剰/大きく湿ったフケ)を
// 横並びで描き分け、毛穴・皮脂腺も描く。
export function renderScalpCrossSectionHtml(chart) {
  const { title } = chart || {};
  const alt = "乾燥タイプと脂性タイプの頭皮断面比較図。乾燥タイプは角質が細かく白くはがれ皮脂が少ない。脂性タイプは皮脂腺が過剰に皮脂を分泌し毛穴に皮脂が詰まっている。";

  function panel(x, kind) {
    const isDry = kind === "dry";
    const skinColor = isDry ? "#f3ede4" : "#fbe9c9";
    const sebumColor = isDry ? "#dfe9e5" : "#e8a23a";
    const flakes = isDry
      ? `<circle cx="${x + 18}" cy="14" r="2.4" fill="#fff" stroke="#c9beae" stroke-width="1"/>
         <circle cx="${x + 34}" cy="9" r="2" fill="#fff" stroke="#c9beae" stroke-width="1"/>
         <circle cx="${x + 50}" cy="15" r="2.6" fill="#fff" stroke="#c9beae" stroke-width="1"/>
         <circle cx="${x + 64}" cy="10" r="1.8" fill="#fff" stroke="#c9beae" stroke-width="1"/>`
      : `<ellipse cx="${x + 22}" cy="13" rx="5" ry="3.4" fill="#f4d59a" stroke="#c98a1f" stroke-width="1"/>
         <ellipse cx="${x + 48}" cy="10" rx="6" ry="4" fill="#f4d59a" stroke="#c98a1f" stroke-width="1"/>
         <ellipse cx="${x + 62}" cy="16" rx="4.5" ry="3" fill="#f4d59a" stroke="#c98a1f" stroke-width="1"/>`;
    return `<g>
      <rect x="${x}" y="20" width="90" height="110" rx="8" fill="${skinColor}" stroke="#4c5a63" stroke-width="1.2"/>
      ${flakes}
      <line x1="${x + 30}" y1="20" x2="${x + 26}" y2="70" stroke="#8a7a63" stroke-width="2"/>
      <line x1="${x + 60}" y1="20" x2="${x + 64}" y2="70" stroke="#8a7a63" stroke-width="2"/>
      <circle cx="${x + 26}" cy="76" r="9" fill="${sebumColor}" stroke="#4c5a63" stroke-width="1"/>
      <circle cx="${x + 64}" cy="76" r="9" fill="${sebumColor}" stroke="#4c5a63" stroke-width="1"/>
      <text x="${x + 45}" y="110" text-anchor="middle" class="kss-diagram-label">毛穴・皮脂腺</text>
      <text x="${x + 45}" y="143" text-anchor="middle" class="kss-diagram-label">${
        isDry ? "(皮脂少なめ)" : "(皮脂過剰)"
      }</text>
    </g>`;
  }

  return `<figure class="kss-figure kss-scalp-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "乾燥タイプ・脂性タイプの頭皮断面比較")}</figcaption>
    <svg viewBox="0 -30 200 187" class="kss-scalp-svg" role="img" aria-label="${escapeHtmlText(
      alt
    )}"><title>${escapeHtmlText(alt)}</title>
      ${panel(5, "dry")}
      ${panel(105, "oily")}
      <text x="50" y="-12" text-anchor="middle" class="kss-diagram-heading">乾燥タイプ</text>
      <text x="150" y="-12" text-anchor="middle" class="kss-diagram-heading">脂性タイプ</text>
    </svg>
    <ul class="kss-figure-legend">
      <li><span class="kss-legend-dot" style="background:#f3ede4;border:1px solid #4c5a63"></span>乾燥タイプ:角質が細かく白くはがれる・皮脂は少なめ</li>
      <li><span class="kss-legend-dot" style="background:#fbe9c9;border:1px solid #4c5a63"></span>脂性タイプ:皮脂腺が過剰に働き、毛穴に皮脂が溜まりやすい</li>
    </ul>
  </figure>`;
}

// ② SVGフケ拡大図(chart type: "kssFlakeCloseup")。
// フケの粒の違い(細かくパラパラ vs 大きくベタつく)を拡大イラストで比較。
export function renderFlakeCloseupHtml(chart) {
  const { title } = chart || {};
  const alt = "フケの拡大比較図。乾燥タイプのフケは細かく白くパラパラしている。脂性タイプのフケは大きく黄色っぽくベタついている。";

  return `<figure class="kss-figure kss-flake-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "フケの粒の違いで見分ける")}</figcaption>
    <svg viewBox="0 0 200 126" class="kss-flake-svg" role="img" aria-label="${escapeHtmlText(
      alt
    )}"><title>${escapeHtmlText(alt)}</title>
      <rect x="4" y="6" width="90" height="86" rx="10" fill="#eaf6f2" stroke="#4fb49b" stroke-width="1.2"/>
      <circle cx="26" cy="34" r="3" fill="#fff" stroke="#9aa7ab" stroke-width="1"/>
      <circle cx="44" cy="24" r="2.4" fill="#fff" stroke="#9aa7ab" stroke-width="1"/>
      <circle cx="62" cy="36" r="3.2" fill="#fff" stroke="#9aa7ab" stroke-width="1"/>
      <circle cx="34" cy="52" r="2.2" fill="#fff" stroke="#9aa7ab" stroke-width="1"/>
      <circle cx="56" cy="58" r="2.8" fill="#fff" stroke="#9aa7ab" stroke-width="1"/>
      <circle cx="72" cy="50" r="2" fill="#fff" stroke="#9aa7ab" stroke-width="1"/>
      <text x="49" y="80" text-anchor="middle" class="kss-diagram-label">細かくパラパラ</text>

      <rect x="106" y="6" width="90" height="86" rx="10" fill="#fdf3ec" stroke="#d98f6e" stroke-width="1.2"/>
      <ellipse cx="130" cy="36" rx="8" ry="5.5" fill="#f0dcae" stroke="#b8873a" stroke-width="1"/>
      <ellipse cx="156" cy="30" rx="9" ry="6" fill="#f0dcae" stroke="#b8873a" stroke-width="1"/>
      <ellipse cx="172" cy="50" rx="7" ry="5" fill="#f0dcae" stroke="#b8873a" stroke-width="1"/>
      <ellipse cx="140" cy="58" rx="8.5" ry="5.5" fill="#f0dcae" stroke="#b8873a" stroke-width="1"/>
      <text x="151" y="80" text-anchor="middle" class="kss-diagram-label">大きくベタつく</text>

      <text x="49" y="112" text-anchor="middle" class="kss-diagram-heading">乾燥タイプ</text>
      <text x="151" y="112" text-anchor="middle" class="kss-diagram-heading">脂性タイプ</text>
    </svg>
  </figure>`;
}

// ③ SVG診断フロー(chart type: "kssDiagnosisFlow")。
// かゆみの出るタイミング+フケの性状 でタイプ判定。
export function renderDiagnosisFlowHtml(chart) {
  const { title } = chart || {};
  const alt = "診断フロー: 洗った直後にかゆい場合は乾燥タイプ。夕方にかゆい、季節限定でかゆい場合は皮脂の状態を確認し、フケが細かければ乾燥タイプ、大きくベタつけば脂性タイプ。";

  return `<figure class="kss-figure kss-flow-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "タイプ診断フローチャート")}</figcaption>
    <svg viewBox="0 0 240 315" class="kss-flow-svg" role="img" aria-label="${escapeHtmlText(
      alt
    )}"><title>${escapeHtmlText(alt)}</title>
      <rect x="65" y="6" width="110" height="46" rx="8" fill="#4c5a63"/>
      <text x="120" y="26" text-anchor="middle" class="kss-flow-node-text-light">かゆみが出るのは</text>
      <text x="120" y="43" text-anchor="middle" class="kss-flow-node-text-light">いつ?</text>

      <line x1="120" y1="52" x2="120" y2="66" stroke="#4c5a63" stroke-width="2"/>

      <rect x="4" y="66" width="110" height="46" rx="8" fill="#eaf6f2" stroke="#4fb49b" stroke-width="1.4"/>
      <text x="59" y="86" text-anchor="middle" class="kss-flow-node-text">洗った直後に</text>
      <text x="59" y="103" text-anchor="middle" class="kss-flow-node-text">つっぱる・かゆい</text>

      <rect x="126" y="66" width="110" height="46" rx="8" fill="#fdf3ec" stroke="#d98f6e" stroke-width="1.4"/>
      <text x="181" y="86" text-anchor="middle" class="kss-flow-node-text">夕方や季節の</text>
      <text x="181" y="103" text-anchor="middle" class="kss-flow-node-text">変わり目にかゆい</text>

      <line x1="59" y1="112" x2="59" y2="132" stroke="#4fb49b" stroke-width="2"/>
      <line x1="181" y1="112" x2="181" y2="132" stroke="#d98f6e" stroke-width="2"/>

      <rect x="4" y="132" width="110" height="52" rx="8" fill="#fff" stroke="#4fb49b" stroke-width="1.4"/>
      <text x="59" y="153" text-anchor="middle" class="kss-flow-node-text">フケが細かく</text>
      <text x="59" y="170" text-anchor="middle" class="kss-flow-node-text">パラパラ</text>

      <line x1="59" y1="184" x2="59" y2="204" stroke="#4fb49b" stroke-width="2"/>
      <rect x="4" y="204" width="110" height="70" rx="8" fill="#4fb49b"/>
      <text x="59" y="223" text-anchor="middle" class="kss-flow-node-text-light">乾燥タイプ</text>
      <text x="59" y="240" text-anchor="middle" class="kss-flow-node-text-light">アミノ酸系が</text>
      <text x="59" y="257" text-anchor="middle" class="kss-flow-node-text-light">おすすめ</text>

      <rect x="126" y="132" width="110" height="52" rx="8" fill="#fff" stroke="#d98f6e" stroke-width="1.4"/>
      <text x="181" y="153" text-anchor="middle" class="kss-flow-node-text">フケが大きく</text>
      <text x="181" y="170" text-anchor="middle" class="kss-flow-node-text">ベタつく</text>

      <line x1="181" y1="184" x2="181" y2="204" stroke="#d98f6e" stroke-width="2"/>
      <rect x="126" y="204" width="110" height="70" rx="8" fill="#d98f6e"/>
      <text x="181" y="223" text-anchor="middle" class="kss-flow-node-text-light">脂性タイプ</text>
      <text x="181" y="240" text-anchor="middle" class="kss-flow-node-text-light">高級アルコール系</text>
      <text x="181" y="257" text-anchor="middle" class="kss-flow-node-text-light">+薬用成分</text>

      <text x="120" y="294" text-anchor="middle" class="kss-diagram-label">両方に当てはまる場合は</text>
      <text x="120" y="311" text-anchor="middle" class="kss-diagram-label">アミノ酸系+薬用成分から</text>
    </svg>
  </figure>`;
}

// ④ SVG手順図(chart type: "kssWashSteps")。
// 正しい洗い方5ステップ。items: [{step, seconds, note}]
export function renderWashStepsHtml(chart) {
  const { title, items } = chart || {};
  if (!Array.isArray(items) || items.length === 0) return "";

  const rowH = 44;
  const width = 325;
  const height = items.length * rowH + 16;

  const rows = items
    .map((it, i) => {
      const y = 10 + i * rowH;
      const label = escapeHtmlText(it.step);
      const seconds = escapeHtmlText(it.seconds);
      return `<g>
        <circle cx="20" cy="${y + 16}" r="14" fill="#4fb49b"/>
        <text x="20" y="${y + 21}" text-anchor="middle" class="kss-step-num">${i + 1}</text>
        <text x="40" y="${y + 12}" class="kss-step-text">${label}</text>
        <text x="40" y="${y + 29}" class="kss-step-seconds">${seconds}</text>
      </g>`;
    })
    .join("");

  const alt = `正しい洗い方${items.length}ステップ: ${items
    .map((it, i) => `${i + 1}. ${it.step}(${it.seconds})`)
    .join("、")}`;

  return `<figure class="kss-figure kss-steps-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "正しい洗い方5ステップ")}</figcaption>
    <svg viewBox="0 0 ${width} ${height}" class="kss-steps-svg" role="img" aria-label="${escapeHtmlText(
    alt
  )}"><title>${escapeHtmlText(alt)}</title>${rows}</svg>
  </figure>`;
}

// 幅の広い表(商品比較表など)を横スクロール対応でラップする(lib/hyaluWidgets.js
// のwrapHyaluTablesと同じ設計)。この記事内の全<table>が対象(他記事には影響しない)。
export function wrapKssTables(html) {
  return html
    .replace(
      /<table>/g,
      `<div class="table-scroll-wrap"><p class="table-scroll-note">→ 横にスクロールできます</p><table>`
    )
    .replace(/<\/table>/g, `</table></div>`);
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。charts/accordions/checklists/マスコットの挿入が
// すべて終わったあと、最後に一度だけ実行する(lib/zaitakuSkincareWidgets.jsと同じ設計)。
export function wrapKssSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["kss-section-plain", "kss-section-tint", "kss-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part;
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="kss-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}

// 折りたたみ式の絵文字付き目次を記事冒頭に追加する(lib/kusumiWidgets等と同じ設計)。
export function renderKssTocHtml(toc) {
  if (!Array.isArray(toc) || toc.length === 0) return "";
  const items = toc
    .filter((t) => t.level === 2)
    .map(
      (t) =>
        `<li class="kss-toc-item"><a href="#${escapeHtmlText(t.id)}"><span class="kss-toc-emoji" aria-hidden="true">🧴</span>${escapeHtmlText(
          t.text
        )}</a></li>`
    )
    .join("");

  return `<details class="kss-toc">
    <summary>📖 目次</summary>
    <ul class="kss-toc-list">${items}</ul>
  </details>`;
}
