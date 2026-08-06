import Head from "next/head";
import { useState } from "react";
import Layout from "../components/Layout";
import PostCard from "../components/PostCard";
import HeroBanner from "../components/HeroBanner";
import ImageSlider from "../components/ImageSlider";
import Sidebar from "../components/Sidebar";
import { getAllPostsMeta, getAllCategories } from "../lib/posts";
import { getCategoryMeta, MAJOR_CATEGORIES } from "../lib/categoryMeta";
import { getCategoryMascot, getMainMascot } from "../lib/categoryMascot";
import Mascot from "../components/Mascot";
import Link from "next/link";

// トップページの「カテゴリで探す」で初期表示する人気カテゴリー(この3つのみ展開状態)。
// 残りはアコーディオンの折りたたみ内に表示する(DOM自体は常に出力しCSSで表示切替する)。
const POPULAR_CATEGORY_NAMES = ["AIツール", "生成AI", "AI活用術"];

// 「あなたのAI活用の悩みから探す」チップ。既存のカテゴリページ/検索/比較ページのみへリンクする。
const CONCERN_GROUPS = [
  {
    title: "使い方の悩み",
    chips: [
      { label: "ChatGPTの始め方", href: "/category/生成AI" },
      { label: "プロンプトのコツ", href: "/category/AI学習" },
      { label: "無料と有料の違い", href: "/compare" },
      { label: "商用利用の可否", href: "/search?q=商用利用" },
      { label: "会社での導入", href: "/category/AIビジネス" },
    ],
  },
  {
    title: "ツール選びの悩み",
    chips: [
      { label: "画像生成AI", href: "/category/生成AI" },
      { label: "文章作成AI", href: "/category/AIツール" },
      { label: "動画生成AI", href: "/category/生成AI" },
      { label: "音声生成AI", href: "/category/生成AI" },
      { label: "無料で使えるAI", href: "/category/AIツール" },
    ],
  },
  {
    title: "仕事・キャリアの悩み",
    chips: [
      { label: "業務効率化", href: "/category/AI活用術" },
      { label: "AIで副業", href: "/category/AIビジネス" },
      { label: "著作権リスク", href: "/category/AI最新ニュース・知識" },
      { label: "AIスキルの学び方", href: "/category/AI学習" },
      { label: "最新ニュース", href: "/category/AI最新ニュース・知識" },
    ],
  },
];

export async function getStaticProps() {
  const posts = getAllPostsMeta();
  const categories = getAllCategories();

  // 大カテゴリは記事が0件でも「準備中」として常にホームページに表示する
  // (中カテゴリ・小カテゴリはMAJOR_CATEGORIESに含めないため、ここには出てこない)。
  const countByName = new Map(categories.map((c) => [c.name, c.count]));
  const categorySummaries = MAJOR_CATEGORIES.map((name) => ({
    name,
    count: countByName.get(name) || 0,
    ...getCategoryMeta(name),
  }));

  return {
    props: {
      newPosts: posts.slice(0, 2),
      popularCardPosts: posts.slice(2, 4),
      popularPosts: posts.slice(0, 5),
      categories,
      categorySummaries,
      mainMascot: getMainMascot("home"),
    },
  };
}

export default function Home({
  newPosts,
  popularCardPosts,
  popularPosts,
  categories,
  categorySummaries,
  mainMascot,
}) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  // カテゴリーカード1件分のマークアップを生成する共通関数。
  // collapsed=trueのときはCSSで非表示にしつつ、キーボード操作でフォーカスが
  // 当たらないようtabIndexを外す(表示中のカードのクリック領域には影響しない)。
  function renderCategoryCard(cat, collapsed = false) {
    const mascot = getCategoryMascot(cat.name, cat.name, cat.description);
    return (
      <div
        key={cat.name}
        className="category-summary-card"
        style={{ "--cat-color": cat.color, "--cat-soft": cat.soft }}
      >
        <Link
          href={`/category/${encodeURIComponent(cat.name)}`}
          className="category-summary-image-link"
          aria-label={`${cat.name}の記事一覧を見る`}
          tabIndex={collapsed ? -1 : undefined}
        >
          <img src={cat.image} alt={cat.name} className="category-summary-image" loading="lazy" />
          <span className="category-summary-image-overlay">
            <span className="category-summary-image-icon" aria-hidden="true">
              {cat.icon}
            </span>
            <span className="category-summary-image-name">{cat.name}</span>
          </span>
          <span className="category-summary-image-count">
            {cat.count > 0 ? `${cat.count}件の記事` : "準備中"}
          </span>
        </Link>

        {mascot && (
          <div className="category-summary-mascot-row">
            <Mascot mascot={mascot} size={44} />
            <div className="category-summary-mascot-bubble">
              <span className="category-summary-mascot-name">{mascot.name}</span>
              <p className="category-summary-mascot-text">{mascot.comment}</p>
              <p className="category-summary-cta">
                気になる方は、上の画像をクリックして記事をチェックしてみてね。
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout
      title="AI活用の総合ガイド｜NEVORA｜生成AIツール・使い方・業務効率化の情報"
      categories={categories}
      canonicalPath="/"
      hero={
        <>
          <HeroBanner />
          <ImageSlider slides={categorySummaries} />
        </>
      }
    >
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="home-page">
        <div className="home-layout">
          <div className="home-main">
            {mainMascot && (
              <div className="mascot-comment">
                <img
                  src={mainMascot.normalImage}
                  alt={mainMascot.name}
                  width="56"
                  height="56"
                  className="mascot-comment-img"
                  loading="lazy"
                />
                <div className="mascot-comment-bubble">
                  <span className="mascot-comment-name">{mainMascot.name}</span>
                  <p className="mascot-comment-text">
                    ようこそ!ぼくはこのサイトの案内役、{mainMascot.name}だよ。カテゴリごとに専門の仲間がいるから、気になるテーマを一緒に見ていこう。
                  </p>
                </div>
              </div>
            )}

            <section className="concern-section" aria-labelledby="concern-section-title">
              <h2 id="concern-section-title" className="home-section-title">
                あなたのAI活用の悩みから探す
              </h2>
              <p className="home-section-lead">
                気になるキーワードをタップすると、関連する記事や機能へ移動できます。
              </p>
              <div className="concern-groups">
                {CONCERN_GROUPS.map((group) => (
                  <div key={group.title} className="concern-group">
                    <h3 className="concern-group-title">{group.title}</h3>
                    <div className="concern-chip-list">
                      {group.chips.map((chip) => (
                        <Link key={chip.label} href={chip.href} className="concern-chip">
                          {chip.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {categorySummaries.length > 0 && (
              <section className="category-summary-section">
                <h2 className="home-section-title">カテゴリで探す</h2>
                <p className="home-section-lead">
                  気になるテーマから、関連記事をまとめてチェックできます。
                </p>
                <div className="category-summary-grid">
                  {categorySummaries
                    .filter((cat) => POPULAR_CATEGORY_NAMES.includes(cat.name))
                    .map((cat) => renderCategoryCard(cat))}

                  {/* 非人気カテゴリーはSEO・内部リンクのため常にDOMに存在させ、
                      display:contentsの親でグループ化してCSSのmax-height/opacityのみで
                      表示・非表示を切り替える(JSでの動的生成はしない)。 */}
                  <div
                    id="category-more-panel"
                    className={
                      "category-summary-more" +
                      (categoriesExpanded ? " category-summary-more-expanded" : "")
                    }
                    aria-hidden={!categoriesExpanded}
                  >
                    {categorySummaries
                      .filter((cat) => !POPULAR_CATEGORY_NAMES.includes(cat.name))
                      .map((cat) => renderCategoryCard(cat, !categoriesExpanded))}
                  </div>
                </div>
                <button
                  type="button"
                  className="category-summary-toggle"
                  aria-expanded={categoriesExpanded}
                  aria-controls="category-more-panel"
                  onClick={() => setCategoriesExpanded((prev) => !prev)}
                >
                  {categoriesExpanded ? "− AIカテゴリーを閉じる" : "＋ すべてのAIカテゴリーを見る"}
                </button>
              </section>
            )}

            <section className="home-new-section">
              <h2 className="home-section-title">新着記事</h2>
              {newPosts.length === 0 ? (
                <p>まだ記事がありません。記事データを確定稿フォルダに追加してください。</p>
              ) : (
                <div className="post-list">
                  {newPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </section>

            {popularCardPosts.length > 0 && (
              <section className="home-featured-section">
                <h2 className="home-section-title">人気記事</h2>
                <div className="post-list">
                  {popularCardPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <Sidebar popularPosts={popularPosts} categories={categories} />
        </div>
      </div>
    </Layout>
  );
}
