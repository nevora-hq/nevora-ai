// ホームの「あなたのAIの困りごとから探す」チップの定義。
// 全15件が /worry/[slug] へ着地する。記事との紐付けは記事frontmatterの
// worry フィールド(明示付与、部分一致判定は使わない)のみで行う。
// 注意: このファイルは pages/index.js(クライアントバンドルに含まれる)からも
// importされるため、Node専用のlib/posts.js(fs使用)を絶対にimportしないこと。
// 記事一覧の絞り込み(getPostsByWorry相当)はpages/worry/[slug].jsのgetStaticProps側で行う。

import { getWorryContent } from "./worryContent";
import {
  CHAMIN,
  EGAMIN,
  KAKIMIN,
  CODEMIN,
  JIDOMIN,
  KASEGIMIN,
  KURABEMIN,
  MANAMIN,
} from "./categoryMascot";

export const WORRY_GROUPS = [
  {
    heading: "使い方がわからない",
    items: [
      { slug: "getting-started", label: "何から始めるか", primaryCategory: "AIの基礎知識", mascot: MANAMIN },
      { slug: "prompt", label: "プロンプトの書き方", primaryCategory: "AIチャット・対話AI", mascot: CHAMIN },
      { slug: "wrong-answer", label: "答えが的外れ", primaryCategory: "AIチャット・対話AI", mascot: CHAMIN },
      { slug: "hallucination", label: "情報の正しさ", primaryCategory: "AIの基礎知識", mascot: MANAMIN },
      { slug: "terms", label: "専門用語がわからない", primaryCategory: "AIの基礎知識", mascot: MANAMIN },
    ],
  },
  {
    heading: "ツール選び",
    items: [
      { slug: "free-or-paid", label: "無料と有料の違い", primaryCategory: "AIツール比較", mascot: KURABEMIN },
      { slug: "which-tool", label: "どれを選ぶか", primaryCategory: "AIツール比較", mascot: KURABEMIN },
      { slug: "cost", label: "料金を抑えたい", primaryCategory: "AIツール比較", mascot: KURABEMIN },
      { slug: "security", label: "情報漏えいが不安", primaryCategory: "AIとビジネス活用", mascot: JIDOMIN },
      { slug: "copyright", label: "著作権・商用利用", primaryCategory: "画像生成AI", mascot: EGAMIN },
    ],
  },
  {
    heading: "作る・稼ぐ",
    items: [
      { slug: "writing", label: "文章づくり", primaryCategory: "文章作成・AIライティング", mascot: KAKIMIN },
      { slug: "image", label: "画像づくり", primaryCategory: "画像生成AI", mascot: EGAMIN },
      { slug: "coding", label: "プログラミング", primaryCategory: "AIプログラミング・開発", mascot: CODEMIN },
      { slug: "automation", label: "作業の自動化", primaryCategory: "業務効率化・AI自動化", mascot: JIDOMIN },
      { slug: "side-job", label: "副業・収益化", primaryCategory: "AI副業・収益化", mascot: KASEGIMIN },
    ],
  },
];

// 全悩みチップをフラットな配列で取得(pages/index.js での描画用)。
export function getAllWorryItems() {
  return WORRY_GROUPS.flatMap((group) =>
    group.items.map((item) => ({ ...item, group: group.heading }))
  );
}

// /worry/[slug] を生成する対象。
// 専用ページの本文(lib/worryContent.js)が用意できているものだけを返す。
// 本文が無いslugまで静的生成すると、getStaticPropsがnotFoundを返して
// 「リンクはあるが404」というダミーリンクになるため(2026-08-28、本番で発覚)。
export function getWorryPageItems() {
  return getAllWorryItems().filter((item) => getWorryContent(item.slug));
}

// ホーム・ハブでチップを出す対象。ページが存在するものだけに絞る。
export function getPublishedWorryGroups() {
  return WORRY_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => getWorryContent(item.slug)),
  })).filter((group) => group.items.length > 0);
}

export function getWorryItemBySlug(slug) {
  return getAllWorryItems().find((item) => item.slug === slug) || null;
}

// 悩みのリンク先URL。全件 /worry/[slug] に統一。
export function getWorryHref(item) {
  return `/worry/${item.slug}`;
}
