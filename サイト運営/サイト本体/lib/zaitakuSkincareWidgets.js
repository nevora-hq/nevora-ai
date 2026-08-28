// 「在宅ワークでノーメイクなのに肌荒れ…忙しい人の時短スキンケア、削っていい工程・削ってはいけない工程」
// 記事(content/articles/2026-07-21_在宅ワーク時短スキンケア削っていい工程.md)専用の
// SVG/HTML図解ウィジェット(2026-08-07 スマホ可読性リニューアル)。
// 他記事のchart type(renderBarChartHtml等)には影響を与えないよう、lib/posts.js の
// renderChartHtml から type 名で分岐して呼び出す(前髪記事のlib/maegamiWidgets.jsと同じ設計方針)。
// クライアント側JS不要(静的HTML/SVG文字列)。装飾のみのSVGは aria-hidden、
// 情報を持つSVGには role="img" + <title> を付与する。

export const ZAITAKU_SLUG = "2026-07-21_在宅ワーク時短スキンケア削っていい工程";

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① SVG信号機一覧図(chart type: "zaitakuSignal")。
// items: [{ step, signal: "green"|"yellow"|"red", note }]
const SIGNAL_COLOR = {
  green: "#2f9e6b",
  yellow: "#d9a441",
  red: "#c8553d",
};
const SIGNAL_MARK = {
  green: "◎",
  yellow: "△",
  red: "✕",
};
const SIGNAL_TEXT = {
  green: "削っていい",
  yellow: "状況次第",
  red: "削れない",
};

export function renderSignalDiagramHtml(chart) {
  const { title, items } = chart;
  if (!Array.isArray(items) || items.length === 0) return "";

  const rowH = 46;
  const width = 320;
  const height = items.length * rowH + 16;

  const rows = items
    .map((it, i) => {
      const y = 12 + i * rowH;
      const color = SIGNAL_COLOR[it.signal] || SIGNAL_COLOR.yellow;
      const mark = SIGNAL_MARK[it.signal] || "△";
      const label = escapeHtmlText(it.step);
      const note = escapeHtmlText(it.note || "");
      return `<g>
        <circle cx="24" cy="${y + 16}" r="15" fill="${color}"><title>${escapeHtmlText(
        SIGNAL_TEXT[it.signal] || ""
      )}: ${label}</title></circle>
        <text x="24" y="${y + 21}" text-anchor="middle" class="zwsc-signal-mark">${mark}</text>
        <text x="50" y="${y + 13}" class="zwsc-signal-step">${label}</text>
        <text x="50" y="${y + 30}" class="zwsc-signal-note">${note}</text>
      </g>`;
    })
    .join("");

  const alt = `工程ごとの信号機診断: ${items
    .map((it) => `${it.step}は${SIGNAL_TEXT[it.signal] || ""}`)
    .join("、")}`;

  return `<figure class="article-chart zwsc-signal-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "工程ごとの信号機診断")}</figcaption>
    <svg viewBox="0 0 ${width} ${height}" class="zwsc-signal-svg" role="img" aria-label="${escapeHtmlText(
    alt
  )}"><title>${escapeHtmlText(alt)}</title>${rows}</svg>
    <ul class="zwsc-signal-legend">
      <li><span class="zwsc-signal-dot" style="background:${SIGNAL_COLOR.green}"></span>🟢 削っていい</li>
      <li><span class="zwsc-signal-dot" style="background:${SIGNAL_COLOR.yellow}"></span>🟡 状況次第</li>
      <li><span class="zwsc-signal-dot" style="background:${SIGNAL_COLOR.red}"></span>🔴 削れない</li>
    </ul>
  </figure>`;
}

// ② 工程×所要時間×優先度×省いた時に起きること 一覧表(chart type: "zaitakuProcessTable")。
// rows: [{ step, seconds, priority: "must"|"recommend"|"optional", risk }]
const PRIORITY_LABEL = { must: "必須", recommend: "推奨", optional: "省略可" };
const PRIORITY_CLASS = { must: "zwsc-badge-must", recommend: "zwsc-badge-recommend", optional: "zwsc-badge-optional" };

export function renderProcessTableHtml(chart) {
  const { title, rows } = chart;
  if (!Array.isArray(rows) || rows.length === 0) return "";

  const body = rows
    .map((r) => {
      const badgeCls = PRIORITY_CLASS[r.priority] || "zwsc-badge-optional";
      const badgeLabel = PRIORITY_LABEL[r.priority] || "省略可";
      return `<tr>
        <th scope="row">${escapeHtmlText(r.step)}</th>
        <td class="zwsc-table-num">${escapeHtmlText(r.seconds)}</td>
        <td><span class="zwsc-priority-badge ${badgeCls}">${badgeLabel}</span></td>
        <td>${escapeHtmlText(r.risk)}</td>
      </tr>`;
    })
    .join("");

  return `<figure class="zwsc-process-table">
    <figcaption class="chart-title">${escapeHtmlText(title || "工程別・所要時間と優先度")}</figcaption>
    <div class="zwsc-scroll-wrap">
      <table class="zwsc-process-table-inner">
        <caption class="sr-only">${escapeHtmlText(
          title || "工程別・所要時間と優先度"
        )}(工程・所要時間・優先度・省いた時に起きることの一覧)</caption>
        <thead><tr><th scope="col">工程</th><th scope="col">目安時間</th><th scope="col">優先度</th><th scope="col">省くと…</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    <p class="zwsc-scroll-note">→ 横にスクロールできます</p>
  </figure>`;
}

// ③ 時間配分帯グラフ(chart type: "zaitakuTimeBand")。
// patterns: [{ label, totalSeconds, segments: [{ step, seconds, color }] }]
export function renderTimeBandChartHtml(chart) {
  const { title, patterns } = chart;
  if (!Array.isArray(patterns) || patterns.length === 0) return "";

  const width = 320;
  const barH = 28;
  const rowGap = 40;
  const labelH = 18;
  const height = patterns.length * (barH + rowGap) + 10;

  const rows = patterns
    .map((p, i) => {
      const y = 10 + i * (barH + rowGap);
      const total = Number(p.totalSeconds) || 1;
      let x = 0;
      const segs = (p.segments || [])
        .map((s) => {
          const w = (Number(s.seconds) / total) * width;
          const rect = `<rect x="${x.toFixed(1)}" y="${y + labelH}" width="${w.toFixed(
            1
          )}" height="${barH}" fill="${s.color}"><title>${escapeHtmlText(
            s.step
          )}: 約${escapeHtmlText(String(s.seconds))}秒</title></rect>`;
          x += w;
          return rect;
        })
        .join("");
      return `<g>
        <text x="0" y="${y + labelH - 4}" class="zwsc-band-label">${escapeHtmlText(
        p.label
      )}(合計約${escapeHtmlText(String(p.totalSeconds))}秒)</text>
        ${segs}
      </g>`;
    })
    .join("");

  const legendItems = [];
  const seen = new Set();
  patterns.forEach((p) =>
    (p.segments || []).forEach((s) => {
      if (seen.has(s.step)) return;
      seen.add(s.step);
      legendItems.push(
        `<li><span class="donut-swatch" style="background:${s.color}"></span>${escapeHtmlText(
          s.step
        )}</li>`
      );
    })
  );

  const alt = `${title || "時間配分帯グラフ"}: ${patterns
    .map((p) => `${p.label}は合計約${p.totalSeconds}秒`)
    .join("、")}`;

  return `<figure class="article-chart zwsc-timeband-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "3分/5分/10分ケアの時間配分")}</figcaption>
    <div class="zwsc-scroll-wrap">
      <svg viewBox="0 0 ${width} ${height}" class="zwsc-timeband-svg" role="img" aria-label="${escapeHtmlText(
    alt
  )}"><title>${escapeHtmlText(alt)}</title>${rows}</svg>
    </div>
    <ul class="donut-legend zwsc-timeband-legend">${legendItems.join("")}</ul>
  </figure>`;
}

// ④ 朝夜ルーティンの縦タイムライン(chart type: "zaitakuTimeline")。
// tracks: [{ label, steps: [{ time, step }] }]
export function renderTimelineHtml(chart) {
  const { title, tracks } = chart;
  if (!Array.isArray(tracks) || tracks.length === 0) return "";

  const blocks = tracks
    .map((track) => {
      const items = (track.steps || [])
        .map(
          (s) => `<li class="zwsc-timeline-item">
            <span class="zwsc-timeline-clock" aria-hidden="true">🕐</span>
            <span class="zwsc-timeline-time">${escapeHtmlText(s.time)}</span>
            <span class="zwsc-timeline-step">${escapeHtmlText(s.step)}</span>
          </li>`
        )
        .join("");
      return `<div class="zwsc-timeline-track">
        <p class="zwsc-timeline-track-label">${escapeHtmlText(track.label)}</p>
        <ul class="zwsc-timeline-list">${items}</ul>
      </div>`;
    })
    .join("");

  // 注: role="img"は付けない。子要素(時刻・工程のリスト)はテキストとして
  // 意味を持つため、role="img"にするとスクリーンリーダーがaria-labelの
  // タイトルだけを読み上げ、実際の時刻・工程内容を読み飛ばしてしまう
  // (2026-08-08修正)。figcaptionによる可視タイトルのみで十分アクセシブル。
  return `<figure class="zwsc-timeline-figure">
    <figcaption class="chart-title">${escapeHtmlText(title || "朝夜ルーティンのタイムライン")}</figcaption>
    <div class="zwsc-timeline-grid">${blocks}</div>
  </figure>`;
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。charts/accordions/checklists/マスコットの挿入が
// すべて終わったあと、最後に一度だけ実行する(lib/skincareBasicsExtras.jsと同じ設計)。
export function wrapZaitakuSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["zwsc-section-plain", "zwsc-section-tint", "zwsc-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part;
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="zwsc-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}
