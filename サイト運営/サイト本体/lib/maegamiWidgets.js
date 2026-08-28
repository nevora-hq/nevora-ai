// 「前髪の巻き方完全ガイド」記事(content/articles/2026-08-02_前髪の巻き方完全ガイド.md)専用の
// SVG/HTML図解ウィジェット(2026-08-07 スマホ可読性リニューアル)。
// 他記事のchart type(renderBarChartHtml等)には影響を与えないよう、lib/posts.js の
// renderChartHtml から type 名で分岐して呼び出す(乾燥肌記事のlib/drySkinWidgets.jsと同じ設計方針)。
// クライアント側JS不要(静的HTML/SVG文字列)。装飾のみのSVGは aria-hidden、
// 情報を持つSVGには role="img" + <title> を付与する。

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① 手順4コマ図(ストレートアイロン編/コテ編共通)。
// tool: "iron"(ストレートアイロン) または "coil"(コテ)。stepsは4件を想定。
// 各コマに手とアイロンの角度が伝わるよう、毛束・アイロン本体・矢印を簡易図形で描く。
export function renderSteps4Html(chart) {
  const { title, tool = "iron", steps } = chart;
  if (!Array.isArray(steps) || steps.length === 0) return "";

  const panelW = 150;
  const panelH = 178;
  const gap = 10;
  const cols = steps.length;
  const width = cols * panelW + (cols - 1) * gap;
  const height = panelH;

  const panels = steps
    .map((s, i) => {
      const x0 = i * (panelW + gap);
      const cx = x0 + panelW / 2;
      // アイロン角度はコマごとに少しずつ変える(はさむ→動かす→仕上げの流れを表現)
      const angle = tool === "coil" ? [0, 90, 180, 20][i % 4] : [-25, -10, 10, 0][i % 4];
      const toolColor = tool === "coil" ? "#f08ca0" : "#423a3a";
      const strandColor = "#e9b9a0";

      // 毛束(縦のカーブ) + アイロン/コテ本体(角度をrotateで表現) + 動きの矢印
      const strand =
        tool === "coil"
          ? `<path d="M${cx - 4} 46 C ${cx + 18} 70, ${cx - 18} 90, ${cx + 10} 118" fill="none" stroke="${strandColor}" stroke-width="7" stroke-linecap="round" />`
          : `<path d="M${cx} 44 C ${cx} 70, ${cx} 96, ${cx} 122" fill="none" stroke="${strandColor}" stroke-width="7" stroke-linecap="round" />`;

      const toolShape =
        tool === "coil"
          ? `<g transform="rotate(${angle} ${cx} 60)"><rect x="${cx - 7}" y="30" width="14" height="52" rx="7" fill="${toolColor}" /><circle cx="${cx}" cy="30" r="9" fill="${toolColor}" /></g>`
          : `<g transform="rotate(${angle} ${cx} 55)"><rect x="${cx - 26}" y="46" width="52" height="14" rx="4" fill="${toolColor}" /><rect x="${cx - 30}" y="60" width="60" height="14" rx="4" fill="${toolColor}" /></g>`;

      const arrow =
        i < steps.length - 1
          ? `<line x1="${x0 + panelW - 6}" y1="80" x2="${x0 + panelW + gap + 6}" y2="80" stroke="#f08ca0" stroke-width="2.5" marker-end="url(#maegamiArrow)" />`
          : "";

      const label = escapeHtmlText(`${i + 1}. ${s.label}`);
      const detail = escapeHtmlText(s.detail || "");

      return `<g>
        <rect x="${x0}" y="0" width="${panelW}" height="${panelH}" rx="10" fill="#fff8f3" stroke="#f2d9d0" stroke-width="1.5" />
        ${strand}
        ${toolShape}
        <text x="${cx}" y="140" text-anchor="middle" class="maegami-steps-label">${label}</text>
        <text x="${cx}" y="162" text-anchor="middle" class="maegami-steps-detail">${detail}</text>
        ${arrow}
      </g>`;
    })
    .join("");

  const toolName = tool === "coil" ? "コテ" : "ストレートアイロン";
  const alt = `${toolName}で前髪を巻く4コマ手順: ${steps.map((s) => s.label).join("、")}`;

  return `<figure class="article-chart maegami-steps-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || `${toolName}での手順`)}</figcaption>
    <div class="maegami-scroll-wrap">
      <svg viewBox="0 0 ${width} ${height}" class="maegami-steps-svg" role="img" aria-label="${escapeHtmlText(alt)}">
        <title>${escapeHtmlText(alt)}</title>
        <defs>
          <marker id="maegamiArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#f08ca0" />
          </marker>
        </defs>
        ${panels}
      </svg>
    </div>
    <p class="maegami-scroll-note">→ 横にスクロールできます</p>
  </figure>`;
}

// ② 温度ダイヤル図(120〜180℃)。髪質別の推奨ゾーンを色帯の弧で示す。
export function renderTempDialHtml(chart) {
  const { title, zones } = chart;
  if (!Array.isArray(zones) || zones.length === 0) return "";

  const cx = 160;
  const cy = 150;
  const r = 110;
  const minTemp = 120;
  const maxTemp = 180;
  const startAngle = -150; // ダイヤル左端
  const endAngle = -30; // ダイヤル右端(240度分の弧を上半分に使う)

  const angleFor = (temp) =>
    startAngle + ((temp - minTemp) / (maxTemp - minTemp)) * (endAngle - startAngle);

  const polar = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };

  const arcs = zones
    .map((z) => {
      const a1 = angleFor(z.min);
      const a2 = angleFor(z.max);
      const [x1, y1] = polar(a1, r);
      const [x2, y2] = polar(a2, r);
      const largeArc = a2 - a1 > 180 ? 1 : 0;
      const midAngle = (a1 + a2) / 2;
      const [lx, ly] = polar(midAngle, r + 26);
      const label = escapeHtmlText(z.label);
      return `<g>
        <path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"
          fill="none" stroke="${z.color || "#f08ca0"}" stroke-width="18" stroke-linecap="round">
          <title>${label}: ${escapeHtmlText(`${z.min}〜${z.max}℃`)}</title>
        </path>
        <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" class="maegami-dial-zone-label">${label}</text>
      </g>`;
    })
    .join("");

  const ticks = [120, 130, 140, 150, 160, 170, 180]
    .map((t) => {
      const a = angleFor(t);
      const [x1, y1] = polar(a, r - 14);
      const [x2, y2] = polar(a, r + 4);
      const [tx, ty] = polar(a, r - 30);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#423a3a" stroke-width="1.5" /><text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" class="maegami-dial-tick">${t}</text>`;
    })
    .join("");

  const alt = `温度ダイヤル(120〜180℃): ${zones
    .map((z) => `${z.label}は${z.min}〜${z.max}℃`)
    .join("、")}`;

  return `<figure class="article-chart maegami-dial-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "髪質別の推奨温度ダイヤル")}</figcaption>
    <div class="maegami-scroll-wrap">
      <svg viewBox="0 0 320 190" class="maegami-dial-svg" role="img" aria-label="${escapeHtmlText(alt)}">
        <title>${escapeHtmlText(alt)}</title>
        ${ticks}
        ${arcs}
        <circle cx="${cx}" cy="${cy}" r="6" fill="#423a3a" />
        <text x="${cx}" y="${cy + 34}" text-anchor="middle" class="maegami-dial-caption">単位: ℃</text>
      </svg>
    </div>
    <p class="maegami-scroll-note">→ 横にスクロールできます</p>
  </figure>`;
}

// ③ 温度トレードオフ曲線グラフ。横軸=温度、縦軸(2本)=カールの持ちの良さ/ダメージリスク。
// 交点付近(推奨温度帯)をハイライトする。
export function renderTradeoffCurveHtml(chart) {
  const { title, points, highlightMin, highlightMax } = chart;
  if (!Array.isArray(points) || points.length === 0) return "";

  const width = 560;
  const height = 260;
  const padTop = 24;
  const padBottom = 40;
  const padLeft = 44;
  const padRight = 20;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const temps = points.map((p) => p.temp);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const xFor = (t) => padLeft + ((t - minT) / (maxT - minT)) * plotW;
  const yFor = (v) => padTop + plotH - (v / 100) * plotH;

  const linePoints = (key) =>
    points.map((p) => `${xFor(p.temp).toFixed(1)},${yFor(p[key]).toFixed(1)}`).join(" ");

  const dots = (key, color) =>
    points
      .map(
        (p) =>
          `<circle cx="${xFor(p.temp).toFixed(1)}" cy="${yFor(p[key]).toFixed(1)}" r="3.5" fill="${color}"><title>${p.temp}℃: ${p[key]}</title></circle>`
      )
      .join("");

  const xLabels = points
    .map(
      (p) =>
        `<text x="${xFor(p.temp).toFixed(1)}" y="${height - 14}" text-anchor="middle" class="maegami-tradeoff-xlabel">${p.temp}℃</text>`
    )
    .join("");

  const highlight =
    typeof highlightMin === "number" && typeof highlightMax === "number"
      ? `<rect x="${xFor(highlightMin).toFixed(1)}" y="${padTop}" width="${(
          xFor(highlightMax) - xFor(highlightMin)
        ).toFixed(1)}" height="${plotH}" fill="#f08ca0" opacity="0.13" />`
      : "";

  const alt = `${title || "温度とカールの持ち・ダメージリスクの関係"}。温度が上がるほどカールは持ちやすくダメージリスクも上がる傾向で、推奨温度帯は${
    highlightMin || ""
  }〜${highlightMax || ""}℃付近`;

  return `<figure class="article-chart maegami-tradeoff-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "温度とカールの持ち・ダメージリスクの関係")}</figcaption>
    <div class="maegami-scroll-wrap">
      <svg viewBox="0 0 ${width} ${height}" class="maegami-tradeoff-svg" role="img" aria-label="${escapeHtmlText(alt)}">
        <title>${escapeHtmlText(alt)}</title>
        ${highlight}
        <line x1="${padLeft}" y1="${padTop + plotH}" x2="${width - padRight}" y2="${padTop + plotH}" stroke="#c9c1bd" stroke-width="1.5" />
        <line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${padTop + plotH}" stroke="#c9c1bd" stroke-width="1.5" />
        <polyline points="${linePoints("hold")}" fill="none" stroke="#f08ca0" stroke-width="2.5" />
        <polyline points="${linePoints("damage")}" fill="none" stroke="#423a3a" stroke-width="2.5" stroke-dasharray="5 4" />
        ${dots("hold", "#f08ca0")}
        ${dots("damage", "#423a3a")}
        ${xLabels}
      </svg>
    </div>
    <ul class="maegami-tradeoff-legend">
      <li><span class="maegami-legend-swatch" style="background:#f08ca0"></span>カールの持ちやすさ(目安)</li>
      <li><span class="maegami-legend-swatch maegami-legend-swatch-dash"></span>ダメージリスク(目安)</li>
    </ul>
    <p class="maegami-scroll-note">→ 横にスクロールできます</p>
    <p class="maegami-diagram-note">※実測データではなく、一般的な傾向を示すイメージ図です。網かけ部分が推奨温度帯の目安です。</p>
  </figure>`;
}

// ④ トラブル対応マトリクス図。「割れる/浮く/はねる」×原因×対処を1枚の表で示す。
export function renderTroubleMatrixHtml(chart) {
  const { title, rows } = chart;
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const body = rows
    .map(
      (r) => `<tr>
        <th scope="row"><span class="maegami-matrix-symptom">${escapeHtmlText(r.icon || "")} ${escapeHtmlText(r.symptom)}</span></th>
        <td>${escapeHtmlText(r.cause)}</td>
        <td>${escapeHtmlText(r.fix)}</td>
      </tr>`
    )
    .join("");

  return `<figure class="maegami-matrix">
    <figcaption class="chart-title">${escapeHtmlText(title || "前髪トラブル対応マトリクス")}</figcaption>
    <div class="maegami-scroll-wrap">
      <table class="maegami-matrix-table">
        <caption class="sr-only">${escapeHtmlText(title || "前髪トラブル対応マトリクス")}(症状・原因・対処の一覧)</caption>
        <thead><tr><th scope="col">症状</th><th scope="col">原因</th><th scope="col">対処</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    <p class="maegami-scroll-note">→ 横にスクロールできます</p>
  </figure>`;
}

// ⑤ ⚠️注意ボックス。frontmatterのcalloutBoxesから生成。
export function renderCalloutBoxHtml(box) {
  const { type = "warning", title, items } = box;
  const icon = type === "tip" ? "💡" : "⚠️";
  const cls = type === "tip" ? "maegami-callout-tip" : "maegami-callout-warning";
  const list = Array.isArray(items)
    ? `<ul>${items.map((it) => `<li>${escapeHtmlText(it)}</li>`).join("")}</ul>`
    : `<p>${escapeHtmlText(items)}</p>`;

  return `<div class="maegami-callout ${cls}">
    <p class="maegami-callout-title"><span aria-hidden="true">${icon}</span> ${escapeHtmlText(title || (type === "tip" ? "ポイント" : "注意"))}</p>
    ${list}
  </div>`;
}

// ⑥ ✅チェックリスト。frontmatterのchecklistsから生成(装飾のみ、実際のチェック機能はなし)。
export function renderChecklistHtml(checklist) {
  const { title, items } = checklist;
  if (!Array.isArray(items) || items.length === 0) return "";

  const rows = items
    .map(
      (it) =>
        `<li class="maegami-check-item"><span class="maegami-check-box" aria-hidden="true">☐</span><span>${escapeHtmlText(it)}</span></li>`
    )
    .join("");

  return `<div class="maegami-checklist">
    <p class="maegami-checklist-title">✅ ${escapeHtmlText(title || "チェックリスト")}</p>
    <ul class="maegami-checklist-list">${rows}</ul>
  </div>`;
}

// ⑦ まとめカード。frontmatterのconclusionCardsから生成。結論3行+次の一歩+関連記事リンク。
export function renderConclusionCardHtml(card) {
  const { conclusions, nextStep, relatedLinks } = card;
  const conclusionList = Array.isArray(conclusions)
    ? `<ul class="maegami-conclusion-list">${conclusions
        .map((c) => `<li>${escapeHtmlText(c)}</li>`)
        .join("")}</ul>`
    : "";
  const nextStepHtml = nextStep
    ? `<p class="maegami-conclusion-next"><span class="maegami-badge">次の一歩</span>${escapeHtmlText(nextStep)}</p>`
    : "";
  const linksHtml =
    Array.isArray(relatedLinks) && relatedLinks.length > 0
      ? `<ul class="maegami-conclusion-links">${relatedLinks
          .map(
            (l) =>
              `<li><a href="${escapeHtmlText(l.url)}">${escapeHtmlText(l.label)} →</a></li>`
          )
          .join("")}</ul>`
      : "";

  return `<div class="maegami-conclusion-card">
    <p class="maegami-conclusion-heading">📝 まとめ</p>
    ${conclusionList}
    ${nextStepHtml}
    ${linksHtml}
  </div>`;
}

// ⑧ 冒頭「30秒でわかる」サマリーカード。結論3行+こんな人向け3項目。
export function renderQuickSummaryCardHtml(data) {
  const { conclusions, targets } = data;
  const conclusionList = Array.isArray(conclusions)
    ? `<ul class="maegami-quicksummary-list">${conclusions
        .map((c) => `<li>${escapeHtmlText(c)}</li>`)
        .join("")}</ul>`
    : "";
  const targetList = Array.isArray(targets)
    ? `<ul class="maegami-quicksummary-targets">${targets
        .map((t) => `<li>${escapeHtmlText(t)}</li>`)
        .join("")}</ul>`
    : "";

  return `<div class="maegami-quicksummary">
    <p class="maegami-quicksummary-heading">⏱ 30秒でわかるこの記事の結論</p>
    ${conclusionList}
    <p class="maegami-quicksummary-subheading">こんな人向け</p>
    ${targetList}
  </div>`;
}
