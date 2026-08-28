// 「アゼライン酸とは」記事(content/articles/2026-08-05_アゼライン酸とは.md)専用の
// SVG/HTML図解ウィジェット。他記事のchart type(renderBarChartHtml等)には影響を
// 与えないよう、lib/posts.js の renderChartHtml から type 名(azelaic*)で分岐して呼び出す。
// クライアント側JS不要(静的HTML/SVG文字列)。装飾のみのSVGはaria-hidden、
// 情報を持つSVGにはrole="img"+<title>を付与する。

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① 作用機序図:肌断面に3つの働き(抗菌・角化サポート・赤みケア)を矢印で示す。
export function renderAzelaicMechanismHtml() {
  const title = "アゼライン酸の3つの働き(イメージ図)";
  return `<figure class="article-chart azelaic-diagram">
    <figcaption class="chart-title">🧪 ${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 340 292" class="azelaic-diagram-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 毛穴の中のアクネ菌へのアプローチ、毛穴まわりの角化の正常化サポート、肌表面の赤みへのケアの3方向から働きかけるイメージ図">
      <title>アゼライン酸の3つの働きを示す肌断面イメージ図</title>
      <rect x="0" y="0" width="340" height="292" rx="12" fill="#F7F5FB" />
      <!-- 肌断面(表皮・毛穴) -->
      <rect x="20" y="60" width="300" height="150" rx="8" fill="#FBEFEA" stroke="#E8D3E0" stroke-width="1" />
      <rect x="20" y="60" width="300" height="18" fill="#F3E3EE" />
      <text x="80" y="73" class="azelaic-diagram-skinlabel">表皮</text>
      <!-- 毛穴(縦の筒) -->
      <rect x="150" y="78" width="40" height="110" rx="10" fill="#EFE1D8" stroke="#C9A98E" stroke-width="1.5" />
      <circle cx="170" cy="185" r="7" fill="#8E7CC3"><title>アクネ菌のイメージ</title></circle>
      <circle cx="160" cy="170" r="5" fill="#8E7CC3" />
      <circle cx="178" cy="160" r="4.5" fill="#8E7CC3" />
      <!-- 角質の詰まり(角化) -->
      <rect x="156" y="120" width="28" height="14" rx="3" fill="#E4C9A6" />
      <rect x="154" y="136" width="32" height="12" rx="3" fill="#E4C9A6" />

      <!-- ①抗菌:紫の矢印→毛穴内部 -->
      <path d="M60 200 C 90 210, 120 200, 150 190" stroke="#8E7CC3" stroke-width="3" fill="none" marker-end="url(#azArrowPurple)" />
      <circle cx="50" cy="196" r="18" fill="#8E7CC3" />
      <text x="50" y="200" text-anchor="middle" class="azelaic-diagram-num">1</text>

      <!-- ②角化サポート:緑の矢印→角質の詰まり -->
      <path d="M60 90 C 100 95, 130 110, 155 125" stroke="#3F9E7D" stroke-width="3" fill="none" marker-end="url(#azArrowGreen)" />
      <circle cx="50" cy="86" r="18" fill="#3F9E7D" />
      <text x="50" y="90" text-anchor="middle" class="azelaic-diagram-num">2</text>

      <!-- ③赤みケア:ピンクの矢印→表面 -->
      <path d="M280 90 C 260 100, 240 105, 210 108" stroke="#D9739F" stroke-width="3" fill="none" marker-end="url(#azArrowPink)" />
      <circle cx="290" cy="86" r="18" fill="#D9739F" />
      <text x="290" y="90" text-anchor="middle" class="azelaic-diagram-num">3</text>

      <defs>
        <marker id="azArrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#8E7CC3" /></marker>
        <marker id="azArrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3F9E7D" /></marker>
        <marker id="azArrowPink" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#D9739F" /></marker>
      </defs>

      <!-- 凡例 -->
      <g transform="translate(20,225)">
        <circle cx="8" cy="6" r="7" fill="#8E7CC3" /><text x="20" y="10" class="azelaic-diagram-legend">① アクネ菌へのアプローチ</text>
      </g>
      <g transform="translate(20,247)">
        <circle cx="8" cy="6" r="7" fill="#3F9E7D" /><text x="20" y="10" class="azelaic-diagram-legend">② 角化の正常化サポート</text>
      </g>
      <g transform="translate(20,269)">
        <circle cx="8" cy="6" r="7" fill="#D9739F" /><text x="20" y="10" class="azelaic-diagram-legend">③ 赤みへのケア</text>
      </g>
    </svg>
    <figcaption class="chart-source">※イメージ図であり、効果を保証するものではありません。</figcaption>
  </figure>`;
}

// ② 濃度別比較テーブル(化粧品/国内外市販品/医療処方)。横スクロール対応。
export function renderAzelaicConcentrationTableHtml() {
  const rows = [
    {
      range: "5%以下",
      badge: "化粧品",
      badgeClass: "az-badge-cosme",
      method: "ドラッグストア・通販で購入可",
      expect: "毛穴・キメへの穏やかなケア",
      stimulus: "◎ 低め",
      note: "パッチテストのうえ低頻度から",
    },
    {
      range: "10%前後",
      badge: "国内外市販品",
      badgeClass: "az-badge-otc",
      method: "海外通販・専門店等で入手できる場合あり",
      expect: "毛穴・赤みケアをやや強めに",
      stimulus: "○ 中程度",
      note: "初期刺激が出やすく様子見が必須",
    },
    {
      range: "15〜20%",
      badge: "医療機関処方",
      badgeClass: "az-badge-medical",
      method: "皮膚科等の受診が必要",
      expect: "ニキビ・酒さ等の治療目的",
      stimulus: "△ 出やすい",
      note: "医師の判断が必要です",
    },
  ];

  const cards = rows
    .map(
      (r) => `<div class="az-table-row">
        <div class="az-table-head"><span class="az-badge ${r.badgeClass}">${escapeHtmlText(
        r.badge
      )}</span><span class="az-table-range">${escapeHtmlText(r.range)}</span></div>
        <dl class="az-table-body">
          <div><dt>入手方法</dt><dd>${escapeHtmlText(r.method)}</dd></div>
          <div><dt>期待できること</dt><dd>${escapeHtmlText(r.expect)}</dd></div>
          <div><dt>刺激の目安</dt><dd>${escapeHtmlText(r.stimulus)}</dd></div>
          <div><dt>使用上の注意</dt><dd class="${
            r.badgeClass === "az-badge-medical" ? "az-table-note-strong" : ""
          }">${escapeHtmlText(r.note)}</dd></div>
        </dl>
      </div>`
    )
    .join("");

  return `<figure class="article-chart azelaic-table-figure">
    <figcaption class="chart-title">📊 濃度別に見る違い(目安)</figcaption>
    <div class="azelaic-scroll-wrap">
      <div class="azelaic-table-cards">${cards}</div>
    </div>
    <p class="azelaic-scroll-note">→ 横にスクロールできます</p>
    <figcaption class="chart-source">※濃度・分類は目安です。医療機関処方のものは必ず医師の判断のもとで使用してください。</figcaption>
  </figure>`;
}

// ③ 使用開始からの経過目安タイムラインバー(1週/4週/8週/12週)。
export function renderAzelaicTimelineHtml() {
  const title = "使い始めてからの経過目安";
  const stages = [
    { at: "1週", desc: "肌がアゼライン酸に慣れる期間。ピリつきを感じる人も" },
    { at: "4週", desc: "肌のざらつきに変化を感じ始める人が出てくる時期" },
    { at: "8週", desc: "毛穴や赤みの見え方に変化を感じやすくなる時期" },
    { at: "12週", desc: "継続して使ってきた変化を実感しやすくなる目安" },
  ];
  const segW = 75;
  const points = stages
    .map((s, i) => {
      const x = 10 + i * segW;
      return `<g>
        <circle cx="${x}" cy="30" r="9" class="azelaic-timeline-dot" />
        <text x="${x}" y="34" text-anchor="middle" class="azelaic-timeline-num">${i + 1}</text>
        <text x="${x}" y="55" text-anchor="middle" class="azelaic-timeline-at">${escapeHtmlText(
        s.at
      )}</text>
      </g>`;
    })
    .join("");

  const list = stages
    .map(
      (s, i) =>
        `<li><span class="azelaic-timeline-badge">${i + 1}</span><span><strong>${escapeHtmlText(
          s.at
        )}</strong> — ${escapeHtmlText(s.desc)}</span></li>`
    )
    .join("");

  return `<figure class="article-chart azelaic-timeline-figure">
    <figcaption class="chart-title">⏳ ${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 310 60" class="azelaic-timeline-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 1週、4週、8週、12週の順に経過するイメージ">
      <title>使い始めから1週・4週・8週・12週までの経過目安タイムライン</title>
      <!-- 連結線は4つの丸ノードの背後を通り、ノード部分では完全に隠れる。
           item35のtext-shape-overlapは実インク確認にelementsFromPointを使うため、
           他要素に覆われて見えない要素もスタックに含まれ、番号1〜4との重なりとして
           検出されてしまう。意図的な設計のためオプトアウトする(2026-08-24、
           docs/CONTRIBUTING.md 32節の除外#6)。 -->
      <line x1="10" y1="30" x2="235" y2="30" class="azelaic-timeline-line" data-allow-overlap />
      ${points}
    </svg>
    <ul class="azelaic-timeline-list">${list}</ul>
    <figcaption class="chart-source">※変化には個人差があり、効果を保証するものではありません。</figcaption>
  </figure>`;
}

// ④ 他成分との使い分け比較表(横スクロール)。
export function renderAzelaicIngredientCompareHtml() {
  const cols = ["主なターゲット", "刺激", "併用可否", "使う時間帯"];
  const rows = [
    ["アゼライン酸", "ニキビ・毛穴・赤み", "◎ 低め", "他成分と比較的併用しやすい", "朝・夜どちらも"],
    ["レチノール", "しわ・ハリ・ターンオーバー", "△ 出やすい", "刺激が強い成分との併用は避ける", "夜のみ推奨"],
    ["BPO(過酸化ベンゾイル)", "ニキビ(炎症)", "△ 出やすい", "レチノール等と同時使用は注意", "夜が中心"],
    ["トラネキサム酸", "美白・色素沈着", "◎ 低め", "他成分と併用しやすい", "朝・夜どちらも"],
    ["サリチル酸", "毛穴の詰まり・角栓", "○ 中程度", "ピーリング系との重ねがけは注意", "夜が中心"],
  ];

  const thead = `<tr><th>成分</th>${cols.map((c) => `<th>${escapeHtmlText(c)}</th>`).join("")}</tr>`;
  const tbody = rows
    .map(
      (r) =>
        `<tr><th scope="row">${escapeHtmlText(r[0])}</th><td>${escapeHtmlText(
          r[1]
        )}</td><td>${escapeHtmlText(r[2])}</td><td>${escapeHtmlText(r[3])}</td><td>${escapeHtmlText(
          r[4]
        )}</td></tr>`
    )
    .join("");

  return `<figure class="article-chart azelaic-table-figure">
    <figcaption class="chart-title">🔄 他の有効成分との使い分け</figcaption>
    <div class="azelaic-scroll-wrap">
      <table class="azelaic-compare-table">
        <thead>${thead}</thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
    <p class="azelaic-scroll-note">→ 横にスクロールできます</p>
  </figure>`;
}

// ⑤ 使用手順の階段図(洗顔→化粧水→アゼライン酸→保湿→(朝は)日焼け止め)。
export function renderAzelaicStepsHtml() {
  const title = "使う順番(スキンケアの手順)";
  const steps = [
    { label: "洗顔", amount: "" },
    { label: "化粧水", amount: "500円玉大" },
    { label: "アゼライン酸", amount: "米粒〜パール大" },
    { label: "保湿", amount: "" },
    { label: "日焼け止め(朝)", amount: "" },
  ];
  const stepW = 62;
  const bars = steps
    .map((s, i) => {
      const x = 6 + i * stepW;
      const h = 30 + i * 14;
      const y = 190 - h;
      return `<g>
        <rect x="${x}" y="${y}" width="${stepW - 8}" height="${h}" rx="6" class="azelaic-step-bar" />
        <text x="${x + (stepW - 8) / 2}" y="${y - 8}" text-anchor="middle" class="azelaic-step-num">${
        i + 1
      }</text>
      </g>`;
    })
    .join("");
  const labels = steps
    .map(
      (s, i) =>
        `<li><span class="azelaic-step-dot">${i + 1}</span><span><strong>${escapeHtmlText(
          s.label
        )}</strong>${s.amount ? `<span class="azelaic-step-amount">目安量: ${escapeHtmlText(s.amount)}</span>` : ""}</span></li>`
    )
    .join("");

  return `<figure class="article-chart azelaic-steps-figure">
    <figcaption class="chart-title">📋 ${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 320 200" class="azelaic-steps-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 洗顔、化粧水、アゼライン酸、保湿、朝は日焼け止めの順に使う階段図">
      <title>洗顔から日焼け止めまでの使用順序を示す階段図</title>
      ${bars}
    </svg>
    <ol class="azelaic-steps-list">${labels}</ol>
  </figure>`;
}
