#!/usr/bin/env node
/**
 * 主要ページのテキストコントラストを機械的に検査する。
 * CLAUDE.md「デザイン上のコントラスト比の基準」(新規は6:1目標、5:1未満は不合格)の
 * 取りこぼしを防ぐためのもの。
 *
 *   npm run build && npx next start -p 3123
 *   node scripts/check-contrast.js            … http://localhost:3123 を検査
 *   node scripts/check-contrast.js 3000       … ポート指定
 *
 * 2種類の検査を行う:
 *   (A) DOM検査  … 各テキスト要素の文字色と、祖先をたどって見つけた背景色で比を計算する。
 *                  背景が画像・グラデーションの要素は自動判定できないため「要手動確認」に回す。
 *   (B) 実測検査 … ヒーロー/セクションバンドのように写真+スクリムの上に白文字を重ねる箇所は、
 *                  文字を透明にしたスクリーンショットから「文字が実際に置かれる矩形」の
 *                  最も明るい画素を拾い、白文字とのコントラストを算出する。
 *                  (A)では判定できないため、こちらが正となる。
 */
const p = require("playwright-core");
const sharp = require("sharp");

const PORT = process.argv[2] || "3123";
const ORIGIN = `http://localhost:${PORT}`;
const THRESHOLD = 6;

// (B)の実測検査で判定する要素。(A)は背景が写真+スクリムのため正しく判定できず、
// 常に「1:1台のNG」として出てしまうので除外する。
const OVERLAY_SELECTORS = [
  "hero-banner-title", "hero-banner-lead", "hero-banner-eyebrow",
  "hero-banner-mascot-name", "section-band-title", "section-band-lead",
];

const PAGES = ["/", "/category", "/worry", "/about", "/terms", "/privacy-policy", "/search", "/compare", "/ranking", "/contact"];

// 写真+スクリムの上に白文字を重ねる箇所(実測検査の対象)
const OVERLAY_TARGETS = [
  ["hero-title", ".hero-banner-title"],
  ["hero-lead", ".hero-banner-lead"],
  ["hero-eyebrow", ".hero-banner-eyebrow"],
  ["band-title", ".section-band-title"],
  ["band-lead", ".section-band-lead"],
];
const OVERLAY_WIDTHS = [390, 768, 1024, 1280, 1920];
// 実測時に透明化する要素(背景だけを残す)
const HIDE_CSS = ".hero-banner-copy,.hero-banner-mascot,.section-band-overlay .container{opacity:0!important}";

function lum(r, g, b) {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

// ページ内で実行し、テキスト要素ごとの文字色・背景色を集める
const COLLECT = () => {
  function parse(s) {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const a = m[1].split(",").map((x) => parseFloat(x));
    return { rgb: a.slice(0, 3), a: a.length > 3 ? a[3] : 1 };
  }
  function bgOf(el) {
    let e = el, acc = null;
    while (e) {
      const st = getComputedStyle(e);
      if (st.backgroundImage && st.backgroundImage !== "none") {
        return { unknown: true, why: st.backgroundImage.slice(0, 40) };
      }
      const b = parse(st.backgroundColor);
      if (b && b.a > 0) {
        if (b.a >= 0.99) return { rgb: b.rgb };
        if (!acc) acc = b;
      }
      e = e.parentElement;
    }
    return acc ? { rgb: acc.rgb } : { rgb: [255, 255, 255] };
  }
  const out = [];
  document.querySelectorAll("body *").forEach((el) => {
    const txt = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join("");
    if (!txt) return;
    const st = getComputedStyle(el);
    if (st.visibility === "hidden" || st.display === "none" || parseFloat(st.opacity) === 0) return;
    const sel = String(el.className || el.tagName).slice(0, 40);
    if (st.webkitTextFillColor === "rgba(0, 0, 0, 0)") {
      out.push({ sel, txt: txt.slice(0, 24), manual: "グラデーション文字" });
      return;
    }
    const fg = parse(st.color);
    if (!fg) return;
    const bg = bgOf(el);
    if (bg.unknown) {
      out.push({ sel, txt: txt.slice(0, 24), manual: "背景=" + bg.why });
      return;
    }
    out.push({ sel, txt: txt.slice(0, 24), fg: fg.rgb, bg: bg.rgb, fgCss: st.color });
  });
  return out;
};

async function domCheck(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const bad = [], manual = new Set();
  for (const path of PAGES) {
    await page.goto(ORIGIN + path, { waitUntil: "networkidle" });
    for (const r of await page.evaluate(COLLECT)) {
      if (OVERLAY_SELECTORS.some((c) => r.sel.includes(c))) continue;
      if (r.manual) { manual.add(`${path} | ${r.sel} | ${r.txt} | ${r.manual}`); continue; }
      const L1 = lum(...r.fg), L2 = lum(...r.bg);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      if (ratio < THRESHOLD) bad.push({ path, ratio, ...r });
    }
  }
  await page.close();
  return { bad, manual };
}

async function overlayCheck(browser) {
  const rows = [];
  for (const w of OVERLAY_WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(ORIGIN + "/", { waitUntil: "networkidle" });
    for (const [name, sel] of OVERLAY_TARGETS) {
      const rects = await page.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return null;
        el.scrollIntoView({ block: "center" });
        const r = document.createRange();
        r.selectNodeContents(el);
        return Array.from(r.getClientRects()).map((x) => ({ x: x.x, y: x.y, width: x.width, height: x.height }));
      }, sel);
      if (!rects || !rects.length) continue;
      await page.waitForTimeout(250);
      await page.addStyleTag({ content: HIDE_CSS });
      await page.waitForTimeout(150);
      let maxL = 0, px = null;
      for (const rc of rects) {
        const clip = {
          x: Math.max(0, Math.round(rc.x)),
          y: Math.max(0, Math.round(rc.y)),
          width: Math.max(1, Math.round(Math.min(rc.width, w - rc.x))),
          height: Math.max(1, Math.round(rc.height)),
        };
        if (clip.y + clip.height > 900) clip.height = 900 - clip.y;
        if (clip.height < 1) continue;
        const buf = await page.screenshot({ clip });
        const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
        for (let i = 0; i < data.length; i += info.channels) {
          const L = lum(data[i], data[i + 1], data[i + 2]);
          if (L > maxL) { maxL = L; px = [data[i], data[i + 1], data[i + 2]]; }
        }
      }
      await page.reload({ waitUntil: "networkidle" });
      rows.push({ w, name, px, ratio: 1.05 / (maxL + 0.05) });
    }
    await page.close();
  }
  return rows;
}

(async () => {
  const browser = await p.chromium.launch();
  let ng = 0;
  try {
    console.log(`検査対象: ${ORIGIN}(しきい値 ${THRESHOLD}:1)\n`);

    const { bad, manual } = await domCheck(browser);
    console.log("=== (A) DOM検査: しきい値未満 ===");
    const seen = new Set();
    bad.sort((a, b) => a.ratio - b.ratio).forEach((r) => {
      const k = r.sel + r.fgCss + r.bg.join();
      if (seen.has(k)) return;
      seen.add(k);
      ng++;
      console.log(`${r.ratio.toFixed(2)} | ${r.path} | ${r.sel} | ${r.fgCss} on rgb(${r.bg.join(",")}) | ${r.txt}`);
    });
    if (!seen.size) console.log("(なし)");

    console.log("\n=== (B) 写真+スクリム上の白文字(実測) ===");
    const rows = await overlayCheck(browser);
    rows.forEach((r) => {
      const ok = r.ratio >= THRESHOLD;
      if (!ok) ng++;
      console.log(`${String(r.w).padStart(4)}px ${r.name.padEnd(13)} 最明画素 rgb(${r.px.join(",")}) → 白文字 ${r.ratio.toFixed(2)}:1 ${ok ? "OK" : "NG"}`);
    });
    const worst = rows.reduce((a, b) => (a && a.ratio < b.ratio ? a : b), null);
    if (worst) console.log(`最悪ケース: ${worst.w}px ${worst.name} = ${worst.ratio.toFixed(2)}:1`);

    console.log("\n=== (C) 自動判定できない箇所(目視で確認する) ===");
    [...manual].forEach((m) => console.log(m));
  } finally {
    await browser.close();
  }
  if (ng) {
    console.log(`\n${ng}件がしきい値未満です。`);
    process.exitCode = 1;
  }
})();
