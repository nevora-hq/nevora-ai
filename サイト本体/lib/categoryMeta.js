// トップページの「カテゴリで探す」まとめセクション用の表示情報。
// 対象ジャンルはプロジェクト直下のCLAUDE.mdを唯一の情報源とし、
// ここには大カテゴリのみを登録する(中カテゴリ・小カテゴリは登録しない=
// 記事のfrontmatter categoryに使われない限り自動的に非公開のまま)。
// 大カテゴリが増減した場合はCLAUDE.mdの更新に合わせてここに追記する。
const CATEGORY_META = {
  "生成AI": {
    icon: "💬",
    color: "#2a78d6",
    soft: "#e3f0ff",
    image: "/images/category/gen-ai.png",
    description:
      "ChatGPT・Claude・Gemini・画像/動画/音声生成AIなど、生成AIの基本と使い方をまとめています。",
  },
  "AIツール": {
    icon: "🛠️",
    color: "#2f9e44",
    soft: "#e6f7ea",
    image: "/images/category/ai-tools.png",
    description:
      "仕事効率化・Web制作・ライティング・デザイン・マーケティングなど、目的別のAIツールを紹介します。",
  },
  "AI活用術": {
    icon: "💡",
    color: "#e8590c",
    soft: "#ffe8d9",
    image: "/images/category/ai-katsuyo.png",
    description:
      "仕事・個人利用・学生・クリエイターなど、シーン別のAI活用アイデアをまとめています。",
  },
  "AI自動化": {
    icon: "⚙️",
    color: "#7048e8",
    soft: "#ede6fd",
    image: "/images/category/ai-automation.png",
    description:
      "業務自動化・AIエージェント・API連携・ノーコード自動化など、AIで作業を効率化する方法を紹介します。",
  },
  "AI開発": {
    icon: "👨‍💻",
    color: "#1098ad",
    soft: "#e0f7fa",
    image: "/images/category/ai-dev.png",
    description:
      "AIプログラミング・AIアプリ開発・AIモデル・AIインフラなど、開発者向けの情報をまとめています。",
  },
  "AI学習": {
    icon: "📚",
    color: "#d6336c",
    soft: "#ffe3ec",
    image: "/images/category/ai-gakushu.png",
    description:
      "AIの基礎知識・プロンプトの書き方・AI資格・AIスキルなど、学びたい人向けの情報を紹介します。",
  },
  "AIビジネス": {
    icon: "📈",
    color: "#f08c00",
    soft: "#fff3d9",
    image: "/images/category/ai-business.png",
    description:
      "AI副業・AI起業・企業への導入・AI業界動向など、ビジネス視点のAI情報をまとめています。",
  },
  "AI最新ニュース・知識": {
    icon: "📰",
    color: "#495057",
    soft: "#eef1f3",
    image: "/images/category/ai-news.png",
    description:
      "最新ニュース・AIの未来・AI倫理・AIリスクなど、押さえておきたいAIの知識を紹介します。",
  },
};

// ホームページの「カテゴリで探す」に常時表示する大カテゴリ一覧。
// 記事が0件のカテゴリも(準備中として)表示するための固定リスト。
// 中カテゴリ・小カテゴリはここに含めない=記事のcategoryに使われない限り非公開のまま。
export const MAJOR_CATEGORIES = Object.keys(CATEGORY_META);

const DEFAULT_META = {
  icon: "📁",
  color: "#495057",
  soft: "#f1f3f5",
  description: "このカテゴリに関する記事をまとめています。",
};

export function getCategoryMeta(name) {
  return CATEGORY_META[name] || DEFAULT_META;
}
