// 記事「【タイプ別】ティント・口紅・グロス、落ちにくい&マスクに付きにくいリップ比較」
// (content/articles/2026-07-26_リップ比較.md)専用のレンダリング処理をまとめたファイル。
// lib/posts.js の renderChartHtml から chart.type に応じて呼び出される追加分岐と、
// この記事のslugのときだけ実行するセクション分割・独自目次の処理を提供する。
// 他記事の描画・既存chartタイプ(bar/stat/donut/prosCons/quadrant)の挙動には一切影響しない。

import { pickHeadingEmoji } from "./tocEmoji";

export const LIP_COMPARE_SLUG = "2026-07-26_リップ比較";

const THEME = {
  rose: "#D6456B",
  beige: "#E5C5B5",
  bordeaux: "#6E1F35",
};

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① 断面比較図: ティント/口紅/グロスで、着色層が唇のどの位置にあるかをSVGで示す。
export function renderLipCrossSectionHtml(chart) {
  const { title, source, sourceUrl } = chart || {};

  const types = [
    {
      name: "ティント",
      color: THEME.rose,
      desc: "角質層に染み込む",
      // 層は唇の表面より少し内側(染み込むイメージ)
      layerInside: true,
    },
    {
      name: "口紅",
      color: THEME.bordeaux,
      desc: "表面に油分膜が乗る",
      layerInside: false,
      layerThickness: 8,
    },
    {
      name: "グロス",
      color: THEME.beige,
      desc: "厚い透明層がのる",
      layerInside: false,
      layerThickness: 20,
    },
  ];

  const panelW = 120;
  const panelH = 200;
  const gap = 10;
  const totalW = panelW * 3 + gap * 2;

  const panels = types
    .map((t, i) => {
      const ox = i * (panelW + gap);
      // 唇本体(下地)の断面形状。上端を「唇の表面ライン」とする。
      const surfaceY = 70;
      const lipPath = `M ${ox + 20} ${surfaceY} C ${ox + 20} ${surfaceY - 14}, ${ox + 100} ${surfaceY - 14}, ${
        ox + 100
      } ${surfaceY} L ${ox + 96} ${surfaceY + 60} C ${ox + 96} ${surfaceY + 74}, ${ox + 24} ${surfaceY + 74}, ${
        ox + 24
      } ${surfaceY + 60} Z`;

      let layerShape = "";
      if (t.layerInside) {
        // ティント: 表面のすぐ下、唇組織の中に染み込んだ層として点線の帯で表現
        layerShape = `<path d="M ${ox + 24} ${surfaceY + 6} C ${ox + 24} ${surfaceY - 2}, ${ox + 96} ${surfaceY - 2}, ${
          ox + 96
        } ${surfaceY + 6}" fill="none" stroke="${t.color}" stroke-width="6" stroke-dasharray="3 3" stroke-linecap="round" />`;
      } else {
        const th = t.layerThickness;
        layerShape = `<path d="M ${ox + 20} ${surfaceY - th} C ${ox + 20} ${surfaceY - th - 6}, ${ox + 100} ${
          surfaceY - th - 6
        }, ${ox + 100} ${surfaceY - th} L ${ox + 100} ${surfaceY} C ${ox + 100} ${surfaceY - 6}, ${ox + 20} ${
          surfaceY - 6
        }, ${ox + 20} ${surfaceY} Z" fill="${t.color}" fill-opacity="0.75" />`;
      }

      return `<g>
        <path d="${lipPath}" fill="#f6d9d3" stroke="#c98f86" stroke-width="1.5" />
        <line x1="${ox + 16}" y1="${surfaceY}" x2="${ox + 104}" y2="${surfaceY}" stroke="#8a5a52" stroke-width="1" stroke-dasharray="2 2" />
        ${layerShape}
        <text x="${ox + panelW / 2}" y="${surfaceY + 96}" text-anchor="middle" class="lip-cross-name">${escapeHtmlText(
          t.name
        )}</text>
        <text x="${ox + panelW / 2}" y="${surfaceY + 114}" text-anchor="middle" class="lip-cross-desc">${escapeHtmlText(
          t.desc
        )}</text>
      </g>`;
    })
    .join("");

  const sourceHtml = source
    ? `<figcaption class="chart-source">${
        sourceUrl
          ? `出典: <a href="${escapeHtmlText(sourceUrl)}" target="_blank" rel="nofollow noopener noreferrer">${escapeHtmlText(
              source
            )}</a>`
          : `出典: ${escapeHtmlText(source)}`
      }</figcaption>`
    : "";

  return `<figure class="article-chart lip-cross-section">
    <figcaption class="chart-title">${escapeHtmlText(title || "タイプ別 唇断面イメージ")}</figcaption>
    <div class="lip-scroll-wrap">
      <svg viewBox="0 0 ${totalW} ${panelH}" class="lip-cross-svg" role="img" aria-label="${escapeHtmlText(
    title || "ティント・口紅・グロスの断面比較"
  )}"><title>ティント・口紅・グロスの断面比較</title>${panels}</svg>
    </div>
    <p class="lip-cross-note">点線は唇の表面ライン。色の帯が「表面より内側(染み込む)」か「表面の上に乗る」かで、落ち方の傾向が変わります。→ 横にスクロールできます</p>
    ${sourceHtml}
  </figure>`;
}

// ② レーダーチャート: 5軸(落ちにくさ・保湿力・発色・マスク付着しにくさ・塗り直しやすさ)で
// ティント/口紅/グロスを重ねて比較する。
export function renderRadarChartHtml(chart) {
  const { title, axes, series, source, sourceUrl } = chart || {};
  if (!Array.isArray(axes) || axes.length === 0 || !Array.isArray(series)) return "";

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const n = axes.length;

  const anglePoint = (index, ratio) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / n;
    return {
      x: center + Math.cos(angle) * radius * ratio,
      y: center + Math.sin(angle) * radius * ratio,
    };
  };

  const ringLevels = [0.25, 0.5, 0.75, 1];
  const rings = ringLevels
    .map((ratio) => {
      const pts = axes.map((_, i) => anglePoint(i, ratio)).map((p) => `${p.x},${p.y}`).join(" ");
      return `<polygon points="${pts}" class="radar-ring" />`;
    })
    .join("");

  const axisLines = axes
    .map((_, i) => {
      const p = anglePoint(i, 1);
      return `<line x1="${center}" y1="${center}" x2="${p.x}" y2="${p.y}" class="radar-axis-line" />`;
    })
    .join("");

  const axisLabels = axes
    .map((label, i) => {
      const p = anglePoint(i, 1.18);
      return `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" class="radar-axis-label">${escapeHtmlText(
        label
      )}</text>`;
    })
    .join("");

  const polygons = series
    .map((s) => {
      const pts = s.values
        .map((v, i) => anglePoint(i, Math.max(0, Math.min(100, Number(v) || 0)) / 100))
        .map((p) => `${p.x},${p.y}`)
        .join(" ");
      return `<polygon points="${pts}" fill="${s.color}" fill-opacity="0.22" stroke="${s.color}" stroke-width="2.5" />`;
    })
    .join("");

  const legend = series
    .map(
      (s) =>
        `<li><span class="radar-swatch" style="background:${s.color}"></span>${escapeHtmlText(s.name)}</li>`
    )
    .join("");

  const tableHead = `<tr><th>タイプ</th>${axes.map((a) => `<th>${escapeHtmlText(a)}</th>`).join("")}</tr>`;
  const tableRows = series
    .map(
      (s) =>
        `<tr><td>${escapeHtmlText(s.name)}</td>${s.values
          .map((v) => `<td>${escapeHtmlText(String(v))}</td>`)
          .join("")}</tr>`
    )
    .join("");

  const sourceHtml = source
    ? `<figcaption class="chart-source">${
        sourceUrl
          ? `出典: <a href="${escapeHtmlText(sourceUrl)}" target="_blank" rel="nofollow noopener noreferrer">${escapeHtmlText(
              source
            )}</a>`
          : `出典: ${escapeHtmlText(source)}`
      }</figcaption>`
    : "";

  return `<figure class="article-chart lip-radar-chart">
    <figcaption class="chart-title">${escapeHtmlText(title || "5軸比較レーダーチャート")}</figcaption>
    <svg viewBox="0 0 ${size} ${size}" class="radar-svg" role="img" aria-label="${escapeHtmlText(
    title || "タイプ別5軸比較"
  )}"><title>タイプ別5軸比較レーダーチャート</title>${rings}${axisLines}${polygons}${axisLabels}</svg>
    <ul class="radar-legend">${legend}</ul>
    <details class="chart-table-toggle"><summary>データを表で見る</summary><table class="chart-table"><thead>${tableHead}</thead><tbody>${tableRows}</tbody></table></details>
    ${sourceHtml}
  </figure>`;
}

// ④ 商品比較表: 色チップ付きの横スクロール表(6点)。
export function renderProductTableHtml(chart) {
  const { title, rows } = chart || {};
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const bodyRows = rows
    .map((r) => {
      const chip = `<svg viewBox="0 0 18 18" width="16" height="16" class="lip-color-chip" role="img" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="${escapeHtmlText(
        r.color || "#ccc"
      )}" stroke="#fff" stroke-width="1.5" /></svg>`;
      return `<tr><td class="lip-product-name-cell">${chip}<span>${escapeHtmlText(r.name)}</span></td><td>${escapeHtmlText(
        r.type
      )}</td><td>${escapeHtmlText(r.holdTime)}</td><td>${escapeHtmlText(r.moisture)}</td><td>${escapeHtmlText(
        r.maskStick
      )}</td><td>${escapeHtmlText(r.removal)}</td><td>${escapeHtmlText(r.price)}</td></tr>`;
    })
    .join("");

  return `<figure class="article-chart lip-product-table-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "商品比較表")}</figcaption>
    <p class="lip-scroll-hint">→ 横にスクロールできます</p>
    <div class="lip-scroll-wrap">
      <table class="lip-product-table">
        <thead><tr><th>商品名</th><th>タイプ</th><th>色持ち時間の目安</th><th>保湿感</th><th>マスク付着</th><th>落としやすさ</th><th>価格帯目安</th></tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  </figure>`;
}

// ⑤ 手順図: マスクに付きにくくする塗り方4ステップをSVGアイコン付きで示す。
export function renderStepGuideHtml(chart) {
  const { title, steps } = chart || {};
  if (!Array.isArray(steps) || steps.length === 0) return "";

  const icons = [
    // ①下準備(ティッシュ)
    `<path d="M10 8h20v24l-5 4-5-4-5 4-5-4z" fill="#fff" stroke="#B98B82" stroke-width="1.5" /><line x1="14" y1="14" x2="26" y2="14" stroke="#D6C3BE" stroke-width="1.2" /><line x1="14" y1="19" x2="26" y2="19" stroke="#D6C3BE" stroke-width="1.2" />`,
    // ②塗る(リップ+輪郭線)
    `<path d="M8 24c4-10 24-10 28 0-4 8-24 8-28 0z" fill="#F6D9D3" stroke="#B98B82" stroke-width="1.5" /><path d="M10 23c4-6 24-6 28 0" fill="none" stroke="${THEME.rose}" stroke-width="2.5" stroke-linecap="round" />`,
    // ③ティッシュオフ(押さえる動き)
    `<rect x="9" y="12" width="22" height="16" rx="2" fill="#fff" stroke="#B98B82" stroke-width="1.5" /><path d="M20 6v10" stroke="#B98B82" stroke-width="1.5" stroke-linecap="round" /><path d="M14 6l6 6 6-6" fill="none" stroke="#B98B82" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`,
    // ④パウダー重ね(パフ+きらきら)
    `<circle cx="20" cy="20" r="11" fill="#F3E6DF" stroke="#B98B82" stroke-width="1.5" /><circle cx="15" cy="10" r="1.6" fill="${THEME.beige}" /><circle cx="27" cy="12" r="1.2" fill="${THEME.beige}" /><circle cx="30" cy="22" r="1.4" fill="${THEME.beige}" />`,
  ];

  const items = steps
    .map((s, i) => {
      const icon = icons[i % icons.length];
      return `<li class="lip-step-item">
        <svg viewBox="0 0 40 40" width="56" height="56" class="lip-step-icon" role="img" aria-hidden="true">${icon}</svg>
        <div class="lip-step-body">
          <p class="lip-step-title"><span class="lip-step-num">${i + 1}</span>${escapeHtmlText(s.title)}</p>
          <p class="lip-step-desc">${escapeHtmlText(s.desc)}</p>
        </div>
      </li>`;
    })
    .join("");

  return `<figure class="article-chart lip-step-guide">
    <figcaption class="chart-title">${escapeHtmlText(title || "塗り方4ステップ")}</figcaption>
    <ol class="lip-step-list">${items}</ol>
  </figure>`;
}

function stripTags(text) {
  return String(text || "").replace(/<[^>]+>/g, "").trim();
}

const TOC_EMOJI_BY_KEYWORD = [
  [/失敗|縁だけ/, "😢"],
  [/なぜ|仕組み/, "🔍"],
  [/選び方|基準/, "🧭"],
  [/おすすめ|商品/, "💄"],
  [/塗り方|マスク/, "✋"],
  [/比較|まとめ/, "📊"],
  [/よくある質問|FAQ/i, "❓"],
];

// ② 目次: <details>で折りたたみ、各項目に絵文字を付けた、この記事専用の目次ブロック。
// 既存の共通コンポーネント(components/ArticleToc.js)は他記事にも使われているため
// 変更せず、この記事だけ本文HTMLの先頭に独自の目次を追加する。
export function renderLipTocHtml(toc) {
  if (!Array.isArray(toc) || toc.length === 0) return "";
  const items = toc
    .filter((item) => item.level === 2)
    .map((item) => {
      const emoji = pickHeadingEmoji(stripTags(item.text), TOC_EMOJI_BY_KEYWORD);
      const emojiSpan = emoji
        ? `<span class="lip-toc-emoji" aria-hidden="true">${emoji}</span>`
        : "";
      return `<li class="lip-toc-item"><a href="#${item.id}">${emojiSpan}${escapeHtmlText(item.text)}</a></li>`;
    })
    .join("");

  return `<details class="lip-toc" open><summary>📖 目次(タップで開閉)</summary><ol class="lip-toc-list">${items}</ol></details>`;
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。見出しの直前で区切るため、charts/accordions/
// マスコットの挿入がすべて終わったあと、最後に一度だけ実行する。
export function wrapLipCompareSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["lip-section-plain", "lip-section-tint", "lip-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part; // 最初のh2より前(独自目次など)はそのまま
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="lip-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}
