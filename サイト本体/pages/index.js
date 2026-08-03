import Head from "next/head";
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
      newPosts: posts.slice(0, 6),
      featuredPosts: posts.slice(0, 3),
      popularPosts: posts.slice(0, 5),
      categories,
      categorySummaries,
      mainMascot: getMainMascot("home"),
    },
  };
}

export default function Home({
  newPosts,
  featuredPosts,
  popularPosts,
  categories,
  categorySummaries,
  mainMascot,
}) {
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

            {categorySummaries.length > 0 && (
              <section className="category-summary-section">
                <h2 className="home-section-title">カテゴリで探す</h2>
                <p className="home-section-lead">
                  気になるテーマから、関連記事をまとめてチェックできます。
                </p>
                <div className="category-summary-grid">
                  {categorySummaries.map((cat) => {
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
                        >
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="category-summary-image"
                            loading="lazy"
                          />
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
                  })}
                </div>
              </section>
            )}

            <section className="home-featured-section">
              <h2 className="home-section-title">注目記事</h2>
              {featuredPosts.length === 0 ? (
                <p>まだ記事がありません。記事データを確定稿フォルダに追加してください。</p>
              ) : (
                <div className="post-list">
                  {featuredPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </section>

            <section className="home-new-section">
              <h2 className="home-section-title">新着記事</h2>
              <div className="post-list">
                {newPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          </div>

          <Sidebar popularPosts={popularPosts} categories={categories} />
        </div>
      </div>
    </Layout>
  );
}
