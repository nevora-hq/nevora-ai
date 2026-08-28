// 「スキンケアの効果、メイクで台無しにしてない？」記事
// (content/articles/2026-07-21_メイクとスキンケアの相性.md)専用の
// SVG/HTML図解ウィジェット。他記事のchart type(renderBarChartHtml等)には
// 影響を与えないよう、lib/posts.js の renderChartHtml から type 名(mkskorder*)で
// 分岐して呼び出す(lib/hairTypeWidgets.js / lib/azelaicAcidWidgets.js と同じ設計方針)。
// クライアント側JS不要(静的HTML/SVG文字列)。装飾のみのSVGはaria-hidden、
// 情報を持つSVGにはrole="img"+<title>を付与する。SVG内の日本語テキストは
// すべて12px以上で統一する。

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① 化粧水〜ファンデーションまでを「層」で見せる断面図(ケーキ断面のイメージ)。
// 水性(青系)/油性(コーラル系)で色分けし、乳液と日焼け止めの境目に
// 「油分の壁」ができやすいポイントを矢印で示す。
export function renderLayerCrossSectionHtml() {
  const title = "重ねる順番でみる「層」の断面図";
  const layers = [
    { label: "化粧水", type: "水性", fill: "#BFE0F0", textFill: "#1B5C7A" },
    { label: "美容液", type: "水性〜ジェル", fill: "#CFE9F4", textFill: "#1B5C7A" },
    { label: "乳液", type: "水分+油分", fill: "#E3D9C8", textFill: "#5A4A32" },
    { label: "日焼け止め", type: "油性寄り", fill: "#FFD7C2", textFill: "#9C4A26" },
    { label: "下地", type: "油性寄り", fill: "#FFC7A8", textFill: "#9C4A26" },
    { label: "ファンデ", type: "粉体+油分", fill: "#F7B98F", textFill: "#8A3F1E" },
  ];

  const bandHeight = 38;
  const bandGap = 4;
  const startY = 30;
  const width = 320;

  const bands = layers
    .map((layer, i) => {
      const y = startY + i * (bandHeight + bandGap);
      return `<g>
        <rect x="20" y="${y}" width="${width - 40}" height="${bandHeight}" rx="8" fill="${layer.fill}" />
        <text x="36" y="${y + bandHeight / 2 - 4}" class="mkskorder-layer-label" fill="${layer.textFill}">${escapeHtmlText(
          layer.label
        )}</text>
        <text x="36" y="${y + bandHeight / 2 + 12}" class="mkskorder-layer-sub" fill="${layer.textFill}">${escapeHtmlText(
          layer.type
        )}</text>
      </g>`;
    })
    .join("");

  // 乳液(index 2)と日焼け止め(index 3)の境目に「油分の壁」を矢印+ラベルで示す
  const wallY = startY + 3 * (bandHeight + bandGap) - bandGap / 2;
  const wallMarker = `<g>
    <line x1="${width - 12}" y1="${wallY - 18}" x2="${width - 12}" y2="${
    wallY + 18
  }" stroke="#C9483A" stroke-width="3" stroke-dasharray="2 4" />
    <path d="M${width - 18} ${wallY - 20} L${width - 12} ${wallY - 28} L${width - 6} ${
    wallY - 20
  } Z" fill="#C9483A" />
    <text x="${width + 2}" y="${wallY + 4}" class="mkskorder-layer-wall-label" fill="#C9483A" writing-mode="vertical-rl">油分の壁</text>
  </g>`;

  const totalHeight = startY + layers.length * (bandHeight + bandGap) + 16;

  return `<figure class="article-chart mkskorder-diagram">
    <figcaption class="chart-title">🧴 ${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 ${width + 40} ${totalHeight}" class="mkskorder-diagram-svg" role="img" aria-label="${escapeHtmlText(
    title
  )}: 化粧水・美容液(水性)、乳液(水分+油分)、日焼け止め・下地・ファンデーション(油性寄り)の順に重なり、乳液と日焼け止めの間で油分の壁ができやすいことを示す断面図">
      <title>スキンケアからメイクまでの重ね順を示す層の断面図</title>
      <rect x="0" y="0" width="${width + 40}" height="${totalHeight}" rx="12" fill="#FFF6F2" />
      ${bands}
      ${wallMarker}
    </svg>
    <figcaption class="chart-source">水分が残ったまま油性アイテムを重ねると、境目に「油分の壁」ができやすくなります(イメージ図)。</figcaption>
  </figure>`;
}

// ② 水性×油性の相性マトリクス(2×2)。「重ねるタイミング」×「油性アイテムの量」で
// 密着するか浮く・ヨレるかを4象限で示す。
export function renderCompatMatrixHtml() {
  const title = "水性×油性の相性マトリクス";
  const cells = [
    {
      x: 20,
      y: 30,
      icon: "◎",
      iconClass: "mkskorder-matrix-good",
      head: "時間を空ける × 油性少なめ",
      body: "密着する",
    },
    {
      x: 180,
      y: 30,
      icon: "○",
      iconClass: "mkskorder-matrix-ok",
      head: "時間を空けない × 油性少なめ",
      body: "ややヨレやすい",
    },
    {
      x: 20,
      y: 150,
      icon: "○",
      iconClass: "mkskorder-matrix-ok",
      head: "時間を空ける × 油性多め",
      body: "ややヨレやすい",
    },
    {
      x: 180,
      y: 150,
      icon: "×",
      iconClass: "mkskorder-matrix-bad",
      head: "時間を空けない × 油性多め",
      body: "浮く・ヨレる",
    },
  ];

  const cellBlocks = cells
    .map((c) => {
      const lines = c.head.split(" × ");
      return `<g>
        <rect x="${c.x}" y="${c.y}" width="150" height="110" rx="10" fill="#FFFFFF" stroke="#F0C9BE" stroke-width="1.5" />
        <text x="${c.x + 75}" y="${c.y + 32}" text-anchor="middle" class="mkskorder-matrix-icon ${c.iconClass}">${c.icon}</text>
        <text x="${c.x + 75}" y="${c.y + 56}" text-anchor="middle" class="mkskorder-matrix-cond">${escapeHtmlText(
        lines[0] || ""
      )}</text>
        <text x="${c.x + 75}" y="${c.y + 72}" text-anchor="middle" class="mkskorder-matrix-cond">${escapeHtmlText(
        lines[1] || ""
      )}</text>
        <text x="${c.x + 75}" y="${c.y + 96}" text-anchor="middle" class="mkskorder-matrix-result">${escapeHtmlText(
        c.body
      )}</text>
      </g>`;
    })
    .join("");

  return `<figure class="article-chart mkskorder-matrix">
    <figcaption class="chart-title">🧩 ${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 350 280" class="mkskorder-matrix-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 時間を空けて油性が少ないと密着する、時間を空けず油性が多いと浮く・ヨレるという2×2の関係を示す図">
      <title>重ねるタイミングと油分量による密着感の相性マトリクス</title>
      <rect x="0" y="0" width="350" height="280" rx="12" fill="#FFF6F2" />
      <line x1="175" y1="20" x2="175" y2="270" stroke="#F0C9BE" stroke-width="1" stroke-dasharray="3 5" />
      <line x1="10" y1="145" x2="340" y2="145" stroke="#F0C9BE" stroke-width="1" stroke-dasharray="3 5" />
      ${cellBlocks}
    </svg>
    <figcaption class="chart-source">◎=密着しやすい／○=ややヨレやすい／×=浮く・ヨレやすい(イメージ図。色だけでなく記号でも判別できます)。</figcaption>
  </figure>`;
}

// ③ 待ち時間タイムライン。工程ごとの「なじませ時間」を砂時計アイコン+秒数で
// 横に並べ、合計時間も表示する。
export function renderWaitTimelineHtml() {
  const title = "スキンケアからメイクまでの「待ち時間」タイムライン";
  const steps = [
    { label: "化粧水→美容液", seconds: 15 },
    { label: "美容液→乳液", seconds: 20 },
    { label: "乳液→日焼け止め", seconds: 180 },
    { label: "日焼け止め→下地", seconds: 20 },
  ];
  const total = steps.reduce((sum, s) => sum + s.seconds, 0);
  const totalLabel = total >= 60 ? `${Math.floor(total / 60)}分${total % 60}秒` : `${total}秒`;

  const stepWidth = 116;
  const items = steps
    .map((s, i) => {
      const cx = 45 + i * stepWidth;
      return `<g>
        <text x="${cx}" y="34" text-anchor="middle" class="mkskorder-timeline-icon" aria-hidden="true">⏳</text>
        <text x="${cx}" y="56" text-anchor="middle" class="mkskorder-timeline-sec">${escapeHtmlText(
        `${s.seconds}秒`
      )}</text>
        <text x="${cx}" y="76" text-anchor="middle" class="mkskorder-timeline-label">${escapeHtmlText(
        s.label
      )}</text>
        ${
          i < steps.length - 1
            ? `<line x1="${cx + 28}" y1="30" x2="${
                cx + stepWidth - 28
              }" y2="30" stroke="#FF9B85" stroke-width="2" marker-end="url(#mkskorderArrow)" />`
            : ""
        }
      </g>`;
    })
    .join("");

  const width = 45 + (steps.length - 1) * stepWidth + 65;

  return `<figure class="article-chart mkskorder-timeline">
    <figcaption class="chart-title">⏱ ${escapeHtmlText(title)}</figcaption>
    <div class="mkskorder-timeline-scroll-wrap">
      <svg viewBox="0 0 ${width} 96" class="mkskorder-timeline-svg" role="img" aria-label="${escapeHtmlText(
    title
  )}: ${steps.map((s) => `${s.label}は${s.seconds}秒`).join("、")}、合計${escapeHtmlText(
    totalLabel
  )}">
        <title>工程ごとのなじませ時間の目安タイムライン</title>
        <defs>
          <marker id="mkskorderArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#FF9B85" />
          </marker>
        </defs>
        ${items}
      </svg>
    </div>
    <figcaption class="chart-source">合計 約${escapeHtmlText(totalLabel)}(目安)。忙しい朝でも取り入れやすい範囲です。→ 横にスクロールできます</figcaption>
  </figure>`;
}

// ④ 「正しい順番」vs「間違った順番」の崩れ実感を0h/3h/6h/9hで比較する2本線グラフ。
// 実測データではなくイメージ値であることをキャプションで明示する。
export function renderCollapseLineChartHtml() {
  const title = "崩れ実感スケール比較(0h/3h/6h/9h・イメージ値)";
  const labels = ["0h", "3h", "6h", "9h"];
  const series = [
    { label: "正しい順番", color: "#FF7B7B", points: [5, 15, 25, 35] },
    { label: "間違った順番", color: "#26374F", points: [5, 35, 55, 75] },
  ];

  const width = 320;
  const height = 220;
  const margin = 36;
  const plotW = width - margin * 2;
  const plotH = height - margin * 2;
  const maxV = 100;

  const xAt = (i) => margin + (i / (labels.length - 1)) * plotW;
  const yAt = (v) => margin + plotH - (v / maxV) * plotH;

  const axisLabels = labels
    .map(
      (l, i) =>
        `<text x="${xAt(i)}" y="${height - 10}" text-anchor="middle" class="mkskorder-line-axis-label">${escapeHtmlText(
          l
        )}</text>`
    )
    .join("");

  const lines = series
    .map((s) => {
      const pts = s.points.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
      const dots = s.points
        .map(
          (v, i) =>
            `<circle cx="${xAt(i)}" cy="${yAt(v)}" r="4" fill="${s.color}"><title>${escapeHtmlText(
              s.label
            )} ${labels[i]}: ${v}pt</title></circle>`
        )
        .join("");
      return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="3" />${dots}`;
    })
    .join("");

  const legend = series
    .map(
      (s) =>
        `<li><span class="mkskorder-line-swatch" style="background:${s.color}"></span><span class="mkskorder-line-legend-label">${escapeHtmlText(
          s.label
        )}</span></li>`
    )
    .join("");

  const tableRows = series
    .map(
      (s) =>
        `<tr><td>${escapeHtmlText(s.label)}</td>${s.points
          .map((v) => `<td>${v}pt</td>`)
          .join("")}</tr>`
    )
    .join("");

  return `<figure class="article-chart mkskorder-line-chart">
    <figcaption class="chart-title">📈 ${escapeHtmlText(title)}</figcaption>
    <div class="donut-chart-layout">
      <svg viewBox="0 0 ${width} ${height}" class="mkskorder-line-svg" role="img" aria-label="${escapeHtmlText(
    title
  )}: 正しい順番は9時間後でも崩れ実感35ポイントに留まるのに対し、間違った順番は75ポイントまで上がるイメージのグラフ">
        <title>正しい順番と間違った順番の崩れ実感イメージ比較</title>
        <line x1="${margin}" y1="${margin}" x2="${margin}" y2="${
    height - margin
  }" class="quadrant-axis" />
        <line x1="${margin}" y1="${height - margin}" x2="${
    width - margin
  }" y2="${height - margin}" class="quadrant-axis" />
        ${axisLabels}
        ${lines}
      </svg>
      <ul class="donut-legend">${legend}</ul>
    </div>
    <details class="chart-table-toggle">
      <summary>データを表で見る</summary>
      <table class="chart-table">
        <thead><tr><th>順番</th><th>0h</th><th>3h</th><th>6h</th><th>9h</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </details>
    <figcaption class="chart-source">※実測データではなく、体感を元にしたイメージ値の比較グラフです。</figcaption>
  </figure>`;
}

// H2見出し単位で本文を<section>に包み、背景を白⇔テーマ淡色⇔罫線カードの
// 3種で交互に変える(この記事専用。lib/hairTypeWidgets.jsのwrapHairTypeSectionsと
// 同じ設計)。charts/accordions/マスコット挿入がすべて終わったあと、最後に一度だけ実行する。
export function wrapMkskorderSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["mkskorder-section-plain", "mkskorder-section-tint", "mkskorder-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part;
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="mkskorder-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}

// 幅375pxでの横スクロールを防ぐため、本文中のGFM表(<table>)をスクロール可能な
// ラッパーで囲む(この記事専用。lib/hairTypeWidgets.jsのwrapHairTypeTablesと同じ設計。
// 共通クラスの.table-scroll-wrap/.table-scroll-noteを再利用する)。
export function wrapMkskorderTables(html) {
  return html
    .replace(
      /<table>/g,
      `<div class="table-scroll-wrap"><p class="table-scroll-note">→ 横にスクロールできます</p><table>`
    )
    .replace(/<\/table>/g, `</table></div>`);
}
