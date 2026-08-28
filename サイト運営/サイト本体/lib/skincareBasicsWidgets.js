// 「基礎化粧品とは？化粧水・乳液・美容液の役割と正しい順番、自分の肌質の見分け方」記事
// (content/articles/2026-07-26_基礎化粧品の基本知識と肌質診断.md)専用の
// SVG/HTML図解ウィジェット(2026-08-07 入門ガイドリニューアル)。
// 他記事のchart type(renderBarChartHtml等)には影響を与えないよう、lib/posts.js の
// renderChartHtml から type 名で分岐して呼び出す(前髪の巻き方記事のlib/maegamiWidgets.js等と
// 同じ設計方針)。クライアント側JS不要(静的HTML/SVG文字列)。装飾のみのSVGは
// aria-hidden、情報を持つSVGには role="img" + <title> を付与する。
// 配色はテーマカラー(ミルクベージュ#C8A882 / アイボリー#FBF7F0 / グリーンティー#8FA37E)を
// 直接ハードコードしており、サイト全体のCSS変数には依存しない(スコープ用テーマクラスを
// 導入していないため)。

export const SKINCARE_BASICS_SLUG = "2026-07-26_基礎化粧品の基本知識と肌質診断";

const BEIGE = "#C8A882";
const BEIGE_DARK = "#8B6F52";
const IVORY = "#FBF7F0";
const GREEN = "#8FA37E";
const GREEN_DARK = "#6B8161";
const TEXT_DARK = "#4A3F35";

function escapeHtmlText(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ① SVG役割図: 顔の断面に化粧水=水分/美容液=集中ケア/乳液・クリーム=フタ を配置する。
export function renderRoleDiagramHtml() {
  const alt =
    "基礎化粧品の役割図。肌に近い順に、化粧水が水分を与え、美容液が悩みに集中アプローチし、乳液・クリームがフタをして水分の蒸発を防ぐ3層構造";

  return `<figure class="article-chart sc101-figure">
    <figcaption class="chart-title">基礎化粧品の役割イメージ図</figcaption>
    <svg viewBox="0 0 320 220" class="sc101-svg" role="img" aria-label="${escapeHtmlText(alt)}">
      <title>${escapeHtmlText(alt)}</title>
      <!-- 肌の断面(下から角層・表皮のイメージ) -->
      <rect x="20" y="150" width="280" height="50" rx="8" fill="#F1E3D3" stroke="${BEIGE}" stroke-width="1.5" />
      <text x="160" y="180" text-anchor="middle" class="sc101-svg-label-sm">肌(角層)</text>

      <!-- 化粧水層: 水分を与える(水滴アイコン)。肌に最も近い層のため、美容液より下(角層寄り)に配置する -->
      <rect x="20" y="118" width="280" height="30" rx="8" fill="#DCEFF5" stroke="#8FC6DC" stroke-width="1.5" />
      <path d="M46,122 C40,130 40,137 46,137 C52,137 52,130 46,122 Z" fill="#4FA6C9" aria-hidden="true" />
      <text x="160" y="137" text-anchor="middle" class="sc101-svg-label-sm">化粧水: 水分を与える</text>

      <!-- 美容液層: 悩みに集中アプローチ(星アイコン)。化粧水の後・乳液の前に使うため、化粧水より上に配置する -->
      <rect x="20" y="80" width="280" height="30" rx="8" fill="#EADFF2" stroke="#B79FCB" stroke-width="1.5" />
      <g transform="translate(46,95)" aria-hidden="true">
        <path d="M0,-8 L2.4,-2.4 L8,-2.4 L3.6,1.2 L5.6,7.6 L0,4 L-5.6,7.6 L-3.6,1.2 L-8,-2.4 L-2.4,-2.4 Z" fill="#8E6FB0" />
      </g>
      <text x="160" y="99" text-anchor="middle" class="sc101-svg-label-sm">美容液: 悩みに集中アプローチ</text>

      <!-- 乳液・クリーム層: フタをする(フタ/カバーアイコン) -->
      <rect x="20" y="42" width="280" height="30" rx="8" fill="#F1E9DA" stroke="${BEIGE}" stroke-width="1.5" />
      <rect x="38" y="50" width="16" height="8" rx="2" fill="${BEIGE_DARK}" aria-hidden="true" />
      <ellipse cx="46" cy="50" rx="9" ry="3" fill="${BEIGE_DARK}" aria-hidden="true" />
      <text x="160" y="61" text-anchor="middle" class="sc101-svg-label-sm">乳液・クリーム: フタをする</text>

      <!-- 上から下へ向かう矢印(重ねる方向) -->
      <line x1="290" y1="30" x2="290" y2="150" stroke="${GREEN_DARK}" stroke-width="2.5" marker-end="url(#sc101ArrowDown)" />
      <defs>
        <marker id="sc101ArrowDown" markerWidth="9" markerHeight="9" refX="4.5" refY="8" orient="auto">
          <path d="M0,0 L4.5,8 L9,0 Z" fill="${GREEN_DARK}" />
        </marker>
      </defs>
      <text x="290" y="20" text-anchor="middle" class="sc101-svg-label-sm">重ねる順</text>
    </svg>
  </figure>`;
}

// ② SVG縦フロー図: クレンジング→洗顔→化粧水→美容液→乳液→クリーム→日焼け止め を階段状に表示。
export function renderFlowDiagramHtml() {
  const steps = [
    "クレンジング",
    "洗顔",
    "化粧水",
    "美容液",
    "乳液",
    "クリーム",
    "日焼け止め",
  ];
  const stepW = 92;
  const stepHGap = 24;
  const baseH = 34;
  const width = steps.length * (stepW - 18) + 18;
  const height = steps.length * stepHGap + baseH + 20;

  const blocks = steps
    .map((label, i) => {
      const x = i * (stepW - 18);
      const y = height - baseH - i * stepHGap - baseH;
      const fill = i % 2 === 0 ? BEIGE : GREEN;
      const arrow =
        i < steps.length - 1
          ? `<line x1="${x + stepW - 4}" y1="${y + baseH / 2}" x2="${
              x + stepW + 14
            }" y2="${y - stepHGap + baseH / 2}" stroke="#8B7A63" stroke-width="2" marker-end="url(#sc101ArrowStair)" data-allow-overlap />`
          : "";
      return `<g>
        <rect x="${x}" y="${y}" width="${stepW}" height="${baseH}" rx="6" fill="${fill}" />
        <text x="${x + stepW / 2}" y="${
          y + baseH / 2 + 4
        }" text-anchor="middle" class="sc101-svg-step-label">${i + 1}. ${escapeHtmlText(label)}</text>
        ${arrow}
      </g>`;
    })
    .join("");

  const alt = `基礎化粧品を使う正しい順番のフロー図: ${steps.join("→")}。テクスチャの軽いものから順に重ねる`;

  return `<figure class="article-chart sc101-figure">
    <figcaption class="chart-title">基礎化粧品を使う順番(階段イメージ)</figcaption>
    <div class="sc101-scroll-wrap">
      <svg viewBox="0 0 ${width + 60} ${height}" class="sc101-flow-svg" role="img" aria-label="${escapeHtmlText(alt)}">
        <title>${escapeHtmlText(alt)}</title>
        <defs>
          <marker id="sc101ArrowStair" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#8B7A63" />
          </marker>
        </defs>
        ${blocks}
      </svg>
    </div>
    <p class="sc101-scroll-note">→ 横にスクロールできます</p>
    <p class="sc101-diagram-rule">ルール: テクスチャの軽い順に重ねる(サラサラ→こってり)</p>
  </figure>`;
}

// ③ SVG診断図: 洗顔後10分放置テストで肌質を判定する2×2マトリクス
// (Tゾーン: テカる/テカらない × Uゾーン: つっぱる/つっぱらない)。
export function renderDiagnosisMatrixHtml() {
  const size = 300;
  // marginLeft: 左側(Uゾーン軸ラベル)用の余白 / marginTop: 上側(Tゾーン軸ラベル)用の余白。
  // 以前は上側の余白を確保しておらず、Tゾーンの軸ラベルが象限セルの内側(y=0起点)に
  // 重なって描画されていたため、上下で分けて確保する(2026-08-10修正)。
  const marginLeft = 90;
  const marginTop = 40;
  const bottomPad = 10;
  const plot = size - marginLeft;
  const half = plot / 2;

  // desc(Tゾーン/Uゾーンの組み合わせ説明)は "Tテカる/Uつっぱる" のように
  // "/" 区切りの1行テキストだったが、象限セル幅(half=105px)に対して
  // 12px級フォントで11文字前後になり収まりきらず、隣の象限のdescと
  // 中央の境界線上で文字が重なって潰れていた。"/" で2行に分割し、
  // 1行あたりの実効幅を半分程度にすることで重なりを解消する。
  const quadrants = [
    { x: marginLeft, y: marginTop, label: "混合肌", desc: "Tテカる/Uつっぱる", color: "#EADFF2" },
    { x: marginLeft + half, y: marginTop, label: "脂性肌", desc: "Tテカる/Uつっぱらない", color: "#DCEFF5" },
    { x: marginLeft, y: marginTop + half, label: "乾燥肌", desc: "Tテカらない/Uつっぱる", color: "#F1E9DA" },
    { x: marginLeft + half, y: marginTop + half, label: "普通肌", desc: "Tテカらない/Uつっぱらない", color: "#E4EEDF" },
  ];

  const cells = quadrants
    .map((q) => {
      const centerX = q.x + half / 2;
      const centerY = q.y + half / 2;
      const [descLine1, descLine2] = q.desc.split("/");
      return `<g>
        <rect x="${q.x}" y="${q.y}" width="${half}" height="${half}" fill="${q.color}" stroke="#D8CBBA" stroke-width="1" />
        <text x="${centerX}" y="${
          centerY - 14
        }" text-anchor="middle" class="sc101-matrix-type">${escapeHtmlText(q.label)}<title>${escapeHtmlText(
        q.desc
      )}</title></text>
        <text x="${centerX}" y="${
          centerY + 11
        }" text-anchor="middle" class="sc101-matrix-desc">${escapeHtmlText(descLine1)}</text>
        <text x="${centerX}" y="${
          centerY + 31
        }" text-anchor="middle" class="sc101-matrix-desc">${escapeHtmlText(descLine2)}</text>
      </g>`;
    })
    .join("");

  const alt =
    "肌質セルフ診断マトリクス。Tゾーンがテカるかどうかと、Uゾーン(頬)がつっぱるかどうかの組み合わせで、混合肌・脂性肌・乾燥肌・普通肌の4タイプに分かれる";

  const svgHeight = marginTop + plot + bottomPad;

  return `<figure class="article-chart sc101-figure">
    <figcaption class="chart-title">洗顔後10分放置テストで分かる肌質診断</figcaption>
    <svg viewBox="0 0 ${size} ${svgHeight}" class="sc101-matrix-svg" role="img" aria-label="${escapeHtmlText(alt)}">
      <title>${escapeHtmlText(alt)}</title>
      ${cells}
      <!-- 軸ラベル(上側marginTopの余白内に収める) -->
      <text x="${marginLeft + plot / 2}" y="16" text-anchor="middle" class="sc101-axis-label">Tゾーン</text>
      <text x="${marginLeft + half / 2}" y="34" text-anchor="middle" class="sc101-axis-sub">テカる</text>
      <text x="${marginLeft + half + half / 2}" y="34" text-anchor="middle" class="sc101-axis-sub">テカらない</text>
      <text x="18" y="${marginTop + plot / 2}" text-anchor="middle" class="sc101-axis-label" transform="rotate(-90 18 ${marginTop + plot / 2})">Uゾーン(頬)</text>
      <text x="${marginLeft - 8}" y="${marginTop + half / 2 + 4}" text-anchor="end" class="sc101-axis-sub">つっぱる</text>
      <text x="${marginLeft - 8}" y="${marginTop + half + half / 2 + 4}" text-anchor="end" class="sc101-axis-sub">つっぱらない</text>
    </svg>
    <details class="chart-table-toggle">
      <summary>データを表で見る</summary>
      <table class="chart-table">
        <thead><tr><th>Tゾーン</th><th>Uゾーン(頬)</th><th>タイプ</th></tr></thead>
        <tbody>
          <tr><td>テカる</td><td>つっぱる</td><td>混合肌</td></tr>
          <tr><td>テカる</td><td>つっぱらない</td><td>脂性肌</td></tr>
          <tr><td>テカらない</td><td>つっぱる</td><td>乾燥肌</td></tr>
          <tr><td>テカらない</td><td>つっぱらない</td><td>普通肌</td></tr>
        </tbody>
      </table>
    </details>
  </figure>`;
}

// ④ SVG分量図: 1回の使用量の目安を実寸感が伝わるシルエットで示す。
export function renderAmountDiagramHtml() {
  const items = [
    { label: "化粧水", amount: "500円玉大", r: 26, cx: 55, color: "#8FC6DC" },
    { label: "美容液", amount: "パール1粒", r: 7, cx: 150, color: "#8E6FB0" },
    { label: "乳液", amount: "1円玉2個分", r: 16, cx: 230, color: BEIGE },
    { label: "クリーム", amount: "パール2粒", r: 9, cx: 300, color: BEIGE_DARK },
  ];
  const alt =
    "1回に使う基礎化粧品の量の目安。化粧水は500円玉大、美容液はパール1粒、乳液は1円玉2個分、クリームはパール2粒が目安";

  const shapes = items
    .map(
      (it) => `<g>
        <circle cx="${it.cx}" cy="60" r="${it.r}" fill="${it.color}" fill-opacity="0.75"><title>${escapeHtmlText(
        `${it.label}: ${it.amount}`
      )}</title></circle>
        <text x="${it.cx}" y="100" text-anchor="middle" class="sc101-svg-label-sm">${escapeHtmlText(it.label)}</text>
        <text x="${it.cx}" y="116" text-anchor="middle" class="sc101-amount-text">${escapeHtmlText(it.amount)}</text>
      </g>`
    )
    .join("");

  return `<figure class="article-chart sc101-figure">
    <figcaption class="chart-title">1回に使う量の目安(実寸イメージ)</figcaption>
    <div class="sc101-scroll-wrap">
      <svg viewBox="0 0 360 130" class="sc101-amount-svg" role="img" aria-label="${escapeHtmlText(alt)}">
        <title>${escapeHtmlText(alt)}</title>
        ${shapes}
      </svg>
    </div>
    <p class="sc101-scroll-note">→ 横にスクロールできます</p>
    <p class="sc101-diagram-rule">円の大きさは目安の相対イメージです。実際の商品パッケージの表示量もあわせて確認してください。</p>
  </figure>`;
}
