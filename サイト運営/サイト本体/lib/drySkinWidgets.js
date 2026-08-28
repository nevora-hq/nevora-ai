// 「乾燥肌とは？」記事(content/articles/2026-08-05_乾燥肌とは_基本情報.md)専用の
// SVG/HTML図解ウィジェット。他記事のchart type(renderBarChartHtml等)には影響を
// 与えないよう、lib/posts.js の renderChartHtml から type 名で分岐して呼び出す。
// クライアント側JS不要(静的HTML/SVG文字列)。装飾のみのSVGは aria-hidden、
// 情報を持つSVGには role="img" + <title> を付与する。

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 「⏱ 30秒でわかる」サマリーカード内の「・」区切りテキスト(<br>連結)を、
// 本物の<ul><li>リストに変換する。素の「・」文字のまま出すとチェック
// リスト等の他パーツと見た目のトーンが揃わないため、この記事だけ実施する
// (quick-summary-box/quick-conclusion-box の内部HTML文字列に対してのみ
// 動作するため、他記事のquick-summary-boxには一切影響しない)。
export function dryskinizeSummaryLists(html) {
  const convertBullets = (inner) => {
    const lines = inner.split(/<br\s*\/?>/).map((s) => s.trim()).filter(Boolean);
    const bulletLines = lines.filter((s) => s.startsWith("・"));
    if (bulletLines.length < 2 || bulletLines.length !== lines.length) return null;
    return bulletLines.map((s) => `<li>${s.replace(/^・/, "")}</li>`).join("");
  };
  let out = html
    .replace(
      /<p class="(quick-summary-body|quick-conclusion-body)">([\s\S]*?)<\/p>/g,
      (match, cls, inner) => {
        const items = convertBullets(inner);
        return items ? `<ul class="${cls} dryskin-inline-list">${items}</ul>` : match;
      }
    )
    .replace(
      /<p><strong>(こんな人におすすめ)<\/strong><br>\s*([\s\S]*?)<\/p>/g,
      (match, label, inner) => {
        const items = convertBullets(inner);
        return items
          ? `<p class="dryskin-inline-list-label"><strong>${label}</strong></p><ul class="dryskin-inline-list dryskin-audience-list">${items}</ul>`
          : match;
      }
    );

  // 「📝 体験メモ: ...」の素のpタグを、視覚的に分離した吹き出し風ボックスに変換する。
  out = out.replace(
    /<p>📝\s*体験メモ:\s*([\s\S]*?)<\/p>/g,
    (_m, inner) =>
      `<div class="dryskin-memo-box"><span class="dryskin-memo-icon" aria-hidden="true">📝</span><div class="dryskin-memo-body"><p class="dryskin-memo-label">体験メモ</p><p>${inner}</p></div></div>`
  );

  // 「📝 まとめ」の生blockquote(・区切りテキスト)を、まとめカードに変換する。
  out = out.replace(
    /<blockquote>\s*<p>📝\s*まとめ\s*<br>\s*([\s\S]*?)<\/p>(<p><strong>次の一歩<\/strong>:\s*([\s\S]*?)<\/p>)?\s*<\/blockquote>/g,
    (_m, inner, _p2, nextStep) => {
      const items = convertBullets(inner);
      const listHtml = items
        ? `<ul class="dryskin-inline-list">${items}</ul>`
        : `<p>${inner}</p>`;
      const nextStepHtml = nextStep
        ? `<p class="dryskin-matome-next"><strong>次の一歩</strong>: ${nextStep}</p>`
        : "";
      return `<div class="dryskin-matome-card"><p class="dryskin-matome-label"><span aria-hidden="true">📝</span> まとめ</p>${listHtml}${nextStepHtml}</div>`;
    }
  );

  return out;
}

// ① 健康な肌 vs 乾燥肌の角質層断面比較図。
// レンガ状の角質細胞・細胞間脂質(セラミド)・NMF(天然保湿因子)・皮脂膜の
// 4要素をラベル付きで描き分け、乾燥肌側は隙間から水分が蒸発する矢印を添える。
export function renderBarrierDiagramHtml() {
  const title = "健康な肌と乾燥肌の角質層くらべ";
  const brick = (x, y, w, h, fill) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="#4A90D9" stroke-width="1" />`;

  // 健康な肌側:隙間なくレンガ(角質細胞)が並ぶ
  let healthyBricks = "";
  for (let row = 0; row < 3; row += 1) {
    const offset = row % 2 === 0 ? 0 : 18;
    for (let col = -1; col < 4; col += 1) {
      const x = 20 + offset + col * 36;
      if (x < 8 || x > 150) continue;
      healthyBricks += brick(x, 60 + row * 26, 34, 22, "#eaf3fb");
    }
  }

  // 乾燥肌側:隙間が空いたレンガ配置(バリア低下を表現)
  let dryBricks = "";
  const dryPositions = [
    [200, 60], [242, 60], [296, 60],
    [210, 86], [268, 86],
    [196, 112], [250, 112], [300, 112],
  ];
  dryPositions.forEach(([x, y]) => {
    dryBricks += brick(x, y, 32, 20, "#fdeeea");
  });

  return `<figure class="article-chart dryskin-diagram">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 380 236" class="dryskin-diagram-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 健康な肌は角質細胞のすき間がなく水分を保てるが、乾燥肌は角質細胞のすき間が空き、セラミドやNMFが不足して水分が蒸発しやすい">
      <title>健康な肌と乾燥肌の角質層断面の比較図</title>
      <rect x="0" y="0" width="380" height="220" fill="#F2F6FA" rx="10" />
      <text x="95" y="30" text-anchor="middle" class="dryskin-diagram-label-main">健康な肌</text>
      <text x="285" y="30" text-anchor="middle" class="dryskin-diagram-label-main dryskin-diagram-label-dry">乾燥肌</text>

      <!-- 皮脂膜(表面のうすい層) -->
      <rect x="8" y="52" width="176" height="6" fill="#7FD1C4" />
      <rect x="188" y="52" width="176" height="4" fill="#e3b7ac" />
      ${healthyBricks}
      ${dryBricks}

      <!-- 健康な肌:セラミド(細胞間脂質)を隙間なく描く -->
      <rect x="8" y="58" width="176" height="72" fill="none" stroke="#7FD1C4" stroke-width="3" stroke-dasharray="1 5" />

      <!-- 乾燥肌:隙間から水分蒸発の矢印 -->
      <line x1="222" y1="88" x2="222" y2="50" stroke="#e0554a" stroke-width="2.5" marker-end="url(#dryArrow)" />
      <line x1="278" y1="100" x2="278" y2="50" stroke="#e0554a" stroke-width="2.5" marker-end="url(#dryArrow)" />
      <defs>
        <marker id="dryArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#e0554a" />
        </marker>
      </defs>

      <text x="95" y="150" text-anchor="middle" class="dryskin-diagram-label-sub">セラミド・NMFが</text>
      <text x="95" y="166" text-anchor="middle" class="dryskin-diagram-label-sub">すき間を埋め水分を保持</text>

      <text x="270" y="150" text-anchor="middle" class="dryskin-diagram-label-sub dryskin-diagram-label-dry">すき間から</text>
      <text x="270" y="166" text-anchor="middle" class="dryskin-diagram-label-sub dryskin-diagram-label-dry">水分が蒸発</text>

      <text x="95" y="195" text-anchor="middle" class="dryskin-diagram-caption">皮脂膜・セラミド・NMFが</text>
      <text x="95" y="211" text-anchor="middle" class="dryskin-diagram-caption">そろい水分を保持</text>
      <text x="270" y="195" text-anchor="middle" class="dryskin-diagram-caption">皮脂膜が薄く、セラミド</text>
      <text x="270" y="211" text-anchor="middle" class="dryskin-diagram-caption">・NMFも不足しがち</text>
    </svg>
    <p class="dryskin-diagram-note">※角質層のイメージを模式化した図です。実際の構造を正確に縮尺どおり示すものではありません。</p>
  </figure>`;
}

// ② 乾燥スパイラル(バリア低下→水分蒸発→外部刺激→炎症・かゆみ→さらにバリア低下)を
// 円環の矢印で示し、どこで断ち切るかを赤いハサミアイコンで示す。
export function renderDryCycleLoopHtml() {
  const title = "乾燥スパイラルのイメージ";
  const steps = [
    { label: "バリア機能の低下", angle: -90 },
    { label: "水分の蒸発", angle: -18 },
    { label: "外部刺激を受けやすい", angle: 54 },
    { label: "炎症・かゆみ", angle: 126 },
    { label: "さらにバリア低下", angle: 198 },
  ];
  const cx = 190;
  const cy = 190;
  const r = 120;

  const pointHtml = steps
    .map((s, i) => {
      const rad = (s.angle * Math.PI) / 180;
      const x = cx + r * Math.cos(rad);
      const y = cy + r * Math.sin(rad);
      return `<g><circle cx="${x}" cy="${y}" r="30" fill="#eaf3fb" stroke="#4A90D9" stroke-width="2" /><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" class="dryskin-loop-label">${escapeHtmlText(
        `${i + 1}. ${s.label}`
      )}</text></g>`;
    })
    .join("");

  // 円環の矢印(5分割の弧)
  let arcs = "";
  for (let i = 0; i < steps.length; i += 1) {
    const a1 = (steps[i].angle + 22) * (Math.PI / 180);
    const a2 = (steps[(i + 1) % steps.length].angle - 22 + (i === steps.length - 1 ? 360 : 0)) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    arcs += `<path d="M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}" fill="none" stroke="#7FD1C4" stroke-width="3" marker-end="url(#loopArrow)" />`;
  }

  return `<figure class="article-chart dryskin-diagram">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 380 380" class="dryskin-loop-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: バリア機能低下から水分蒸発、外部刺激、炎症・かゆみを経て、さらにバリアが低下する悪循環。ケアで断ち切れることを示す図">
      <title>乾燥が悪循環(乾燥スパイラル)になる流れの図</title>
      <defs>
        <marker id="loopArrow" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill="#7FD1C4" />
        </marker>
      </defs>
      ${arcs}
      ${pointHtml}
      <g aria-hidden="true">
        <text x="190" y="188" text-anchor="middle" class="dryskin-loop-scissors">✂️</text>
        <text x="190" y="215" text-anchor="middle" class="dryskin-loop-caption">保湿ケアで</text>
        <text x="190" y="231" text-anchor="middle" class="dryskin-loop-caption">ここを断ち切る</text>
      </g>
    </svg>
    <p class="dryskin-diagram-note">乾燥は放っておくと悪循環になりやすいとされますが、「水分の蒸発」を防ぐ保湿ケアを続けることで、この流れを断ち切りやすくなると考えられています。</p>
  </figure>`;
}

// ③ 月別の平均湿度(折れ線)と肌トラブルの起こりやすさ(棒)を重ねた
// 12ヶ月の複合グラフ。冬(12〜2月)と初秋(9〜10月)にピークを示す。
export function renderComboChartHtml() {
  const title = "月別の平均湿度と肌トラブルの起こりやすさ(イメージ)";
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  // 相対的な傾向を示すイメージ値(実測データではない)
  const humidity = [42, 45, 52, 58, 62, 72, 78, 74, 66, 58, 50, 44];
  const trouble = [80, 70, 55, 40, 30, 20, 22, 28, 55, 62, 72, 85];

  const width = 560;
  const height = 260;
  const padTop = 20;
  const padBottom = 40;
  const padLeft = 40;
  const padRight = 20;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const step = plotW / months.length;
  const barW = step * 0.5;

  const bars = trouble
    .map((v, i) => {
      const h = (v / 100) * plotH;
      const x = padLeft + i * step + (step - barW) / 2;
      const y = padTop + plotH - h;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(
        1
      )}" width="${barW.toFixed(1)}" height="${h.toFixed(
        1
      )}" rx="2" fill="#f3b8ac"><title>${months[i]}のトラブル傾向: ${v}</title></rect>`;
    })
    .join("");

  const linePoints = humidity
    .map((v, i) => {
      const x = padLeft + i * step + step / 2;
      const y = padTop + plotH - (v / 100) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const dots = humidity
    .map((v, i) => {
      const x = padLeft + i * step + step / 2;
      const y = padTop + plotH - (v / 100) * plotH;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(
        1
      )}" r="3.5" fill="#4A90D9"><title>${months[i]}の平均湿度傾向: ${v}%</title></circle>`;
    })
    .join("");

  const xLabels = months
    .map((m, i) => {
      const x = padLeft + i * step + step / 2;
      return `<text x="${x.toFixed(
        1
      )}" y="${height - 12}" text-anchor="middle" class="dryskin-combo-xlabel">${m}</text>`;
    })
    .join("");

  return `<figure class="article-chart dryskin-diagram">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <div class="dryskin-combo-scroll">
      <svg viewBox="0 0 ${width} ${height}" class="dryskin-combo-svg" role="img" aria-label="${escapeHtmlText(
        title
      )}。冬(12〜2月)と初秋(9〜10月)に肌トラブルの起こりやすさが高まる傾向">
        <title>月別の平均湿度と肌トラブルの起こりやすさの複合グラフ</title>
        <line x1="${padLeft}" y1="${padTop + plotH}" x2="${
          width - padRight
        }" y2="${padTop + plotH}" stroke="#c9d6e0" stroke-width="1.5" />
        ${bars}
        <polyline points="${linePoints}" fill="none" stroke="#4A90D9" stroke-width="2.5" />
        ${dots}
        ${xLabels}
      </svg>
    </div>
    <p class="dryskin-diagram-note">※傾向を示すイメージ図です。■ピンク棒=肌トラブルの起こりやすさ /  ●青線=平均湿度の傾向。冬と初秋にトラブルが増えやすい傾向がうかがえます。</p>
  </figure>`;
}

// ④ 肌質4タイプ判別表。行=乾燥肌/脂性肌/混合肌/敏感肌、
// 列=洗顔後のつっぱり・Tゾーンのテカリ・粉ふき・赤みやすさ。◎○△×で表記。
export function renderSkinTypeMatrixHtml() {
  const title = "肌質4タイプ判別表";
  const cols = ["洗顔後のつっぱり", "Tゾーンのテカリ", "粉ふき", "赤みやすさ"];
  const rows = [
    { name: "乾燥肌", values: ["◎", "×", "◎", "○"] },
    { name: "脂性肌", values: ["×", "◎", "×", "△"] },
    { name: "混合肌", values: ["○", "○", "△", "△"] },
    { name: "敏感肌", values: ["△", "△", "△", "◎"] },
  ];

  const theadCols = cols.map((c) => `<th scope="col">${escapeHtmlText(c)}</th>`).join("");
  const tbody = rows
    .map(
      (r) =>
        `<tr><th scope="row">${escapeHtmlText(r.name)}</th>${r.values
          .map((v) => `<td><span class="dryskin-matrix-mark" aria-label="${symbolLabel(v)}">${v}</span></td>`)
          .join("")}</tr>`
    )
    .join("");

  return `<figure class="dryskin-matrix">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <div class="dryskin-scroll-wrap">
      <table class="dryskin-matrix-table">
        <caption class="sr-only">${escapeHtmlText(title)}(◎:よくあてはまる ○:ややあてはまる △:あまりあてはまらない ×:あてはまらない)</caption>
        <thead><tr><th scope="col">肌質</th>${theadCols}</tr></thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
    <p class="dryskin-scroll-note">→ 横にスクロールできます</p>
    <p class="dryskin-diagram-note">◎よくあてはまる / ○ややあてはまる / △あまりあてはまらない / ×あてはまらない</p>
  </figure>`;
}

function symbolLabel(symbol) {
  const map = { "◎": "よくあてはまる", "○": "ややあてはまる", "△": "あまりあてはまらない", "×": "あてはまらない" };
  return map[symbol] || symbol;
}

// ⑥ 朝ケア/夜ケアの縦タイムライン図。各ステップに所要時間と「やりがちなNG」を添える。
export function renderVerticalTimelineHtml() {
  const title = "朝・夜のスキンケアタイムライン";
  const morning = [
    { time: "0分", step: "ぬるま湯 or 洗顔料で優しく洗顔", ng: "熱いお湯でゴシゴシ洗うのはNG" },
    { time: "1分", step: "化粧水を2〜3回に分けて重ね付け", ng: "1回だけつけて終わらせがち" },
    { time: "3分", step: "乳液・クリームでフタをする", ng: "時間がなく省略しがち" },
    { time: "5分", step: "日焼け止めで紫外線対策", ng: "曇りの日はつい省略しがち" },
  ];
  const night = [
    { time: "0分", step: "クレンジング・洗顔で1日の汚れをオフ", ng: "メイクが残ったまま眠るのはNG" },
    { time: "2分", step: "化粧水でうるおいを補給", ng: "お風呂上がり後にすぐつけず放置しがち" },
    { time: "4分", step: "美容液・乳液・クリームで重ね保湿", ng: "乳液だけで済ませがち" },
  ];

  const renderList = (items, cls) =>
    items
      .map(
        (it, i) => `<li class="dryskin-timeline-item ${cls}">
          <span class="dryskin-timeline-dot" aria-hidden="true">${i + 1}</span>
          <div class="dryskin-timeline-body">
            <p class="dryskin-timeline-time">目安 ${escapeHtmlText(it.time)}〜</p>
            <p class="dryskin-timeline-step">${escapeHtmlText(it.step)}</p>
            <p class="dryskin-timeline-ng">⚠️ やりがちなNG: ${escapeHtmlText(it.ng)}</p>
          </div>
        </li>`
      )
      .join("");

  return `<figure class="dryskin-timeline-figure">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <div class="dryskin-timeline-block">
      <p class="dryskin-timeline-heading">☀️ 朝ケア</p>
      <ol class="dryskin-timeline-list">${renderList(morning, "am")}</ol>
    </div>
    <div class="dryskin-timeline-block">
      <p class="dryskin-timeline-heading">🌙 夜ケア</p>
      <ol class="dryskin-timeline-list">${renderList(night, "pm")}</ol>
    </div>
  </figure>`;
}
