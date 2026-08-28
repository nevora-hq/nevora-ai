// 「ファンデーション崩れタイプ別比較」記事(content/articles/2026-07-26_ファンデーション崩れタイプ別比較.md)
// 専用の本文後処理。他記事には一切影響しない(呼び出し元でslug一致時のみ実行)。
// テーマカラー: モカブラウン#B08968

export const FOUNDATION_COMPARE_SLUG = "2026-07-26_ファンデーション崩れタイプ別比較";

// H2見出し単位でセクションを区切り、白 / モカブラウン薄色 / 罫線カードの
// 3パターンを順番に繰り返して適用する(lipCompareExtras.jsのwrapLipCompareSectionsと
// 同じ仕組みをこの記事専用クラス名で踏襲)。
export function wrapFoundationSections(html) {
  const parts = html.split(/(?=<h2[ >])/);
  if (parts.length <= 1) return html;

  const bgClasses = ["fnd-section-plain", "fnd-section-tint", "fnd-section-card"];
  let sectionIndex = 0;

  const wrapped = parts.map((part) => {
    if (!/^<h2[ >]/.test(part)) return part; // 最初のh2より前はそのまま
    const cls = bgClasses[sectionIndex % bgClasses.length];
    sectionIndex += 1;
    return `<section class="fnd-section ${cls}">${part}</section>`;
  });

  return wrapped.join("");
}

// タイプ別おすすめの3つのh3見出し(🟡皮脂崩れ/💧乾燥崩れ/🌗混合ヨレ)に、
// テーマカラーのラベルバッジ(pill)を付与する。見出しテキストを直接
// マッチングするため、この記事以外のh3には影響しない。
const TYPE_BADGES = [
  { match: "皮脂崩れタイプに向いているファンデ", label: "皮脂崩れ向け", cls: "fnd-badge-sebum" },
  { match: "乾燥崩れタイプに向いているファンデ", label: "乾燥崩れ向け", cls: "fnd-badge-dry" },
  { match: "混合ヨレタイプに向いているファンデ", label: "混合ヨレ向け", cls: "fnd-badge-mix" },
];

export function addFoundationTypeBadges(html) {
  let result = html;
  TYPE_BADGES.forEach(({ match, label, cls }) => {
    const re = new RegExp(`(<h3[^>]*>)([^<]*${match}[^<]*)(</h3>)`);
    result = result.replace(
      re,
      (whole, open, text, close) =>
        `${open}<span class="fnd-badge ${cls}">${label}</span>${text}${close}`
    );
  });
  return result;
}
