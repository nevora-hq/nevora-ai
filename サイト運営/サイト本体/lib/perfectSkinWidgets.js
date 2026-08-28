// 「普通肌におすすめの美容成分」記事(2026-08-05_普通肌におすすめの美容成分.md)専用の
// 図解タイプ(chart type: "pyramid" / "calendarBand")。他記事では使用しない想定だが、
// type名で分岐するため他記事のchart処理には影響しない(lib/posts.jsのrenderChartHtml参照)。
// lib/drySkinWidgets.js・lib/lipCompareExtras.js と同じ「記事専用ウィジェットは
// 別ファイルに切り出す」方針を踏襲している。

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 3階層のピラミッド図。「今の良い状態を保つ3本柱」のように、土台→中段→頂点の
// 積み上げ構造を一目で見せる。layersは先頭が頂点(上段)、末尾が土台(下段)の順。
const PYRAMID_COLORS = ["#e0a300", "#9CB380", "#f4d35e"];

export function renderPyramidHtml(chart) {
  const { title, layers } = chart;
  if (!Array.isArray(layers) || layers.length === 0) return "";

  const n = layers.length;
  const width = 320;
  const height = 40 + n * 74;
  const cx = width / 2;
  const apexWidth = 44;
  const baseWidth = 284;
  const top0 = 16;
  const bandH = 74;

  const shapes = layers
    .map((layer, i) => {
      const y0 = top0 + i * bandH;
      const y1 = y0 + bandH;
      const topWidth = apexWidth + (i / n) * (baseWidth - apexWidth);
      const bottomWidth = apexWidth + ((i + 1) / n) * (baseWidth - apexWidth);
      const points = `${cx - topWidth / 2},${y0} ${cx + topWidth / 2},${y0} ${
        cx + bottomWidth / 2
      },${y1} ${cx - bottomWidth / 2},${y1}`;
      const color = PYRAMID_COLORS[i % PYRAMID_COLORS.length];
      const label = escapeHtmlText(layer.label);
      const components = escapeHtmlText(layer.components || "");
      return `<g><polygon points="${points}" fill="${color}" stroke="#fff" stroke-width="2" /><title>${label}: ${components}</title><text x="${cx}" y="${
        y0 + 30
      }" text-anchor="middle" class="pyramid-layer-label">${label}</text><text x="${cx}" y="${
        y0 + 52
      }" text-anchor="middle" class="pyramid-layer-sub">${components}</text></g>`;
    })
    .join("");

  const legendRows = layers
    .map(
      (layer) =>
        `<tr><td>${escapeHtmlText(layer.label)}</td><td>${escapeHtmlText(
          layer.components || ""
        )}</td></tr>`
    )
    .join("");

  const titleText = escapeHtmlText(title || "");

  return `<figure class="article-chart article-pyramid-chart"><figcaption class="chart-title">${titleText}</figcaption><svg viewBox="0 0 ${width} ${height}" class="pyramid-svg" role="img" aria-label="${titleText}"><title>${titleText}</title>${shapes}</svg><details class="chart-table-toggle"><summary>データを表で見る</summary><table class="chart-table"><thead><tr><th>階層</th><th>代表成分</th></tr></thead><tbody>${legendRows}</tbody></table></details></figure>`;
}

// 12ヶ月の帯グラフ。普通肌でも季節によって皮脂寄り/乾燥寄りに傾くことを示す。
// 色だけで判断させないよう、凡例と<title>(ホバー)・表(details)を併記する。
export function renderCalendarBandHtml(chart) {
  const { title, months, note } = chart;
  if (!Array.isArray(months) || months.length === 0) return "";

  const width = 320;
  const segW = width / months.length;
  const topPad = 6;
  const bandY = 28 + topPad;
  const bandH = 46;
  const height = bandY + bandH + 38;

  const bandOf = (sebum) => {
    const v = Number(sebum) || 0;
    if (v >= 65) return { color: "#e8c547", key: "皮脂寄り" };
    if (v <= 35) return { color: "#7fb3d9", key: "乾燥寄り" };
    return { color: "#9CB380", key: "バランス" };
  };

  const segments = months
    .map((m, i) => {
      const x = i * segW;
      const { color, key } = bandOf(m.sebum);
      const label = escapeHtmlText(m.label);
      return `<g><rect x="${x}" y="${bandY}" width="${Math.max(
        segW - 1,
        1
      )}" height="${bandH}" fill="${color}"><title>${label}: ${escapeHtmlText(
        key
      )}</title></rect><text x="${x + segW / 2}" y="${
        bandY + bandH + 14
      }" text-anchor="middle" class="calendar-band-label">${label}</text></g>`;
    })
    .join("");

  const legend = `<g><rect x="0" y="${topPad}" width="14" height="14" fill="#7fb3d9" /><text x="18" y="${
    topPad + 11
  }" class="calendar-band-legend">乾燥寄り</text><rect x="86" y="${topPad}" width="14" height="14" fill="#9CB380" /><text x="104" y="${
    topPad + 11
  }" class="calendar-band-legend">バランス</text><rect x="178" y="${topPad}" width="14" height="14" fill="#e8c547" /><text x="196" y="${
    topPad + 11
  }" class="calendar-band-legend">皮脂寄り</text></g>`;

  const noteHtml = note
    ? `<figcaption class="chart-source">${escapeHtmlText(note)}</figcaption>`
    : "";

  const titleText = escapeHtmlText(title || "");

  return `<figure class="article-chart article-calendar-band"><figcaption class="chart-title">${titleText}</figcaption><svg viewBox="0 0 ${width} ${height}" class="calendar-band-svg" role="img" aria-label="${titleText}"><title>${titleText}</title>${legend}${segments}</svg>${noteHtml}</figure>`;
}
