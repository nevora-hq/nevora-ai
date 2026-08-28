// 記事「朝きれいだったのに昼にはドロドロ…夏のメイク崩れ、乾燥なのか皮脂なのか問題」
// (content/articles/2026-07-20_夏の皮脂汗メイク崩れ対策.md)専用のレンダリング処理をまとめたファイル。
// lib/posts.js の renderChartHtml から chart.type に応じて呼び出される追加分岐と、
// この記事のslugのときだけ実行するセクション分割・独自目次の処理を提供する
// (lib/lipCompareExtras.js の実装パターンを踏襲)。
// 他記事の描画・既存chartタイプ(bar/stat/donut/prosCons/quadrant等)の挙動には一切影響しない。

import { pickHeadingEmoji } from "./tocEmoji";

export const SUMMER_MAKEUP_SLUG = "2026-07-20_夏の皮脂汗メイク崩れ対策";

const THEME = {
  aqua: "#2FA8C7",
  aquaDark: "#1D7E9C",
  sun: "#F5C24B",
  sunDark: "#C9931F",
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

// ① 断面図: 「通常の脂性肌」と「インナードライ(隠れ乾燥)」の肌断面を並べ、
// 表面の皮脂膜の厚さと、角質層内部の水分量(水滴アイコン)の違いを示す。
export function renderMakeupCrossSectionHtml() {
  const title = "通常の脂性肌 と インナードライ(隠れ乾燥) の断面くらべ";

  const panel = (ox, label, labelClass, oilHeight, drops, cracks) => {
    const dropIcons = Array.from({ length: drops })
      .map((_, i) => {
        const x = ox + 30 + (i % 3) * 22;
        const y = 118 + Math.floor(i / 3) * 20;
        return `<path d="M${x} ${y - 7} c5 6 6 10 6 13 a6 6 0 1 1 -12 0 c0 -3 1 -7 6 -13z" fill="${THEME.aqua}" />`;
      })
      .join("");
    const crackLines = cracks
      ? `<path d="M${ox + 20} 96 l8 10 M${ox + 46} 92 l7 12 M${ox + 72} 96 l8 10" stroke="#E0554A" stroke-width="2" stroke-linecap="round" />`
      : "";
    return `<g>
      <text x="${ox + 55}" y="12" text-anchor="middle" class="smk-cross-label ${labelClass}">${escapeHtmlText(
      label
    )}</text>
      <rect x="${ox}" y="${40 - oilHeight}" width="110" height="${oilHeight}" fill="${THEME.sun}" fill-opacity="0.85" rx="2" />
      <text x="${ox + 55}" y="37" text-anchor="middle" class="smk-cross-sub-inline">皮脂膜</text>
      <rect x="${ox}" y="40" width="110" height="100" fill="#FBEFD8" stroke="#E8D3A6" stroke-width="1.5" />
      ${crackLines}
      ${dropIcons}
      <text x="${ox + 55}" y="158" text-anchor="middle" class="smk-cross-sub">水分(角質層)</text>
    </g>`;
  };

  const svgInner = `
    ${panel(15, "通常の脂性肌", "smk-cross-label-oily", 14, 6, false)}
    ${panel(175, "インナードライ", "smk-cross-label-dry", 14, 2, true)}
  `;

  return `<figure class="article-chart smk-diagram">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 -8 300 183" class="smk-cross-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}。どちらも表面の皮脂膜は厚くテカりやすいが、インナードライは角質層内部の水分が少なく、ひび割れたように乾いている">
      <title>通常の脂性肌とインナードライの角質層断面の比較図</title>
      <rect x="0" y="-8" width="300" height="183" rx="10" fill="#F2F8FA" />
      ${svgInner}
    </svg>
    <p class="smk-diagram-note">どちらも表面はテカりやすいのが共通点。違いは内部の水分量です。インナードライは内部が乾いているため、皮脂で応急的にフタをしようとして、さらにテカりやすくなります。</p>
  </figure>`;
}

// ② 6問Yes/Noで「乾燥崩れ寄り/皮脂崩れ寄り/混合」を判定する診断フロー。
// 6問を縦に並べて答え(乾燥側/皮脂側どちらに近いか)をチェックしたあと、
// 最後に3方向へ分岐する結果ボックスにつながる、ツリー状のSVG。
export function renderMakeupDiagnosisFlowHtml() {
  const title = "6つのチェックでわかる 崩れタイプ診断フロー";
  const questions = [
    { q: "Q1 昼、Tゾーンを指で触るとベタつく", side: "皮脂" },
    { q: "Q2 頬や口まわりが粉をふいたようになる", side: "乾燥" },
    { q: "Q3 崩れるとファンデが毛穴に入り込む", side: "皮脂" },
    { q: "Q4 崩れるとメイクがヨレて浮いてくる", side: "乾燥" },
    { q: "Q5 保湿を厚くすると逆にテカりやすい", side: "皮脂" },
    { q: "Q6 保湿を控えるとその日のうちに乾く", side: "乾燥" },
  ];

  const boxH = 42;
  const gap = 16;
  const startY = 18;

  const boxes = questions
    .map((item, i) => {
      const y = startY + i * (boxH + gap);
      const badgeColor = item.side === "皮脂" ? THEME.sunDark : THEME.aquaDark;
      return `<g>
        <rect x="10" y="${y}" width="330" height="${boxH}" rx="9" fill="#FFFFFF" stroke="#B9D9E2" stroke-width="1.6" />
        <text x="22" y="${y + boxH / 2 + 5}" class="smk-flow-q">${escapeHtmlText(item.q)}</text>
        <rect x="300" y="${y + 9}" width="30" height="24" rx="6" fill="${badgeColor}" />
        <text x="315" y="${y + boxH / 2 + 5}" text-anchor="middle" class="smk-flow-badge">${escapeHtmlText(
        item.side
      )}</text>
        <line x1="175" y1="${y + boxH}" x2="175" y2="${
          y + boxH + gap
        }" stroke="#8FB9C6" stroke-width="2" marker-end="url(#smkFlowArrow)" />
      </g>`;
    })
    .join("");

  // 以前は最後の質問(Q6)から結果ボックスへの接続線が描画されておらず、
  // 3方向への分岐が宙に浮いたように見えていた。全質問(最後を含む)に矢印付き
  // 接続線を出すことで、Q6の下端から分岐点まで途切れず繋がるようにする(2026-08-10修正)。
  const lastY = startY + questions.length * (boxH + gap);
  const branchTopY = lastY;
  const resultY = branchTopY + 40;
  // 結果ボックス3つ(幅100px)を、320幅のviewBox内で重ならないように等間隔配置する。
  // 以前はx: 40/220/130(幅120px)で「混合タイプ」ボックスが左右2つのボックスと
  // 約30pxずつ重なり、かつ右端が320のviewBox幅を超えてはみ出していた(2026-08-10修正)。
  const resultBoxWidth = 100;
  const results = [
    { x: 5, label: "乾燥崩れ寄り", desc: "「乾燥」に✓が多い", fill: THEME.aqua },
    { x: 125, label: "混合タイプ", desc: "同じくらいの数", fill: "#B79CD1" },
    { x: 245, label: "皮脂崩れ寄り", desc: "「皮脂」に✓が多い", fill: THEME.sun },
  ];
  const branchLines = results
    .map(
      (r) =>
        `<line x1="175" y1="${branchTopY}" x2="${
          r.x + resultBoxWidth / 2
        }" y2="${resultY}" stroke="#8FB9C6" stroke-width="2" marker-end="url(#smkFlowArrow)" />`
    )
    .join("");
  const resultBoxes = results
    .map(
      (r) => `<g>
        <rect x="${r.x}" y="${resultY}" width="${resultBoxWidth}" height="52" rx="10" fill="${r.fill}" fill-opacity="0.9" />
        <text x="${r.x + resultBoxWidth / 2}" y="${resultY + 22}" text-anchor="middle" class="smk-flow-result-label">${escapeHtmlText(
        r.label
      )}</text>
        <text x="${r.x + resultBoxWidth / 2}" y="${resultY + 39}" text-anchor="middle" class="smk-flow-result-desc">${escapeHtmlText(
        r.desc
      )}</text>
      </g>`
    )
    .join("");

  const height = resultY + 52 + 12;

  const tableRows = questions
    .map((item) => `<tr><td>${escapeHtmlText(item.q)}</td><td>${escapeHtmlText(item.side)}</td></tr>`)
    .join("");

  return `<figure class="article-chart smk-flow">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 350 ${height}" class="smk-flow-svg" role="img" aria-label="${escapeHtmlText(
    title
  )}。6つの質問に「はい」があてはまる数をかぞえ、乾燥側と皮脂側どちらが多いかで崩れタイプを判定する">
      <title>6問で崩れタイプを判定する診断フローチャート</title>
      <defs>
        <marker id="smkFlowArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#8FB9C6" />
        </marker>
      </defs>
      ${boxes}
      ${branchLines}
      ${resultBoxes}
    </svg>
    <details class="chart-table-toggle">
      <summary>診断内容を文章で見る</summary>
      <table class="chart-table">
        <thead><tr><th>質問(あてはまる場合)</th><th>近い崩れタイプ</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </details>
    <p class="smk-diagram-note">「はい」の数が乾燥側・皮脂側どちらに多いかで、崩れタイプの傾向をざっくり把握できます。同数なら混合タイプの可能性があります。</p>
  </figure>`;
}

// ④ 気温と皮脂分泌量(目安)の関係を示す折れ線グラフ。
// 「気温が1℃上がると皮脂量が約10%増える」という目安をもとにした
// イメージ値であることを明記する。
export function renderTempSebumChartHtml() {
  const title = "気温と皮脂分泌量(目安)の関係";
  const temps = [24, 26, 28, 30, 32, 34, 36];
  // 24℃を100とし、1℃ごとに約10%増える目安で試算したイメージ値(実測データではない)
  const values = temps.map((t) => 100 + (t - 24) * 10);

  const width = 320;
  const height = 190;
  const padTop = 18;
  const padBottom = 34;
  const padLeft = 34;
  const padRight = 14;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const maxV = 240;
  const step = plotW / (temps.length - 1);

  const points = values
    .map((v, i) => {
      const x = padLeft + i * step;
      const y = padTop + plotH - (v / maxV) * plotH;
      return { x, y, v };
    });

  const linePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const dots = points
    .map(
      (p, i) =>
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${THEME.aquaDark}"><title>${
          temps[i]
        }℃: 目安${p.v}(24℃を100とした場合)</title></circle>`
    )
    .join("");
  const xLabels = points
    .map(
      (p, i) =>
        `<text x="${p.x.toFixed(1)}" y="${height - 12}" text-anchor="middle" class="smk-linechart-xlabel">${
          temps[i]
        }℃</text>`
    )
    .join("");

  const tableRows = temps
    .map((t, i) => `<tr><td>${t}℃</td><td>${values[i]}</td></tr>`)
    .join("");

  return `<figure class="article-chart smk-diagram">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <div class="smk-linechart-scroll">
      <svg viewBox="0 0 ${width} ${height}" class="smk-linechart-svg" role="img" aria-label="${escapeHtmlText(
    title
  )}。気温が上がるほど皮脂分泌量の目安値が増えていく傾向を示す折れ線グラフ(24℃を100とした場合の目安)">
        <title>気温と皮脂分泌量の目安の関係を示す折れ線グラフ</title>
        <line x1="${padLeft}" y1="${padTop + plotH}" x2="${
    width - padRight
  }" y2="${padTop + plotH}" stroke="#c9d6e0" stroke-width="1.5" />
        <polyline points="${linePoints}" fill="none" stroke="${THEME.aqua}" stroke-width="3" />
        ${dots}
        ${xLabels}
      </svg>
    </div>
    <p class="smk-diagram-note">※「気温が1℃上がると皮脂量が約10%増える」という目安をもとにしたイメージ値で、実測データではありません。個人差があります。→ 横にスクロールできます</p>
  </figure>`;
}

// ⑤ 朝〜夕方のシーン別タイムライン。各シーンで起きがちなことと打ち手を
// アイコン付きのリストで示す(lib/lipCompareExtras.js の手順図と同じ
// 「SVGアイコン+HTMLリスト」の構成パターン)。
export function renderMakeupTimelineHtml() {
  const title = "朝の準備〜夕方のメイク崩れタイムライン";
  const scenes = [
    {
      time: "朝の準備",
      what: "保湿と下地でその日の土台を作る時間帯",
      action: "部位ごとに下地を使い分け、薄く重ねる",
    },
    {
      time: "通勤",
      what: "屋外の暑さで汗・皮脂が出始める",
      action: "日焼け止めはこまめな塗り直しを意識",
    },
    {
      time: "オフィス(エアコン)",
      what: "冷房で乾燥が進み、頬がカサつきやすい",
      action: "デスクにミストを置き、乾燥を感じたら保湿",
    },
    {
      time: "昼",
      what: "Tゾーンのテカリ・毛穴落ちが目立つピーク",
      action: "①ティッシュオフ→②ミスト→③部分パウダー",
    },
    {
      time: "夕方",
      what: "皮脂と乾燥が入り混じり、粉っぽさも出やすい",
      action: "保湿を足してから薄くパウダーでカバー",
    },
  ];

  const icons = [
    // 朝: 太陽が昇るイメージ
    `<circle cx="20" cy="24" r="9" fill="${THEME.sun}" /><path d="M20 6v4M20 34v4M6 20h4M30 20h4M10 10l3 3M27 27l3 3M30 10l-3 3M13 27l-3 3" stroke="${THEME.sunDark}" stroke-width="2" stroke-linecap="round" />`,
    // 通勤: バッグ
    `<rect x="8" y="16" width="24" height="18" rx="3" fill="#fff" stroke="${THEME.aquaDark}" stroke-width="2" /><path d="M14 16v-3a6 6 0 0 1 12 0v3" fill="none" stroke="${THEME.aquaDark}" stroke-width="2" />`,
    // オフィス: 雪の結晶(冷房)
    `<line x1="20" y1="6" x2="20" y2="34" stroke="${THEME.aquaDark}" stroke-width="2" /><line x1="8" y1="20" x2="32" y2="20" stroke="${THEME.aquaDark}" stroke-width="2" /><line x1="11" y1="11" x2="29" y2="29" stroke="${THEME.aquaDark}" stroke-width="2" /><line x1="29" y1="11" x2="11" y2="29" stroke="${THEME.aquaDark}" stroke-width="2" />`,
    // 昼: 時計
    `<circle cx="20" cy="20" r="14" fill="#fff" stroke="${THEME.sunDark}" stroke-width="2" /><path d="M20 12v8l6 4" fill="none" stroke="${THEME.sunDark}" stroke-width="2" stroke-linecap="round" />`,
    // 夕方: 夕日
    `<circle cx="20" cy="24" r="8" fill="${THEME.sun}" fill-opacity="0.85" /><line x1="6" y1="32" x2="34" y2="32" stroke="${THEME.aquaDark}" stroke-width="2" />`,
  ];

  const items = scenes
    .map((s, i) => {
      return `<li class="smk-timeline-item">
        <svg viewBox="0 0 40 40" width="44" height="44" class="smk-timeline-icon" role="img" aria-hidden="true">${icons[i]}</svg>
        <div class="smk-timeline-body">
          <p class="smk-timeline-time"><span class="smk-timeline-num">${i + 1}</span>${escapeHtmlText(s.time)}</p>
          <p class="smk-timeline-what">${escapeHtmlText(s.what)}</p>
          <p class="smk-timeline-action">👉 ${escapeHtmlText(s.action)}</p>
        </div>
      </li>`;
    })
    .join("");

  return `<figure class="article-chart smk-timeline">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <ol class="smk-timeline-list">${items}</ol>
  </figure>`;
}

const TOC_EMOJI_BY_KEYWORD = [
  [/これ誰|ドロドロ|見分け方/, "🔍"],
  [/なぜ|仕組み/, "🧬"],
  [/気温|グラフ/, "🌡️"],
  [/見直す|スキンケア/, "🧴"],
  [/ベースメイク|下地/, "💄"],
  [/タイムライン/, "🕐"],
  [/シーン別|対策/, "📍"],
  [/直せば|直し方/, "🔁"],
  [/紫外線|UV/, "☀️"],
  [/よくある質問|FAQ/i, "❓"],
  [/チェックリスト|今日から/, "✅"],
  [/まとめ/, "🎀"],
];

// 目次: <details>で折りたたみ、各項目に絵文字を付けた、この記事専用の目次ブロック。
// 既存の共通コンポーネント(components/ArticleToc.js)は他記事にも使われているため
// 変更せず、この記事だけ本文HTMLの先頭に独自の目次を追加する。
export function renderMakeupTocHtml(toc) {
  if (!Array.isArray(toc) || toc.length === 0) return "";
  const items = toc
    .filter((item) => item.level === 2)
    .map((item) => {
      const emoji = pickHeadingEmoji(stripTags(item.text), TOC_EMOJI_BY_KEYWORD);
      const emojiSpan = emoji
        ? `<span class="smk-toc-emoji" aria-hidden="true">${emoji}</span>`
        : "";
      return `<li class="smk-toc-item"><a href="#${item.id}">${emojiSpan}${escapeHtmlText(item.text)}</a></li>`;
    })
    .join("");

  return `<details class="smk-toc" open><summary>📖 目次(タップで開閉)</summary><ol class="smk-toc-list">${items}</ol></details>`;
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用)。見出しの直前で区切るため、charts/accordions/
// マスコットの挿入がすべて終わったあと、最後に一度だけ実行する。
export function wrapMakeupSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["smk-section-plain", "smk-section-tint", "smk-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part; // 最初のh2より前(独自目次など)はそのまま
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="smk-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}
