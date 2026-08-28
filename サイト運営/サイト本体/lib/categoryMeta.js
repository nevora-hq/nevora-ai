// トップページの「カテゴリで探す」まとめセクション用の表示情報。
// 対象ジャンルはプロジェクト直下のCLAUDE.mdを唯一の情報源とし、
// カテゴリが増えた場合はここに追記する(未登録カテゴリはdefaultにフォールバック)。
// imageの元画像・生成プロンプトは docs/image-prompts.md、変換は scripts/generate-site-images.js を参照。
const CATEGORY_META = {
  "AIチャット・対話AI": {
    icon: "💬",
    color: "#1c7ed6",
    soft: "#dff0ff",
    image: "/images/category/chat-ai.webp",
    description:
      "ChatGPT・Claude・GeminiなどのチャットAIの使い方、プロンプトのコツ、料金プランの選び方をまとめています。",
    shortSummary:
      "ChatGPT・Claude・GeminiなどのチャットAIの使い方とプロンプトのコツ。",
  },
  "画像生成AI": {
    icon: "🎨",
    color: "#ae3ec9",
    soft: "#f5e3fb",
    image: "/images/category/image-ai.webp",
    description:
      "Midjourney・Stable Diffusionなどの画像生成AIの始め方、プロンプト作成、商用利用の注意点を紹介します。",
    shortSummary:
      "画像生成AIの始め方・プロンプト作成・商用利用の注意点。",
  },
  "動画・音声生成AI": {
    icon: "🎬",
    color: "#e8590c",
    soft: "#ffe8d9",
    image: "/images/category/video-audio-ai.webp",
    description:
      "動画生成・音声合成・AI音楽など、映像と音のクリエイティブをAIで作るためのツールと手順をまとめています。",
    shortSummary:
      "動画生成・音声合成・AI音楽のツールと作り方。",
  },
  "文章作成・AIライティング": {
    icon: "✍️",
    color: "#0ca678",
    soft: "#dff7ee",
    image: "/images/category/writing-ai.webp",
    description:
      "ブログ・メール・資料など、文章作成をAIで効率化する方法と、品質を保つための編集の考え方を紹介します。",
    shortSummary:
      "AIで文章作成を効率化する方法と、品質を保つ編集の考え方。",
  },
  "AIプログラミング・開発": {
    icon: "💻",
    color: "#3b5bdb",
    soft: "#e3e8fd",
    image: "/images/category/coding-ai.webp",
    description:
      "コーディング支援AIやAPI活用など、開発の現場でAIを使いこなすための情報をまとめています。",
    shortSummary:
      "コーディング支援AI・API活用など、開発でAIを使いこなす情報。",
  },
  "業務効率化・AI自動化": {
    icon: "⚙️",
    color: "#495057",
    soft: "#eef0f2",
    image: "/images/category/automation.webp",
    description:
      "日々の業務やルーティン作業をAIとツール連携で自動化し、時間を生み出す方法を紹介します。",
    shortSummary:
      "業務・ルーティン作業をAIとツール連携で自動化する方法。",
  },
  "AI副業・収益化": {
    icon: "💰",
    color: "#f08c00",
    soft: "#fff3d6",
    image: "/images/category/side-job.webp",
    description:
      "AIを使った副業の始め方や、実際に収益につなげるための進め方・注意点をまとめています。",
    shortSummary:
      "AIを使った副業の始め方と、収益につなげるための進め方。",
  },
  "AIツール比較": {
    icon: "📊",
    color: "#d6336c",
    soft: "#ffe3ec",
    image: "/images/category/tool-compare.webp",
    description:
      "似た用途のAIツールを機能・料金・使い勝手の観点で比較し、目的別の選び方を紹介します。",
    shortSummary:
      "AIツールを機能・料金・使い勝手で比較し、目的別に選ぶ。",
  },
  "AIの基礎知識": {
    icon: "📚",
    color: "#5f3dc4",
    soft: "#ece6fb",
    image: "/images/category/ai-basics.webp",
    description:
      "生成AIの仕組みや専門用語など、AIを正しく使うための土台となる基礎知識をまとめています。",
    shortSummary:
      "生成AIの仕組みや専門用語など、AI活用の土台となる基礎知識。",
  },
  "AIとビジネス活用": {
    icon: "🏢",
    color: "#c2255c",
    soft: "#fde3ee",
    image: "/images/category/business.webp",
    description:
      "マーケティング・営業・バックオフィスなど、仕事の場面別にAIを導入する具体策を紹介します。",
    shortSummary:
      "仕事の場面別に、AIを導入する具体策。",
  },
  "AIと暮らし・学習": {
    icon: "🏠",
    color: "#2f9e44",
    soft: "#e6f7ea",
    image: "/images/category/life-learning.webp",
    description:
      "勉強・家事・趣味など、日常生活の中でAIを役立てる使い方をまとめています。",
    shortSummary:
      "勉強・家事・趣味など、日常生活でAIを役立てる使い方。",
  },
  "AI最新ニュース・トレンド": {
    icon: "📰",
    color: "#f59f00",
    soft: "#fff6da",
    image: "/images/category/news-trend.webp",
    description:
      "新モデルの登場や法規制の動きなど、押さえておきたいAIの最新動向を整理して紹介します。",
    shortSummary:
      "新モデル・法規制など、押さえておきたいAIの最新動向。",
  },
};

// ホームページで常時表示する大カテゴリ12種(CLAUDE.mdの対象分野を唯一の情報源とする
// 分類表に基づく表示順)。記事の有無に関わらずこの並び順で表示する。
export const MAJOR_CATEGORIES = [
  "AIチャット・対話AI",
  "画像生成AI",
  "動画・音声生成AI",
  "文章作成・AIライティング",
  "AIプログラミング・開発",
  "業務効率化・AI自動化",
  "AI副業・収益化",
  "AIツール比較",
  "AIの基礎知識",
  "AIとビジネス活用",
  "AIと暮らし・学習",
  "AI最新ニュース・トレンド",
];

const DEFAULT_META = {
  icon: "📁",
  color: "#495057",
  soft: "#f1f3f5",
  description: "このカテゴリに関する記事をまとめています。",
  shortSummary: "このカテゴリに関する記事をまとめています。",
};

export function getCategoryMeta(name) {
  return CATEGORY_META[name] || DEFAULT_META;
}
