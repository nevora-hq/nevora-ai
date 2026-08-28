// 「くせ毛タイプ別まとまる髪型ガイド」記事(content/articles/2026-08-05_くせ毛タイプ別まとまる髪型ガイド.md)
// 専用のSVG/HTML図解ウィジェット。他記事のchart type(renderBarChartHtml等)には
// 影響を与えないよう、lib/posts.js の renderChartHtml から type 名で分岐して呼び出す
// (lib/drySkinWidgets.js と同じ設計方針)。クライアント側JS不要(静的HTML/SVG文字列)。
// 装飾のみのSVGは aria-hidden、情報を持つSVGには role="img" + <title> を付与する。

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① 毛髪の断面図(直毛=円形/うねり毛=楕円/強いくせ毛=扁平)+毛穴の歪みを並べて示す。
export function renderHairCrossSectionHtml() {
  const title = "毛髪の断面図でみるタイプの違い";
  const items = [
    {
      x: 20,
      shape: `<ellipse cx="55" cy="70" rx="26" ry="26" fill="#F3E2D3" stroke="#8B6F52" stroke-width="3" />`,
      pore: `<path d="M40 128 q15 -10 30 0 q-15 10 -30 0" fill="#E8CFC4" stroke="#8B6F52" stroke-width="2" />`,
      label: "直毛",
      sub: "断面はほぼ円形",
      subLine2: "",
    },
    {
      x: 140,
      shape: `<ellipse cx="175" cy="70" rx="30" ry="19" fill="#F3E2D3" stroke="#8B6F52" stroke-width="3" transform="rotate(15 175 70)" />`,
      pore: `<path d="M158 130 q17 -16 34 -2 q-15 14 -34 2" fill="#E8CFC4" stroke="#8B6F52" stroke-width="2" />`,
      label: "うねり毛",
      sub: "楕円形でやや",
      subLine2: "歪んだ毛穴",
    },
    {
      x: 260,
      shape: `<ellipse cx="295" cy="70" rx="32" ry="13" fill="#F3E2D3" stroke="#8B6F52" stroke-width="3" transform="rotate(-8 295 70)" />`,
      pore: `<path d="M276 132 q19 -22 38 -4 q-17 16 -38 4" fill="#E8CFC4" stroke="#8B6F52" stroke-width="2" />`,
      label: "強いくせ毛",
      sub: "扁平で毛穴も",
      subLine2: "大きく歪む",
    },
  ];

  const groups = items
    .map(
      (it) => `<g>
        ${it.shape}
        ${it.pore}
        <text x="${it.x + 55}" y="152" text-anchor="middle" class="hairtype-diagram-label-main">${escapeHtmlText(
          it.label
        )}</text>
        <text x="${it.x + 55}" y="168" text-anchor="middle" class="hairtype-diagram-label-sub">${escapeHtmlText(
          it.sub
        )}</text>
        ${
          it.subLine2
            ? `<text x="${it.x + 55}" y="185" text-anchor="middle" class="hairtype-diagram-label-sub">${escapeHtmlText(
                it.subLine2
              )}</text>`
            : ""
        }
      </g>`
    )
    .join("");

  return `<figure class="article-chart hairtype-diagram">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 360 202" class="hairtype-diagram-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 直毛の断面はほぼ円形、うねり毛は楕円形、強いくせ毛は扁平な形をしており、毛穴の形も同じ順で歪みが強くなる">
      <title>直毛・うねり毛・強いくせ毛の断面と毛穴の形の比較図</title>
      <rect x="0" y="0" width="360" height="202" rx="10" fill="#FBF5F0" />
      ${groups}
      <line x1="128" y1="30" x2="128" y2="145" stroke="#E8CFC4" stroke-width="1.5" stroke-dasharray="3 5" />
      <line x1="248" y1="30" x2="248" y2="145" stroke="#E8CFC4" stroke-width="1.5" stroke-dasharray="3 5" />
    </svg>
    <p class="hairtype-diagram-caption">毛髪は断面が丸いほどまっすぐ伸び、扁平になるほどねじれてくせが強く出ます。</p>
  </figure>`;
}

// ② 診断フローチャート(濡れているときのうねり方/乾かしたときの広がり方/
// 湿度が高い日の変化の3問)。SVGで縦方向の質問→分岐を示しつつ、
// スクリーンリーダー・非SVG環境向けに<details>で同内容をテキスト表でも提示する。
export function renderHairDiagnosisFlowHtml() {
  const title = "3つの質問でわかる くせ毛タイプ診断フロー";
  const questions = [
    { q: "Q1. 濡れているとき毛先は?", a: "耳から下でS字にうねる → うねりタイプへ" },
    { q: "Q2. 乾かすと根元〜頭頂部は?", a: "ふわっと大きく広がる → 広がりタイプへ" },
    { q: "Q3. 湿度が高い日、毛先は?", a: "根元は素直で毛先だけピンとハネる → 毛先ハネタイプへ" },
  ];

  const boxes = questions
    .map((item, i) => {
      const y = 20 + i * 62;
      return `<g>
        <rect x="16" y="${y}" width="328" height="44" rx="10" fill="#FFFFFF" stroke="#8B6F52" stroke-width="2" />
        <text x="30" y="${y + 18}" class="hairtype-flow-q">${escapeHtmlText(item.q)}</text>
        <text x="30" y="${y + 36}" class="hairtype-flow-a">${escapeHtmlText(item.a)}</text>
        ${
          i < questions.length - 1
            ? `<line x1="180" y1="${y + 44}" x2="180" y2="${
                y + 62
              }" stroke="#8B6F52" stroke-width="2" marker-end="url(#hairFlowArrow)" />`
            : ""
        }
      </g>`;
    })
    .join("");

  const tableRows = questions
    .map((item) => `<tr><td>${escapeHtmlText(item.q)}</td><td>${escapeHtmlText(item.a)}</td></tr>`)
    .join("");

  return `<figure class="article-chart hairtype-flow">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 360 210" class="hairtype-flow-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: 3つの質問に順に答えて自分のくせ毛タイプ(うねり/広がり/毛先ハネ)を判定する図">
      <title>くせ毛タイプ診断フローチャート(3問)</title>
      <defs>
        <marker id="hairFlowArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#8B6F52" />
        </marker>
      </defs>
      <rect x="0" y="0" width="360" height="210" rx="10" fill="#F8EDE7" />
      ${boxes}
    </svg>
    <details class="chart-table-toggle">
      <summary>診断内容を文章で見る</summary>
      <table class="chart-table">
        <thead><tr><th>質問</th><th>あてはまる場合のタイプ</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </details>
  </figure>`;
}

// ④ おすすめスタイルのシルエット図(ロブ/レイヤーミディ/ワンレンロング/ショートボブ)を
// 線画で並べ、それぞれ合いやすいタイプのバッジを添える。
export function renderHairSilhouetteHtml() {
  const title = "タイプ別 おすすめヘアシルエット";
  const styles = [
    {
      name: "ロブ",
      badge: "うねりタイプ向き",
      path: "M60 18 C40 18 30 40 32 62 C34 86 40 104 46 118 L74 118 C80 104 86 86 88 62 C90 40 80 18 60 18 Z",
    },
    {
      name: "レイヤーミディ",
      badge: "うねりタイプ向き",
      path: "M60 16 C38 16 28 38 30 60 C31 92 40 118 48 132 L52 96 L60 132 L68 96 L72 132 C80 118 89 92 90 60 C92 38 82 16 60 16 Z",
    },
    {
      name: "ワンレンロング",
      badge: "広がりタイプ向き",
      path: "M60 16 C40 16 30 36 31 58 C32 98 40 132 48 150 L72 150 C80 132 88 98 89 58 C90 36 80 16 60 16 Z",
    },
    {
      name: "ショートボブ",
      badge: "毛先ハネタイプ向き",
      path: "M60 20 C42 20 33 38 34 58 C35 74 40 86 46 96 L74 96 C80 86 85 74 86 58 C87 38 78 20 60 20 Z",
    },
  ];

  const tiles = styles
    .map(
      (s) => `<div class="hairtype-silhouette-tile">
        <svg viewBox="0 0 120 160" class="hairtype-silhouette-svg" role="img" aria-label="${escapeHtmlText(
          s.name
        )}のシルエット">
          <title>${escapeHtmlText(s.name)}のヘアシルエット</title>
          <circle cx="60" cy="30" r="18" fill="none" stroke="#3A2E26" stroke-width="2" />
          <path d="${s.path}" fill="#E8CFC4" stroke="#8B6F52" stroke-width="2.5" />
        </svg>
        <p class="hairtype-silhouette-name">${escapeHtmlText(s.name)}</p>
        <span class="hairtype-silhouette-badge">${escapeHtmlText(s.badge)}</span>
      </div>`
    )
    .join("");

  return `<figure class="article-chart hairtype-silhouette-block">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <div class="hairtype-silhouette-grid" role="img" aria-label="${escapeHtmlText(
      title
    )}: ロブとレイヤーミディアムはうねりタイプ、ワンレングスロングは広がりタイプ、ショートボブは毛先ハネタイプに合いやすい線画シルエット">
      ${tiles}
    </div>
    <p class="hairtype-diagram-caption">同じ長さでも、レイヤーの量や毛先の重さでまとまり方は大きく変わります。</p>
  </figure>`;
}

// ⑥ 乾かし方4ステップの手順図(タオルドライ→根元から乾かす→引っ張りながら中間毛先
// →冷風で固定)。ドライヤーの向き(角度)を矢印で図示する。
// SVG内に説明文まで詰め込むと90px間隔のスロットに収まらず隣の説明と重なって
// 読めなくなるため、SVGは番号・矢印・ドライヤー角度のみの図解に留め、説明文は
// SVGの外側の通常のHTMLリスト(法定の12px以上を確保しやすい)で示す。
export function renderHairDryingStepsHtml() {
  const title = "くせ毛がまとまる乾かし方 4ステップ";
  const steps = [
    { n: 1, label: "タオルドライ", desc: "こすらず押さえるように水分を取る" },
    { n: 2, label: "根元から乾かす", desc: "ドライヤーを根元に向け斜め上から風を送る" },
    { n: 3, label: "中間〜毛先", desc: "軽く下に引っ張りながら乾かす" },
    { n: 4, label: "冷風で固定", desc: "仕上げに冷風をあて形をキープ" },
  ];

  const items = steps
    .map((s, i) => {
      const cx = 45 + i * 90;
      return `<g>
        <circle cx="${cx}" cy="34" r="20" fill="#8B6F52" />
        <text x="${cx}" y="41" text-anchor="middle" class="hairtype-step-num">${s.n}</text>
        ${
          s.n === 2
            ? `<path d="M${cx - 30} 70 L${cx - 8} 58" stroke="#E8CFC4" stroke-width="6" stroke-linecap="round" marker-end="url(#hairDryerArrow)" />`
            : ""
        }
        <text x="${cx}" y="86" text-anchor="middle" class="hairtype-step-label">${escapeHtmlText(
          s.label
        )}</text>
        ${
          i < steps.length - 1
            ? `<line x1="${cx + 20}" y1="34" x2="${
                cx + 70
              }" y2="34" stroke="#8B6F52" stroke-width="2" marker-end="url(#hairStepArrow)" />`
            : ""
        }
      </g>`;
    })
    .join("");

  const listItems = steps
    .map(
      (s) => `<li><span class="hairtype-steps-list-label">${escapeHtmlText(
        s.label
      )}</span><span class="hairtype-steps-list-desc">${escapeHtmlText(s.desc)}</span></li>`
    )
    .join("");

  return `<figure class="article-chart hairtype-steps">
    <figcaption class="chart-title">${escapeHtmlText(title)}</figcaption>
    <svg viewBox="0 0 360 100" class="hairtype-steps-svg" role="img" aria-label="${escapeHtmlText(
      title
    )}: タオルドライ、根元から乾かす、中間から毛先を乾かす、冷風で固定の4ステップ">
      <title>くせ毛の乾かし方4ステップとドライヤーの角度</title>
      <defs>
        <marker id="hairStepArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#8B6F52" />
        </marker>
        <marker id="hairDryerArrow" markerWidth="7" markerHeight="7" refX="3" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" fill="#E8CFC4" />
        </marker>
      </defs>
      ${items}
    </svg>
    <ol class="hairtype-steps-list">${listItems}</ol>
  </figure>`;
}

// ✅ 今日からできるチェックリスト(frontmatterのcharts[].itemsから生成)。
// SVGではなく、チェック用のスタイルを当てた通常のリストHTML(styles/globals.cssの
// .hairtype-checklist)。renderProsConsHtml等と同じく静的HTMLで組み立てる。
export function renderHairChecklistHtml(chart) {
  const { title = "今日からできるチェックリスト", items } = chart;
  const list = (Array.isArray(items) ? items : [])
    .map((item) => `<li>${escapeHtmlText(item)}</li>`)
    .join("");

  return `<div class="hairtype-checklist">
    <p class="hairtype-checklist-title">✅ ${escapeHtmlText(title)}</p>
    <ul>${list}</ul>
  </div>`;
}

// 記事末の「まとめカード」(結論3行+次の一歩+関連記事リンク)を
// frontmatterのcharts[].conclusion/nextStep/linksから組み立てる。
export function renderHairSummaryCardHtml(chart) {
  const { conclusion, nextStep, links } = chart;
  const conclusionItems = (Array.isArray(conclusion) ? conclusion : [])
    .map((c) => `<li>${escapeHtmlText(c)}</li>`)
    .join("");
  const linkItems = (Array.isArray(links) ? links : [])
    .map(
      (l) =>
        `<li><a href="${escapeHtmlText(l.url)}">${escapeHtmlText(l.label)}</a></li>`
    )
    .join("");

  return `<div class="hairtype-summary-card">
    <h3>結論はこの3つ</h3>
    <ul>${conclusionItems}</ul>
    ${nextStep ? `<h3>次の一歩</h3><p>${escapeHtmlText(nextStep)}</p>` : ""}
    ${linkItems ? `<h3>あわせて読みたい記事</h3><ul>${linkItems}</ul>` : ""}
  </div>`;
}

// H2見出しごとに本文を<section>で囲み、背景を白⇔テーマカラー淡色⇔罫線カードの
// 3種で交互に変える(この記事専用。lib/summerMakeupExtras.jsのwrapMakeupSectionsと
// 同じ設計)。charts/accordions/マスコットの挿入がすべて終わったあと、最後に一度だけ実行する。
export function wrapHairTypeSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["hairtype-section-plain", "hairtype-section-tint", "hairtype-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part;
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="hairtype-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}

// 幅375pxでの横スクロールを防ぐため、本文中のGFM表(<table>)をスクロール可能な
// ラッパーで囲み、「→ 横にスクロールできます」という案内文を添える(この記事専用)。
// 外側に非スクロールのdiv(.table-scroll-outer)を置き、右端フェード(::afterで
// 実装、CSS参照)がスクロール位置に関係なく表の右端に固定表示されるようにする。
// これにより、表が幅いっぱいで切れて見える(スクロールできると気づきにくい)
// 問題を視覚的に解消する。
export function wrapHairTypeTables(html) {
  return html.replace(
    /<table>/g,
    `<div class="table-scroll-outer"><p class="table-scroll-note">→ 横にスクロールできます</p><div class="table-scroll-wrap"><table>`
  ).replace(/<\/table>/g, `</table></div></div>`);
}
