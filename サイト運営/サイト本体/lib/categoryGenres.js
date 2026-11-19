// トップページ「カテゴリで探す」の円形ナビ用ジャンル定義。
// カテゴリ名は lib/categoryMeta.js の MAJOR_CATEGORIES と同じ表記を使う。
// カテゴリを増減したら、ここの categories だけを編集すれば円形ナビが追従する
// (どのジャンルにも入っていないカテゴリは「すべて」でしか表示されないので、必ずどれかに入れる)。
//
// ジャンル数は 3〜6 を想定(components/CategoryGenreNav.js が数から配置を計算する)。
// soft … 円の薄い背景色 / line … 選択時の枠色。文字は暗色(--color-text)で載せるので淡色でよい。
export const CATEGORY_GENRES = [
  {
    id: "talk-write",
    label: "話す・書く",
    icon: "chat",
    soft: "#dff0ff",
    line: "#5b9bd5",
    categories: ["AIチャット・対話AI", "文章作成・AIライティング"],
  },
  {
    id: "create",
    label: "作る",
    icon: "create",
    soft: "#f5e3fb",
    line: "#b36bc9",
    categories: ["画像生成AI", "動画・音声生成AI", "AIプログラミング・開発"],
  },
  {
    id: "work-income",
    label: "仕事・収益",
    icon: "work",
    soft: "#fff3d6",
    line: "#d9a02e",
    categories: ["業務効率化・AI自動化", "AI副業・収益化", "AIとビジネス活用"],
  },
  {
    id: "life-learn",
    label: "生活・学び",
    icon: "learn",
    soft: "#dff7ee",
    line: "#4fb08a",
    categories: ["AIの基礎知識", "AIと暮らし・学習"],
  },
  {
    id: "compare-news",
    label: "比較・最新",
    icon: "compare",
    soft: "#ffe8d9",
    line: "#e08a52",
    categories: ["AIツール比較", "AI最新ニュース・トレンド"],
  },
];

// 円形ナビを出す最小カテゴリ数(これ未満のサイトは既存のカテゴリ表示のまま)
export const GENRE_NAV_MIN_CATEGORIES = 6;
