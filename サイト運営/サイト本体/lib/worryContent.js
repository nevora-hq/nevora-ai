// 困りごとページ(/worry/[slug])の独自コンテンツを一元管理する。
// slugをキーに、title/description/summary/mascotComment/cta/intro/keyPoints/
// causes/selfCheck/steps/faq を持つ(構造はpages/worry/[slug].jsを参照)。
// 未執筆のslugはnullを返し、ページ側で該当セクションを出し分ける。
// 執筆時は「使い方がわからない5件→ツール選び5件→作る・稼ぐ5件」の3バッチで進める。
const worryContent = {};

export function getWorryContent(slug) {
  return worryContent[slug] || null;
}

export default worryContent;
