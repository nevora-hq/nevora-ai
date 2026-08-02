// サイト公式マスコットキャラクターの設定。
// メインマスコット(ピコルくん)はサイト全体の案内役でカテゴリに紐付かない
// (about・ホームの案内バナー等で個別に使用する。MAIN_MASCOTを参照)。
// CATEGORY_MASCOTSは大カテゴリ名(lib/categoryMeta.jsのMAJOR_CATEGORIESと一致)を
// キーとする案内キャラクター。カテゴリが増減した場合はcategoryMeta.jsの更新に合わせて
// ここにも追記・修正すること(未登録カテゴリはnullを返し、マスコットは非表示になる)。
export const MAIN_MASCOT = {
  name: "ピコルくん",
  role: "サイト全体の案内役",
  normalImage: "/images/mascot/picoru-normal.svg",
  researchImage: "/images/mascot/picoru-research.svg",
  comments: [
    "AIツールは色々あるから、目的に合わせて使い分けるのがコツだよ。",
    "まずは無料プランで試してみて、自分に合うか確かめてみてね。",
    "新しい機能はどんどん出てくるから、一緒に最新情報を追いかけよう。",
  ],
};

const GENNERU = {
  name: "ジェネル",
  normalImage: "/images/mascot/genneru-normal.svg",
  researchImage: "/images/mascot/genneru-research.svg",
  comments: [
    "画像も文章も、プロンプトの書き方ひとつで仕上がりがぐっと変わるよ。",
    "同じツールでも設定を変えると、全然違うものが生まれるから面白いんだ。",
    "まずは無料枠で試して、自分の作りたいイメージを言葉にしてみてね。",
  ],
};

const TSUURI = {
  name: "ツーリ",
  normalImage: "/images/mascot/tsuuri-normal.svg",
  researchImage: "/images/mascot/tsuuri-research.svg",
  comments: [
    "ツールは数より相性。まず1つ、目的に合うものを選んでみて。",
    "無料プランと有料プランの違いは、事前にしっかり比べておこう。",
    "似たツールでも得意分野が違うから、用途別に使い分けるのがコツだよ。",
  ],
};

const HIRAME = {
  name: "ヒラメ",
  normalImage: "/images/mascot/hirame-normal.svg",
  researchImage: "/images/mascot/hirame-research.svg",
  comments: [
    "ちょっとした一工夫で、作業時間がぐっと短くなることもあるよ。",
    "まずは真似から始めて、自分なりのやり方に育てていこう。",
    "小さく試して、うまくいったら習慣にするのがコツだよ。",
  ],
};

const LOOPY = {
  name: "ルーピー",
  normalImage: "/images/mascot/loopy-normal.svg",
  researchImage: "/images/mascot/loopy-research.svg",
  comments: [
    "一度仕組みを作っておけば、あとは自動で回ってくれるよ。",
    "繰り返しの作業ほど、自動化の効果が大きいんだ。",
    "最初の設定だけ丁寧にやれば、あとがぐっと楽になるよ。",
  ],
};

const CODI = {
  name: "コーディ",
  normalImage: "/images/mascot/codi-normal.svg",
  researchImage: "/images/mascot/codi-research.svg",
  comments: [
    "エラーが出ても焦らないで。原因を一つずつ切り分けていこう。",
    "コードの意味がわからないときは、AIに聞いてみるのも手だよ。",
    "小さく動かして確認しながら進めるのが、遠回りに見えて一番早いんだ。",
  ],
};

const MANABI = {
  name: "マナビ",
  normalImage: "/images/mascot/manabi-normal.svg",
  researchImage: "/images/mascot/manabi-research.svg",
  comments: [
    "難しく感じたら、基本の用語からゆっくり整理していこう。",
    "わからないことは、そのままにせず一つずつ潰していこうね。",
    "実際に手を動かしてみると、理解がぐっと深まるよ。",
  ],
};

const BIZZY = {
  name: "ビズィ",
  normalImage: "/images/mascot/bizzy-normal.svg",
  researchImage: "/images/mascot/bizzy-research.svg",
  comments: [
    "数字で効果を確認しながら進めると、判断がぶれにくくなるよ。",
    "小さく始めて、成果が見えたら投資を広げるのが堅実だね。",
    "流行りだけで飛びつかず、自社の課題に合うか見極めよう。",
  ],
};

const SIGNA = {
  name: "シグナ",
  normalImage: "/images/mascot/signa-normal.svg",
  researchImage: "/images/mascot/signa-research.svg",
  comments: [
    "AI業界は変化が早いから、こまめに情報をチェックしておこう。",
    "新しい発表が出たときほど、一次情報を確認するのが大事だよ。",
    "話題になっているニュースほど、鵜呑みにせず背景を調べてみてね。",
  ],
};

const CATEGORY_MASCOTS = {
  "生成AI": GENNERU,
  "AIツール": TSUURI,
  "AI活用術": HIRAME,
  "AI自動化": LOOPY,
  "AI開発": CODI,
  "AI学習": MANABI,
  "AIビジネス": BIZZY,
  "AI最新ニュース・知識": SIGNA,
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

export function getMainMascot(seed = MAIN_MASCOT.name, overrideComment = "") {
  return { ...MAIN_MASCOT, comment: overrideComment || pickComment(MAIN_MASCOT, seed) };
}
