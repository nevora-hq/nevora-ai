/**
 * 記事のURL対応表(lib/permalinks.json)の検査。
 *
 *   node scripts/verify-permalinks.js           … 公開待ち・公開済みの全記事を検査(不備があれば exit 1)
 *   node scripts/verify-permalinks.js --build   … 公開済みだけを検査(ビルド前。公開待ちの不備は警告のみ)
 *
 * 見るもの: ①全記事が対応表にある ②形が 大/中/小-NN ③大が category と一致 ④URLの重複が無い。
 * 対応表に記事が無い(キーだけ残っている)場合は警告のみ。
 * 公開待ちの不備は、公開キュー(queue.js の公開時刻の割り当て・queue-release.js の公開)も止める。
 */
const fs = require("fs");
const path = require("path");
const { checkMapping, MAP, permalinkOf } = require("./permalink-path");

const DATA = path.join(__dirname, "..", "..", "記事データ");
const buildMode = process.argv.includes("--build");

function list(dir) {
  const d = path.join(DATA, dir);
  if (!fs.existsSync(d)) return [];
  return fs
    .readdirSync(d)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const t = fs.readFileSync(path.join(d, f), "utf8");
      const m = t.match(/^category:\s*"?(.*?)"?\s*$/m);
      return { dir, file: f, category: m ? m[1] : "" };
    });
}

const published = list("公開済み");
const pending = list("公開待ち");
let errors = 0;
let warnings = 0;

for (const a of [...published, ...pending]) {
  const problems = checkMapping(a.file, a.category);
  for (const pr of problems) {
    const isPending = a.dir === "公開待ち";
    const fatal = !(buildMode && isPending);
    console.error(`${fatal ? "[NG]" : "[警告]"} ${a.dir}/${a.file}: ${pr}`);
    if (fatal) errors++;
    else warnings++;
  }
}

const seen = new Map();
for (const [k, v] of Object.entries(MAP.posts)) {
  if (seen.has(v)) {
    console.error(`[NG] URLが重複しています: ${v}(${seen.get(v)} と ${k})`);
    errors++;
  }
  seen.set(v, k);
}

const keys = new Set([...published, ...pending].map((a) => a.file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}_/, "")));
for (const k of Object.keys(MAP.posts)) {
  if (!keys.has(k)) {
    console.warn(`[警告] 対応表にあるが記事が無いキー: ${k}`);
    warnings++;
  }
}

console.log(`[verify-permalinks] 記事 ${published.length + pending.length}本(公開済み${published.length}・公開待ち${pending.length}) 不備${errors}件 警告${warnings}件`);
process.exit(errors > 0 ? 1 : 0);
