// 「大人のあせも、なぜできる?原因・ニキビとの見分け方・セルフケアと皮膚科受診の目安」記事
// (content/articles/2026-08-08_大人の汗疹あせも対策.md)専用のSVG/HTML図解ウィジェット
// (2026-08-08 スマホ可読性リニューアル)。他記事のchart type(renderBarChartHtml等)には
// 影響を与えないよう、lib/posts.js の renderChartHtml から type 名で分岐して呼び出す
// (頭皮記事のlib/kayumiScalpWidgets.jsと同じ設計方針)。クライアント側JS不要(静的HTML/SVG文字列)。
// 装飾のみのSVGは aria-hidden、情報を持つSVGには role="img" + <title> を付与する。
// テーマカラー: コーラルオレンジ#E8734F(炎症・warning) + クリームピーチ#FFF3EA(背景) +
// チャコールブラウン#4A3F38(テキスト) + セージグリーン#7FA98B(ケア・回復を示すアクセント)。

export const ASEMO_SLUG = "2026-08-08_大人の汗疹あせも対策";

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① 汗腺の詰まり・炎症メカニズム断面図(chart type: "asemoSweatGlandCrossSection")。
// 「正常→汗腺に汚れ・角質が詰まる→周囲に汗が漏れて炎症する」の3段階を横並びで描く。
export function renderSweatGlandCrossSectionHtml(chart) {
  const { title } = chart || {};
  const alt =
    "汗腺の詰まりと炎症が進む3段階の断面図。①正常な状態は汗腺がまっすぐ通り汗がスムーズに排出される。②角質や汚れで汗腺の出口が詰まる。③詰まった部分の周囲に汗が漏れ出して炎症し赤いブツブツになる。";

  function stage(x, kind) {
    const isNormal = kind === "normal";
    const isClogged = kind === "clogged";
    const skinColor = "#f9e4d6";
    const ductColor = isNormal ? "#f2c9a8" : "#d9a67a";
    const clogColor = "#c98a5a";
    const inflame = isClogged
      ? ""
      : kind === "inflamed"
      ? `<circle cx="${x + 45}" cy="38" r="10" fill="#e8734f" opacity="0.55"/>
         <circle cx="${x + 45}" cy="38" r="5" fill="#e8734f"/>`
      : "";
    const clog = isClogged || kind === "inflamed"
      ? `<circle cx="${x + 45}" cy="66" r="6" fill="${clogColor}" stroke="#7a4a26" stroke-width="1"/>`
      : "";
    const sweatDrop = isNormal
      ? `<circle cx="${x + 45}" cy="28" r="3.5" fill="#9fd0e8" stroke="#4c96b8" stroke-width="1"/>`
      : "";

    return `<g>
      <rect x="${x}" y="24" width="90" height="110" rx="8" fill="${skinColor}" stroke="#4a3f38" stroke-width="1.2"/>
      <path d="M${x + 45} 114 v-70" stroke="${ductColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
      ${sweatDrop}
      ${clog}
      ${inflame}
      <text x="${x + 45}" y="126" text-anchor="middle" class="asemo-diagram-label">${
        isNormal ? "汗腺が通っている" : isClogged ? "角質・汚れで詰まる" : "汗が漏れて炎症"
      }</text>
    </g>`;
  }

  return `<figure class="asemo-figure asemo-crosssection-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "汗腺の詰まりからあせもができるまで")}</figcaption>
    <svg viewBox="0 0 300 146" class="asemo-crosssection-svg" role="img" aria-label="${escapeHtmlText(
      alt
    )}"><title>${escapeHtmlText(alt)}</title>
      ${stage(5, "normal")}
      ${stage(105, "clogged")}
      ${stage(205, "inflamed")}
      <text x="50" y="13" text-anchor="middle" class="asemo-diagram-heading">①正常</text>
      <text x="150" y="13" text-anchor="middle" class="asemo-diagram-heading">②詰まる</text>
      <text x="250" y="13" text-anchor="middle" class="asemo-diagram-heading">③炎症</text>
    </svg>
    <p class="asemo-diagram-caption">汗をかく量が多い・蒸れる環境が続くと、汗腺の出口が角質や汚れでふさがれ、逃げ場を失った汗が周囲の皮膚に漏れ出して炎症を起こします。</p>
  </figure>`;
}

// ② セルフ診断フロー(chart type: "asemoDiagnosisFlow")。
// 「かゆみの有無」「見た目(赤い小さな粒/白い芯/ジュクジュク)」であせも・ニキビ・湿疹を判定。
export function renderDiagnosisFlowHtml(chart) {
  const { title } = chart || {};
  const alt =
    "診断フロー: 汗をかいた直後にできた赤く小さいブツブツで首やひじの内側など汗のたまる場所にあれば、あせもの可能性が高い。白い芯があり皮脂の多い部分にできていればニキビの可能性が高い。ジュクジュクして境界がはっきりしない、特定の物に触れた後にできていれば、湿疹(かぶれ)の可能性が高い。判断に迷う場合や広がる場合は皮膚科を受診する。";

  return `<figure class="asemo-figure asemo-flow-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "あせも・ニキビ・湿疹 セルフ診断フロー")}</figcaption>
    <svg viewBox="0 0 220 358" class="asemo-flow-svg" role="img" aria-label="${escapeHtmlText(
      alt
    )}"><title>${escapeHtmlText(alt)}</title>
      <rect x="35" y="6" width="150" height="40" rx="8" fill="#4a3f38"/>
      <text x="110" y="22" text-anchor="middle" class="asemo-flow-node-text-light">どんなブツブツ?</text>
      <text x="110" y="37" text-anchor="middle" class="asemo-flow-node-text-light">できた場所と見た目を確認</text>

      <line x1="110" y1="46" x2="110" y2="64" stroke="#4a3f38" stroke-width="2"/>

      <rect x="2" y="64" width="100" height="52" rx="8" fill="#fdece3" stroke="#e8734f" stroke-width="1.4"/>
      <text x="52" y="82" text-anchor="middle" class="asemo-flow-node-text">汗をかいた直後</text>
      <text x="52" y="97" text-anchor="middle" class="asemo-flow-node-text">首・ひじ内側などに</text>
      <text x="52" y="112" text-anchor="middle" class="asemo-flow-node-text">赤く小さい粒</text>

      <rect x="118" y="64" width="100" height="52" rx="8" fill="#fef3e2" stroke="#d9a63a" stroke-width="1.4"/>
      <text x="168" y="82" text-anchor="middle" class="asemo-flow-node-text">皮脂の多い部分</text>
      <text x="168" y="97" text-anchor="middle" class="asemo-flow-node-text">白い芯や</text>
      <text x="168" y="112" text-anchor="middle" class="asemo-flow-node-text">黒ずみがある</text>

      <line x1="52" y1="116" x2="52" y2="132" stroke="#e8734f" stroke-width="2"/>
      <rect x="2" y="132" width="100" height="40" rx="8" fill="#e8734f"/>
      <text x="52" y="150" text-anchor="middle" class="asemo-flow-node-text-light">あせもの可能性</text>
      <text x="52" y="165" text-anchor="middle" class="asemo-flow-node-text-light">が高い</text>

      <line x1="168" y1="116" x2="168" y2="132" stroke="#d9a63a" stroke-width="2"/>
      <rect x="118" y="132" width="100" height="40" rx="8" fill="#d9a63a"/>
      <text x="168" y="150" text-anchor="middle" class="asemo-flow-node-text-light">ニキビの可能性</text>
      <text x="168" y="165" text-anchor="middle" class="asemo-flow-node-text-light">が高い</text>

      <rect x="2" y="196" width="100" height="52" rx="8" fill="#eef6f0" stroke="#7fa98b" stroke-width="1.4"/>
      <text x="52" y="214" text-anchor="middle" class="asemo-flow-node-text">特定の物に触れた後</text>
      <text x="52" y="229" text-anchor="middle" class="asemo-flow-node-text">ジュクジュク・境界が</text>
      <text x="52" y="244" text-anchor="middle" class="asemo-flow-node-text">はっきりしない</text>

      <line x1="52" y1="248" x2="52" y2="264" stroke="#7fa98b" stroke-width="2"/>
      <rect x="2" y="264" width="100" height="40" rx="8" fill="#7fa98b"/>
      <text x="52" y="282" text-anchor="middle" class="asemo-flow-node-text-light">湿疹(かぶれ)の</text>
      <text x="52" y="297" text-anchor="middle" class="asemo-flow-node-text-light">可能性が高い</text>

      <text x="110" y="332" text-anchor="middle" class="asemo-diagram-label">迷う・広がる・膿む場合は</text>
      <text x="110" y="345" text-anchor="middle" class="asemo-diagram-label">自己判断せず皮膚科へ相談を</text>
    </svg>
  </figure>`;
}

// ③ セルフケア5ステップ手順図(chart type: "asemoCareSteps")。
// items: [{step, note}]。頭皮記事のrenderWashStepsHtmlと同じ構造。
export function renderCareStepsHtml(chart) {
  const { title, items } = chart || {};
  if (!Array.isArray(items) || items.length === 0) return "";

  const rowH = 46;
  const width = 300;
  const height = items.length * rowH + 16;

  const rows = items
    .map((it, i) => {
      const y = 10 + i * rowH;
      const label = escapeHtmlText(it.step);
      const note = escapeHtmlText(it.note);
      return `<g>
        <circle cx="20" cy="${y + 17}" r="14" fill="#e8734f"/>
        <text x="20" y="${y + 22}" text-anchor="middle" class="asemo-step-num">${i + 1}</text>
        <text x="44" y="${y + 13}" class="asemo-step-text">${label}</text>
        <text x="44" y="${y + 30}" class="asemo-step-note">${note}</text>
      </g>`;
    })
    .join("");

  const alt = `セルフケア${items.length}ステップ: ${items
    .map((it, i) => `${i + 1}. ${it.step}(${it.note})`)
    .join("、")}`;

  return `<figure class="asemo-figure asemo-steps-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "セルフケア5ステップ")}</figcaption>
    <svg viewBox="0 0 ${width} ${height}" class="asemo-steps-svg" role="img" aria-label="${escapeHtmlText(
    alt
  )}"><title>${escapeHtmlText(alt)}</title>${rows}</svg>
  </figure>`;
}

// ④ あせも/ニキビ/湿疹の見分け方カード比較(chart type: "asemoCompareCards")。
// rows: [{label, cause, appearance, itch, spot}] を横スクロール対応のカード列として表示する。
export function renderCompareCardsHtml(chart) {
  const { title, rows } = chart || {};
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const accentByLabel = {
    あせも: "#e8734f",
    ニキビ: "#d9a63a",
    湿疹: "#7fa98b",
  };

  const cards = rows
    .map((r) => {
      const accent = accentByLabel[r.label] || "#e8734f";
      return `<div class="asemo-compare-card" style="border-top-color:${accent}">
        <p class="asemo-compare-card-title" style="color:${accent}">${escapeHtmlText(r.label)}</p>
        <dl class="asemo-compare-card-list">
          <dt>できる原因</dt><dd>${escapeHtmlText(r.cause)}</dd>
          <dt>見た目</dt><dd>${escapeHtmlText(r.appearance)}</dd>
          <dt>かゆみ・痛み</dt><dd>${escapeHtmlText(r.itch)}</dd>
          <dt>できやすい部位</dt><dd>${escapeHtmlText(r.spot)}</dd>
        </dl>
      </div>`;
    })
    .join("");

  return `<figure class="asemo-figure asemo-compare-cards-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "あせも・ニキビ・湿疹の見分け方")}</figcaption>
    <p class="asemo-scroll-hint">→ 横にスクロールできます</p>
    <div class="asemo-compare-cards-wrap">${cards}</div>
  </figure>`;
}

// ✅ 今日からできるチェックリスト(chart type: "asemoChecklist")。items: string[]
export function renderChecklistHtml(chart) {
  const { title = "今日からできるチェックリスト", items } = chart || {};
  const list = (Array.isArray(items) ? items : [])
    .map((item) => `<li>${escapeHtmlText(item)}</li>`)
    .join("");

  return `<div class="asemo-checklist">
    <p class="asemo-checklist-title">✅ ${escapeHtmlText(title)}</p>
    <ul>${list}</ul>
  </div>`;
}

// 記事末の「まとめカード」(chart type: "asemoSummaryCard")。
// conclusion: string[] / nextStep: string / links: [{label, url}]
export function renderSummaryCardHtml(chart) {
  const { conclusion, nextStep, links } = chart || {};
  const conclusionItems = (Array.isArray(conclusion) ? conclusion : [])
    .map((c) => `<li>${escapeHtmlText(c)}</li>`)
    .join("");
  const linkItems = (Array.isArray(links) ? links : [])
    .map((l) => `<li><a href="${escapeHtmlText(l.url)}">${escapeHtmlText(l.label)}</a></li>`)
    .join("");

  return `<div class="asemo-summary-card">
    <h3>結論はこの3つ</h3>
    <ul>${conclusionItems}</ul>
    ${nextStep ? `<h3>今日の次の一歩</h3><p>${escapeHtmlText(nextStep)}</p>` : ""}
    ${linkItems ? `<h3>あわせて読みたい記事</h3><ul>${linkItems}</ul>` : ""}
  </div>`;
}

// 幅の広い表を横スクロール対応でラップする(lib/kayumiScalpWidgets.jsのwrapKssTablesと同じ設計)。
export function wrapAsemoTables(html) {
  return html
    .replace(
      /<table>/g,
      `<div class="table-scroll-wrap"><p class="table-scroll-note">→ 横にスクロールできます</p><table>`
    )
    .replace(/<\/table>/g, `</table></div>`);
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。charts/accordions/マスコットの挿入がすべて終わったあと、
// 最後に一度だけ実行する(lib/kayumiScalpWidgets.jsのwrapKssSectionsと同じ設計)。
export function wrapAsemoSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["asemo-section-plain", "asemo-section-tint", "asemo-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part;
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="asemo-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}

// 折りたたみ式の絵文字付き目次を記事冒頭に追加する(lib/kayumiScalpWidgets.js等と同じ設計)。
export function renderAsemoTocHtml(toc) {
  if (!Array.isArray(toc) || toc.length === 0) return "";
  const items = toc
    .filter((t) => t.level === 2)
    .map(
      (t) =>
        `<li class="asemo-toc-item"><a href="#${escapeHtmlText(t.id)}"><span class="asemo-toc-emoji" aria-hidden="true">🩹</span>${escapeHtmlText(
          t.text
        )}</a></li>`
    )
    .join("");

  return `<details class="asemo-toc">
    <summary>📖 目次</summary>
    <ul class="asemo-toc-list">${items}</ul>
  </details>`;
}
