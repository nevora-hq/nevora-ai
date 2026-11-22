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

module.exports = { postPath, permalinkOf };
