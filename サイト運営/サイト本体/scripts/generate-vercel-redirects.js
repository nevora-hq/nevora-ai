/**
 * 旧URL(/posts/<日付_題>)から新URL(/posts/大/中/小-NN)への転送(301)を vercel.json に書き出す。
 *
 *   node scripts/generate-vercel-redirects.js [--check]
 *
 * 対象は「公開済み」の記事(旧URLが実在したもの)。公開待ちは旧URLが公開されていないので不要。
 * 日本語の旧URLは percent-encoded の source と日本語のままの source の両方を書く(next.config.js の注記どおり)。
 * 公開済みの記事を増やしたあとに、対応表(lib/permalinks.json)を直してから再実行しない。
 * 新しい記事は最初から新URLなので、転送は増えない(旧URLの記事だけが対象)。
 * --check は、vercel.json が今の公開済みの旧URLを全部含むかだけを確かめる(書き込まない)。
 */
const fs = require("fs");
const path = require("path");
const { permalinkOf } = require("./permalink-path");

const ROOT = path.join(__dirname, "..");
const PUBLISHED = path.join(ROOT, "..", "記事データ", "公開済み");
const OUT = path.join(ROOT, "vercel.json");
const LEGACY = path.join(ROOT, "lib", "legacy-slugs.json");

// 転送の対象にする旧slugの台帳。初回は公開済みのファイル名から作り、以後は台帳に追記する
// (公開済みの記事は、公開のあと slug を変えないため)。
let legacy = [];
if (fs.existsSync(LEGACY)) legacy = JSON.parse(fs.readFileSync(LEGACY, "utf8"));
if (legacy.length === 0) {
  legacy = fs.readdirSync(PUBLISHED).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")).sort();
  if (!process.argv.includes("--check")) fs.writeFileSync(LEGACY, JSON.stringify(legacy, null, 1) + "\n");
}

const redirects = [];
const missing = [];
for (const slug of legacy) {
  const p = permalinkOf(slug);
  if (!p) {
    missing.push(slug);
    continue;
  }
  const dest = `/posts/${p}`;
  redirects.push({ source: `/posts/${encodeURI(slug)}`, destination: dest, statusCode: 301 });
  redirects.push({ source: `/posts/${slug}`, destination: dest, statusCode: 301 });
}
// 集約(吸収)で消した記事の旧URL。吸収先の新URLへ転送する(lib/merged-slugs.json: {旧slug: 吸収先の大/中/小-NN})。
const MERGED = path.join(ROOT, "lib", "merged-slugs.json");
if (fs.existsSync(MERGED)) {
  for (const [slug, p] of Object.entries(JSON.parse(fs.readFileSync(MERGED, "utf8")))) {
    redirects.push({ source: `/posts/${encodeURI(slug)}`, destination: `/posts/${p}`, statusCode: 301 });
    redirects.push({ source: `/posts/${slug}`, destination: `/posts/${p}`, statusCode: 301 });
  }
}
if (missing.length) {
  console.error("対応表に無い旧slug:", missing.join(", "));
  process.exit(1);
}

const body = JSON.stringify({ redirects }, null, 2) + "\n";
if (process.argv.includes("--check")) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  console.log(cur === body ? `OK: ${redirects.length}件` : "vercel.json が台帳と一致しません");
  process.exit(cur === body ? 0 : 1);
}
fs.writeFileSync(OUT, body);
console.log(`vercel.json に ${redirects.length}件(旧URL ${legacy.length}本)を書き出しました`);
