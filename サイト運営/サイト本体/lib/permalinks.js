// 記事のURL(パーマリンク)を決める。
// 形: /posts/大/中/小-NN (例: /posts/image/prompting/same-character-01)。
// 対応表は lib/permalinks.json(キー=記事ファイル名から日付を除いた部分)。
// 大・中・小の分類名はサイトの画面には出さない(URLにだけ現れる)。
// 記事のファイル名(slug)は内部の識別子として変えない。公開キューが日付を付け替えても、
// キーが日付を含まないので URL は変わらない。
import data from "./permalinks.json" with { type: "json" };

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}_/;

export function permalinkKey(slug) {
  return String(slug).replace(DATE_PREFIX, "");
}

// 対応表にある記事の "大/中/小-NN"。無ければ null。
export function getPermalink(slug) {
  return data.posts[permalinkKey(slug)] || null;
}

// 記事ページのパス(next/link・href 用)。対応表に無い記事は旧形式(/posts/<slug>)に戻す。
export function postHref(slug) {
  const p = getPermalink(slug);
  return p ? `/posts/${p}` : `/posts/${encodeURIComponent(slug)}`;
}

// 絶対URLなどで使う、percent-encode 済みのパス(英小文字・数字・ハイフン・スラッシュだけなので同じ)。
export function postPathEncoded(slug) {
  return postHref(slug);
}

// getStaticPaths 用: ["大","中","小-NN"] の配列。無ければ ["<slug>"](旧形式)。
export function permalinkSegments(slug) {
  const p = getPermalink(slug);
  return p ? p.split("/") : [slug];
}

// 記事内の旧形式リンク(/posts/<slug>)を新URLへ解決するための対応(HTML文字列用)。
export function rewritePostLinks(html) {
  return html.replace(/href="\/posts\/([^"#?]+)((?:[#?][^"]*)?)"/g, (m, rawSlug, tail) => {
    let slug = rawSlug;
    try {
      slug = decodeURIComponent(rawSlug);
    } catch (_) {
      return m;
    }
    const p = getPermalink(slug);
    return p ? `href="/posts/${p}${tail}"` : m;
  });
}

export const PERMALINK_CATEGORIES = data.categories;
export const PERMALINK_COUNT = Object.keys(data.posts).length;

// ビルド時の警告用: 対応表に無い slug の一覧。
export function findUnmappedSlugs(slugs) {
  return slugs.filter((s) => !getPermalink(s));
}
