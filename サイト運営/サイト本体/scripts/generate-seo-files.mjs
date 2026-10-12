/**
 * robots.txt と sitemap.xml を、ビルド前に public/ へ静的ファイルとして書き出す。
 *
 * 以前は pages/robots.txt.js・pages/sitemap.xml.js の getServerSideProps で
 * リクエストごとに生成しており、VercelでFunctionになっていた。静的ファイルにすると
 * Functionが不要になる。出力内容は以前と同じ。
 *
 * - サイトURLはリクエストのホスト名が使えないため NEXT_PUBLIC_SITE_URL を使う
 *   (next.config.jsが、本番ビルドで未設定ならエラーにしている)。
 * - NEXT_PUBLIC_ALLOW_INDEX の切り替えは、再ビルドで反映される。
 * - 生成物(public/robots.txt・public/sitemap.xml)は gitignore している。直接編集しないこと。
 *
 * lib/ はNext.js用のESM(拡張子なしimport)で書かれているため、
 * 拡張子なしの指定を解決する小さなフックを登録してから読み込む。
 */
import fs from "fs";
import path from "path";
import { register } from "node:module";
import { pathToFileURL } from "url";
import { createRequire } from "module";

// Next.jsと同じ規則で .env.local などを読み込む(Vercel上ではVercelの環境変数がそのまま使われる)。
createRequire(import.meta.url)("@next/env").loadEnvConfig(process.cwd());

const hook = `
import fs from "node:fs";
import { fileURLToPath } from "node:url";
export async function resolve(specifier, context, next) {
  if (specifier.startsWith(".") && !/\\.[a-z]+$/i.test(specifier) && context.parentURL) {
    const base = new URL(specifier, context.parentURL);
    if (fs.existsSync(fileURLToPath(base) + ".js")) {
      return next(base.href + ".js", context);
    }
  }
  return next(specifier, context);
}
`;
register("data:text/javascript," + encodeURIComponent(hook), import.meta.url);

const root = process.cwd();
const { getAllPostsMeta, getAllCategories } = await import(
  pathToFileURL(path.join(root, "lib", "posts.js")).href
);
const { getWorryPageItems } = await import(
  pathToFileURL(path.join(root, "lib", "worryTopics.js")).href
);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) {
  throw new Error("[generate-seo-files] NEXT_PUBLIC_SITE_URL が未設定です。");
}

function escapeXml(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// <loc>には、サイト内リンク(next/link)が出力するのと同じ percent-encoded の
// URLを入れる。日本語スラッグを生のまま出力すると、サイト側が返すURLと一致せず
// Googleのクロールで404になる(2026-08-24に本番で全196記事が404だった原因)。
function urlEntry(loc, lastmod) {
  return `<url><loc>${escapeXml(loc)}</loc>${
    lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
  }</url>`;
}

// カテゴリに属する記事のupdatedDate/dateのうち最も新しいものをlastmodとして使う
// (記事1件のlastmodと同じ考え方をカテゴリ単位に広げたもの)。該当記事が無い、
// または日付が1件も無い場合はundefined(lastmodタグ自体を出力しない)。
function latestDate(posts) {
  const dates = posts
    .map((p) => p.updatedDate || p.date)
    .filter(Boolean)
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (dates.length === 0) return undefined;
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
  return latest.toISOString().slice(0, 10);
}

function buildRobots() {
  // ドメイン確定前の暫定公開ではサイト全体をクロール拒否にする。
  // components/Layout.js のnoindexメタと同じフラグで切り替わる。
  // 正式公開時にVercelの環境変数で NEXT_PUBLIC_ALLOW_INDEX=1 を設定すると解除される。
  const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEX === "1";

  const body = allowIndex
    ? `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`
    : // 検索エンジンには拾わせないが、SNSのリンクプレビュー用クローラーだけは通す。
      // (これらもrobots.txtに従うため、全面Disallowにするとカード画像が出なくなる)
      `User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Facebot
Allow: /

User-agent: Slackbot-LinkExpanding
Allow: /

User-agent: Discordbot
Allow: /

User-agent: LINE
Allow: /

User-agent: *
Disallow: /
`;

  return body;
}

function buildSitemap() {
  const posts = getAllPostsMeta();
  const categories = getAllCategories();
  const worryItems = getWorryPageItems();
  // /compareは掲載中のアフィリエイトリンクを全記事から集約するページ(pages/compare.js参照)。
  // リンクが0件の間は中身のない空ページになるため、sitemapにも載せない(compare.js側のnoindexと連動)。
  const hasCompareItems = posts.some((p) => p.affiliateLinks.length > 0);

  const staticPaths = [
    "/",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    ...(hasCompareItems ? ["/compare"] : []),
    "/ranking",
    "/search",
    "/category",
  ];

  const entries = [
    ...staticPaths.map((path) => urlEntry(`${siteUrl}${path}`)),
    ...categories.map((c) => {
      const categoryPosts = posts.filter((p) => p.category === c.name);
      return urlEntry(
        `${siteUrl}/category/${encodeURIComponent(c.name)}`,
        latestDate(categoryPosts)
      );
    }),
    ...posts.map((p) =>
      urlEntry(
        `${siteUrl}/posts/${encodeURIComponent(p.slug)}`,
        p.updatedDate || p.date || undefined
      )
    ),
    // 困りごとページは専用本文があるものだけ存在する(lib/worryTopics.js)。
    // 1件も無い間はハブ /worry も生成されないため、サイトマップにも載せない。
    ...(worryItems.length > 0 ? [urlEntry(`${siteUrl}/worry`)] : []),
    ...worryItems.map((item) => {
      const worryPosts = posts.filter(
        (p) => Array.isArray(p.worry) && p.worry.includes(item.slug)
      );
      return urlEntry(
        `${siteUrl}/worry/${encodeURIComponent(item.slug)}`,
        latestDate(worryPosts)
      );
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join(
    ""
  )}</urlset>`;

  return xml;
}

const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "robots.txt"), buildRobots());
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemap());
console.log("[generate-seo-files] public/robots.txt と public/sitemap.xml を出力しました");
