import Link from "next/link";
import Layout from "../../components/Layout";
import { getPublishedWorryGroups } from "../../lib/worryTopics";
import { getWorryContent } from "../../lib/worryContent";
import { getAllPostsMeta } from "../../lib/posts";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "../../lib/structuredData";

export async function getStaticProps() {
  const allPosts = getAllPostsMeta();

  const groups = getPublishedWorryGroups().map((group) => ({
    heading: group.heading,
    items: group.items.map((item) => {
      const content = getWorryContent(item.slug);
      const count = allPosts.filter(
        (post) => Array.isArray(post.worry) && post.worry.includes(item.slug)
      ).length;
      return {
        slug: item.slug,
        label: item.label,
        summary: content ? content.summary : "",
        count,
      };
    }),
  }));

  // 専用ページが1件も無い状態では、ハブ自体が空のページになるため公開しない。
  if (groups.length === 0) {
    return { notFound: true };
  }

  return { props: { groups } };
}

function buildWorryHubJsonLd(groups, siteUrl) {
  if (!siteUrl) return [];
  const breadcrumb = buildBreadcrumbJsonLd(siteUrl, [
    { name: "トップ", url: siteUrl },
    { name: "困りごとから探す", url: `${siteUrl}/worry` },
  ]);
  const allItems = groups.flatMap((group) => group.items);
  const itemList = buildItemListJsonLd(
    allItems.map((item) => ({ name: item.label, url: `${siteUrl}/worry/${item.slug}` }))
  );
  return [breadcrumb, itemList].filter(Boolean);
}

export default function WorryHubPage({ groups }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <Layout
      panel
      title="あなたのAIの困りごとから探す｜AI活用の総合ガイド｜NEVORA"
      description="プロンプトの書き方、ツールの選び方、著作権や情報漏えいの不安、副業への活かし方まで。15のAIの困りごとから、原因の整理やセルフチェック、今日からできる対処がまとまった記事ページを探せます。"
      canonicalPath="/worry"
      ogImage="/images/logo.png"
      jsonLd={buildWorryHubJsonLd(groups, siteUrl)}
    >
      <nav className="breadcrumb" aria-label="パンくずリスト">
        <Link href="/">トップ</Link>
        <span className="sep">/</span>
        <span className="current">困りごとから探す</span>
      </nav>

      <h1 className="page-title">あなたのAIの困りごとから探す</h1>
      <p className="home-section-lead">
        気になる困りごとを選ぶと、原因の整理からセルフチェック、今日からできる対処までをまとめた専用ページに移動します。
      </p>

      {groups.map((group) => (
        <section className="article-section" key={group.heading}>
          <h2 className="home-section-title">{group.heading}</h2>
          <div className="worry-hub-grid">
            {group.items.map((item) => (
              <Link key={item.slug} href={`/worry/${item.slug}`} className="worry-hub-card">
                <span className="worry-hub-card-label">{item.label}</span>
                <span className="worry-hub-card-summary">{item.summary}</span>
                <span className="worry-hub-card-count">{item.count}件の記事</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </Layout>
  );
}
