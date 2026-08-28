// カテゴリ別のマスコットキャラクター設定。
// NEVORA公式マスコット体系。大カテゴリ12種 + サイト全体のメインマスコット
// 「ネヴォミンちゃん」で構成する。
// 各キャラは normalImage(挨拶)/researchImage(補足)/matomeImage(振り返り)の
// 3ポーズを持つ。
// 新ジャンル追加時はこのファイルに追記するだけで拡張できる設計を維持する。

export const CHAMIN = {
  name: "チャミンちゃん",
  normalImage: "/images/mascot/tsuyamin-normal.svg",
  researchImage: "/images/mascot/tsuyamin-research.svg",
  matomeImage: "/images/mascot/tsuyamin-matome.svg",
  comments: [
    "同じ質問でも、聞き方を変えると答えは大きく変わるよ。",
    "AIの答えは万能じゃないから、大事な情報は必ず自分でも確かめてね。",
  ],
  introComments: [
    "こんにちは、チャミンだよ!今日はチャットAIの使い方を見ていくね。",
    "やあ、チャミン参上!AIとの会話のコツ、一緒に覚えよう。",
  ],
  outroComments: [
    "今日のプロンプト、さっそく試してみてね。",
    "最後まで読んでくれてありがとう!また次の記事でね。",
  ],
};

export const EGAMIN = {
  name: "エガミンちゃん",
  normalImage: "/images/mascot/kiramin-normal.svg",
  researchImage: "/images/mascot/kiramin-research.svg",
  matomeImage: "/images/mascot/kiramin-matome.svg",
  comments: [
    "思った絵にならないときは、言葉を足すより先に減らしてみるのも手だよ。",
    "生成した画像を使う前に、利用規約と商用利用の条件は確認しておこうね。",
  ],
  introComments: [
    "こんにちは、エガミンです。今日は画像生成のお話をしますね。",
    "エガミン、参上!イメージ通りの一枚を一緒に作ろう。",
  ],
  outroComments: [
    "自分だけのプロンプト、少しずつ育てていってね。",
    "今日のコツ、次の生成に活かしてみてね。",
  ],
};

export const MUBIMIN = {
  name: "ムビミンちゃん",
  normalImage: "/images/mascot/iromin-normal.svg",
  researchImage: "/images/mascot/iromin-research.svg",
  matomeImage: "/images/mascot/iromin-matome.svg",
  comments: [
    "動画も音声も、まずは短い尺で試してから本番に進むと失敗が少ないよ。",
    "人の声や姿を扱うときは、権利と本人の許可にとくに気をつけてね。",
  ],
  introComments: [
    "こんにちは、ムビミンだよ!今日は動画と音のAIを見ていくね。",
    "ムビミン登場!映像づくり、一緒に始めよう。",
  ],
  outroComments: [
    "短い作品からで大丈夫。まずは一本作ってみてね。",
    "最後まで読んでくれてありがとう!",
  ],
};

export const KAKIMIN = {
  name: "カキミンちゃん",
  normalImage: "/images/mascot/saramin-normal.svg",
  researchImage: "/images/mascot/saramin-research.svg",
  matomeImage: "/images/mascot/saramin-matome.svg",
  comments: [
    "AIが書いた文章は、最後に自分の目で通すところまでが仕事だよ。",
    "誰に向けた文章かを先に決めておくと、AIの出力もぐっと安定するよ。",
  ],
  introComments: [
    "こんにちは、カキミンです。今日は文章づくりのお話をしますね。",
    "カキミン、参上!書く作業をラクにしていこう。",
  ],
  outroComments: [
    "下書きはAI、仕上げは自分。この分担が一番うまくいくよ。",
    "今日の型、次の執筆で使ってみてね。",
  ],
};

export const CODEMIN = {
  name: "コードミンちゃん",
  normalImage: "/images/mascot/kurumin-normal.svg",
  researchImage: "/images/mascot/kurumin-research.svg",
  matomeImage: "/images/mascot/kurumin-matome.svg",
  comments: [
    "生成されたコードは、動いたとしても中身を読んでから使おうね。",
    "エラーは全文をそのまま貼ると、AIの回答精度がぐっと上がるよ。",
  ],
  introComments: [
    "こんにちは、コードミンだよ!今日は開発でのAI活用を見ていくね。",
    "コードミン参上!手を動かしながら覚えていこう。",
  ],
  outroComments: [
    "小さく試して、動いたら広げる。これが安全な進め方だよ。",
    "また次の記事で会おうね!",
  ],
};

export const JIDOMIN = {
  name: "ジドウミンちゃん",
  normalImage: "/images/mascot/mochimin-normal.svg",
  researchImage: "/images/mascot/mochimin-research.svg",
  matomeImage: "/images/mascot/mochimin-matome.svg",
  comments: [
    "自動化は、まず手作業の手順を書き出すところから始めるとうまくいくよ。",
    "全部を一度に自動化しなくて大丈夫。毎日やることから選ぼう。",
  ],
  introComments: [
    "こんにちは、ジドウミンです。今日は自動化のお話をしますね。",
    "ジドウミン参上!面倒な作業、減らしていこう。",
  ],
  outroComments: [
    "浮いた時間で何をするかまで決めておくと続くよ。",
    "読んでくれてありがとう!",
  ],
};

export const KASEGIMIN = {
  name: "カセギミンちゃん",
  normalImage: "/images/mascot/hikamin-normal.svg",
  researchImage: "/images/mascot/hikamin-research.svg",
  matomeImage: "/images/mascot/hikamin-matome.svg",
  comments: [
    "収益の話は、うまくいった例だけでなく続かなかった理由も見ておこうね。",
    "成果には個人差があるよ。まずは小さく始めて様子を見よう。",
  ],
  introComments: [
    "こんにちは、カセギミンだよ!今日はAI副業のお話をするね。",
    "カセギミン参上!無理のない範囲で一歩ずつ進もう。",
  ],
  outroComments: [
    "焦らず、続けられる形を見つけてね。",
    "また次の記事でね!",
  ],
};

export const KURABEMIN = {
  name: "クラベミンちゃん",
  normalImage: "/images/mascot/nemumin-normal.svg",
  researchImage: "/images/mascot/nemumin-research.svg",
  matomeImage: "/images/mascot/nemumin-matome.svg",
  comments: [
    "比べるときは、機能の多さより自分の使い方に合うかで選ぼうね。",
    "無料プランでできる範囲を確かめてから、有料に進むのが安心だよ。",
  ],
  introComments: [
    "こんにちは、クラベミンです。今日はツールを比べていきますね。",
    "クラベミン参上!あなたに合う一つを見つけよう。",
  ],
  outroComments: [
    "迷ったら、実際に触ってみるのが一番の判断材料だよ。",
    "選ぶヒントになったならうれしいな。",
  ],
};

export const MANAMIN = {
  name: "マナミンちゃん",
  normalImage: "/images/mascot/manamin-normal.svg",
  researchImage: "/images/mascot/manamin-research.svg",
  matomeImage: "/images/mascot/manamin-matome.svg",
  comments: [
    "仕組みが少し分かるだけで、AIの得意・不得意が見えてくるよ。",
    "知らない用語が出てきたら、そこで止まらずまず全体像をつかもうね。",
  ],
  introComments: [
    "こんにちは、マナミンです。今日は基礎からひも解いていきますね。",
    "マナミン、参上!むずかしい言葉も一緒に整理しよう。",
  ],
  outroComments: [
    "土台ができると、次の記事がぐっと読みやすくなるよ。",
    "今日の知識、活かしてみてね。",
  ],
};

export const BIZMIN = {
  name: "ビズミンちゃん",
  normalImage: "/images/mascot/denmin-normal.svg",
  researchImage: "/images/mascot/denmin-research.svg",
  matomeImage: "/images/mascot/denmin-matome.svg",
  comments: [
    "社内で使うときは、入力してよい情報の線引きを先に決めておこうね。",
    "導入は小さな部署から。効果が見えてから広げると失敗しにくいよ。",
  ],
  introComments: [
    "こんにちは、ビズミンです。今日は仕事での活用を見ていきますね。",
    "ビズミン参上!現場で使える形にしていこう。",
  ],
  outroComments: [
    "まずは一つの業務から試してみてね。",
    "読んでくれてありがとう!",
  ],
};

export const KURASHIMIN = {
  name: "クラシミンちゃん",
  normalImage: "/images/mascot/utsumin-normal.svg",
  researchImage: "/images/mascot/utsumin-research.svg",
  matomeImage: "/images/mascot/utsumin-matome.svg",
  comments: [
    "毎日の小さな手間こそ、AIに任せてみる価値があるよ。",
    "学習に使うときは、答えを写すより解き方を聞くのがおすすめだよ。",
  ],
  introComments: [
    "こんにちは、クラシミンだよ!今日は暮らしの中のAIのお話をするね。",
    "クラシミン参上!毎日をちょっとラクにしていこう。",
  ],
  outroComments: [
    "今日からできることを一つ、試してみてね。",
    "また次の記事で会おうね!",
  ],
};

export const NEWSMIN = {
  name: "ニューミンちゃん",
  normalImage: "/images/mascot/karumin-normal.svg",
  researchImage: "/images/mascot/karumin-research.svg",
  matomeImage: "/images/mascot/karumin-matome.svg",
  comments: [
    "新しい発表は、話題の大きさより自分の使い方に関わるかで見ていこうね。",
    "情報は動きが速いから、公式の発表元を確認する習慣をつけよう。",
  ],
  introComments: [
    "こんにちは、ニューミンです。今日は最新の動きをまとめますね。",
    "ニューミン参上!いま押さえておきたい話をしよう。",
  ],
  outroComments: [
    "流れがつかめたかな?また新しい動きがあったら伝えるね。",
    "読んでくれてありがとう!",
  ],
};

// サイト全体のメインマスコット。カテゴリを横断する案内・ホームページで使用する。
export const NEVOMIN = {
  name: "ネヴォミンちゃん",
  normalImage: "/images/mascot/nevomin-normal.svg",
  researchImage: "/images/mascot/nevomin-research.svg",
  matomeImage: "/images/mascot/nevomin-matome.svg",
  comments: [
    "気になるテーマは、カテゴリからも探せるよ。",
    "迷ったときは、担当のミンたちに聞いてみてね。",
  ],
  introComments: [
    "こんにちは、ネヴォミンです。NEVORAへようこそ。",
    "ようこそ、NEVORAへ。ここでは色んな「ミン」たちが案内役をしていますよ。",
  ],
  outroComments: [
    "気になるカテゴリがあれば、担当のミンたちが待っていますよ。",
    "また会いましょう。今日も読んでくれてありがとう。",
  ],
  // ホームページ冒頭専用の自己紹介コメント(トップページのみで使用)。
  homeComment:
    "はじめまして、ネヴォミンだよ!このサイトではAIを使いこなすための情報を、カテゴリー担当のなかまたちと一緒に紹介しているよ。気になるジャンルから読んでみてね。",
};

const CATEGORY_MASCOTS = {
  "AIチャット・対話AI": CHAMIN,
  "画像生成AI": EGAMIN,
  "動画・音声生成AI": MUBIMIN,
  "文章作成・AIライティング": KAKIMIN,
  "AIプログラミング・開発": CODEMIN,
  "業務効率化・AI自動化": JIDOMIN,
  "AI副業・収益化": KASEGIMIN,
  "AIツール比較": KURABEMIN,
  "AIの基礎知識": MANAMIN,
  "AIとビジネス活用": BIZMIN,
  "AIと暮らし・学習": KURASHIMIN,
  "AI最新ニュース・トレンド": NEWSMIN,
};

function pickFrom(list, seed) {
  if (!Array.isArray(list) || list.length === 0) return "";
  const sum = String(seed)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return list[sum % list.length];
}

function pickComment(mascot, seed) {
  return pickFrom(mascot.comments, seed);
}

export function getCategoryMascot(categoryName, seed = categoryName, overrideComment = "") {
  const mascot = CATEGORY_MASCOTS[categoryName];
  if (!mascot) return null;
  return { ...mascot, comment: overrideComment || pickComment(mascot, seed) };
}

// 記事冒頭の挨拶コメント(normalポーズ)を取得する。
export function getMascotIntroComment(mascot, seed) {
  return pickFrom(mascot.introComments, seed);
}

// 記事末尾の振り返りコメント(matomeポーズ)を取得する。
export function getMascotOutroComment(mascot, seed) {
  return pickFrom(mascot.outroComments, seed);
}
