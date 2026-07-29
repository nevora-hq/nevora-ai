// カテゴリ別のマスコットキャラクター設定。
// 現状はジャンル(対象分野はプロジェクト直下のCLAUDE.mdが唯一の情報源)全体で
// AI活用ブランチのみ「ピコルくん」を割り当てている。
// 実際のカテゴリ名はキーワード調査・記事制作が進み次第確定するため、
// カテゴリページ設計時にCATEGORY_MASCOTSのキーを実際のカテゴリ名に合わせて追記・修正すること
// (未登録カテゴリはnullを返し、マスコットは非表示になる)。
const PICORU = {
  name: "ピコルくん",
  normalImage: "/images/mascot/picoru-normal.svg",
  researchImage: "/images/mascot/picoru-research.svg",
  comments: [
    "AIツールは色々あるから、目的に合わせて使い分けるのがコツだよ。",
    "まずは無料プランで試してみて、自分に合うか確かめてみてね。",
    "新しい機能はどんどん出てくるから、一緒に最新情報を追いかけよう。",
  ],
};

const CATEGORY_MASCOTS = {
  "AI活用": PICORU,
};

function pickComment(mascot, seed) {
  const sum = String(seed)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return mascot.comments[sum % mascot.comments.length];
}

export function getCategoryMascot(categoryName, seed = categoryName, overrideComment = "") {
  const mascot = CATEGORY_MASCOTS[categoryName];
  if (!mascot) return null;
  return { ...mascot, comment: overrideComment || pickComment(mascot, seed) };
}
