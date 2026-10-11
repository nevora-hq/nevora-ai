# アフィリエイトリンク削除台帳

## 背景・方針

AdSense審査を最優先するため、審査リスクとして残す意味のない既存アフィリエイトリンクを全件削除する場合の台帳と、貼り直しの手順。

- 削除対象は `サイト運営\記事データ\確定稿` / `公開済み` 側の記事frontmatter(`affiliateLinks:`)および、本文Markdown中で当該URLに直接張られていたリンク(`[label](URL)`、多くは末尾に `(PR)` 表記付き)。
- 表示機構(`lib/posts.js` の `embedAffiliateBanners`/`renderAffiliateBannerHtml`、`components/AffiliateBanner.js`、`pages/posts/[slug].js` の `post.affiliateLinks?.length > 0` 条件付き注意書き)は**削除しない**。frontmatterの `affiliateLinks` が空/未指定なら何も表示されない設計のため、削除したリンクの情報を**同じキー・URL・画像URLでfrontmatterに復元するだけ**で再掲載できる。
- 各記事本文中の「※本記事にはアフィリエイト広告(PR)を含みます。当サイトを経由して...」という手書きの注意書き段落も、実態(PRリンクなし)に合わせて削除する。貼り直し時はこの一文も復元すること。
- `pages/compare.js` は `items`(=全記事の `affiliateLinks` を集約したもの)が0件の間、ページ上部の固定注意書きを `items.length > 0` の条件付き表示にしている。リンクを復元すれば自動的に再表示される。

## 削除した記事一覧

| 記事(確定稿/公開済み) | 商品名 | 元URL | 画像URL | ASP |
|---|---|---|---|---|

## 削除漏れを防ぐ決まり

同じ記事が複数フォルダ(下書き/確定稿/公開済み)に重複して存在し得るので、一括処理の対象範囲は「フォルダ」ではなく「記事(ファイル名)」単位で洗い出すこと。

| 記事 | 商品名 | 元URL | 画像URL | ASP |
|---|---|---|---|---|

削除内容: frontmatter `affiliateLinks`、本文中の該当商品への直リンク・比較表内の該当行、末尾の「※本記事にはアフィリエイト広告を含みます。」の注意書き。

`確定稿`/`公開済み`/`下書き`全フォルダを対象にアフィリエイトリンクパターン(`a8.net`等のASPドメイン、`affiliateLinks:`、PR表記文言)を再検索し、残存がないことを確認する。プレースホルダー(`example.com`)でも全カット方針(実在有無を問わず記事にアフィリエイト言及自体を残さない)に従い削除する。

| 記事 | 内容 | 備考 |
|---|---|---|

## 貼り直し時の手順

1. 削除時に控えたURL・画像URLは提携解消の可能性があるため、貼り直し前にA8.net/もしもアフィリエイトの管理画面でリンクの有効性を再確認すること(URLをそのまま使い回さない)。
2. 該当記事のfrontmatterに `affiliateLinks:` を復元する(`docs/citation-format.md`と同様、`lib/posts.js`の`normalizeAffiliateLinks`が`label`/`url`/`image`キーを受け付ける)。
3. 本文中の該当箇所に `[商品名](URL)` の形でリンクを再設置する(`embedAffiliateBanners`は本文中の`href`一致でバナーを自動挿入するため、frontmatterと本文の両方にURLが必要)。
4. 「※本記事にはアフィリエイト広告(PR)を含みます。」等の注意書きは、`pages/posts/[slug].js`側で`post.affiliateLinks?.length > 0`のとき自動表示されるため、本文に手書きで再度追加する必要は**ない**(手書きの重複表示を避けるため)。
5. `pages/compare.js`は全記事の`affiliateLinks`を自動集約するため、追加の手作業は不要(`items.length > 0` の条件付き表示)。
