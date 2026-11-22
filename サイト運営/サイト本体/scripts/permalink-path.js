/**
 * スクリプト(CommonJS)用: 記事slug(ファイル名)から記事ページのパスを返す。
 * 規則は lib/permalinks.js と同じ(対応表は lib/permalinks.json)。対応表に無ければ旧形式。
 */
const fs = require("fs");
const path = require("path");

const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "lib", "permalinks.json"), "utf8"));

function permalinkOf(slug) {
  return MAP.posts[String(slug).replace(/^\d{4}-\d{2}-\d{2}_/, "")] || null;
}

function postPath(slug) {
  const p = permalinkOf(slug);
  return p ? `/posts/${p}` : `/posts/${encodeURIComponent(slug)}`;
}

const FORM_RE = /^[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+-\d{2,}$/;

// 記事1本の対応表の不備を文字列の配列で返す(空なら問題なし)。
// category は frontmatter の category(省略可)。
function checkMapping(slugOrFilename, category) {
  const slug = String(slugOrFilename).replace(/\.md$/, "");
  const problems = [];
  const p = permalinkOf(slug);
  if (!p) {
    problems.push("lib/permalinks.json に登録がありません(キー: " + slug.replace(/^\d{4}-\d{2}-\d{2}_/, "") + ")");
    return problems;
  }
  if (!FORM_RE.test(p)) problems.push("形が 大/中/小-NN になっていません: " + p);
  if (category) {
    const big = MAP.categories[category];
    if (!big) problems.push("categories に無いカテゴリです: " + category);
    else if (p.split("/")[0] !== big) problems.push("大(" + p.split("/")[0] + ")が category「" + category + "」(" + big + ")と一致しません");
  }
  return problems;
}

module.exports = { postPath, permalinkOf, checkMapping, MAP, FORM_RE };
