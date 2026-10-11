# サイトレベル整合性監査

対象: `サイト運営/サイト本体/`
方針: 検出・一覧化のみ。コード編集は行わない。

## 1. ユーザー動線チェック(index → posts/[slug] → about → contact)

確認観点: トップ → 記事 → about → contact の導線のリンクが、すべて実在するページ・動的ルートに対応しているか(`pages/index.js`、`pages/posts/[slug].js`、`pages/about.js`)。

## 2. ヘッダー/フッター/共通コンポーネントの全内部リンク生存確認

確認観点: ヘッダー・フッター(about・privacy-policy・terms・contact)・管理画面メニュー・サイドバー等の全リンクが実在するか(`components/Header.js`・`Footer.js`・`AdminLayout.js`)。管理画面は`noindex, nofollow`。

## 3. 404ページの品質確認 (`pages/404.js`)

確認観点: 主要導線への誘導リンク・状況説明・noindex。

## 4. 旧ドメイン表記(vercel.app)の残存確認

確認観点: ドメイン移行後、サイトのコード・公開記事に旧`vercel.app`のハードコードが残っていないか(URLは`NEXT_PUBLIC_SITE_URL`で一元管理)。調査メモ・作業ログ・移行記録は対象外。

Grep範囲: `pages/`・`components/`・`lib/`・`記事データ/確定稿`・`記事データ/公開済み`・`next.config.js`・`pages/robots.txt.js`・`sitemap.xml.js`・環境変数ファイル(キー名のみ)。

| ファイル | 内容 | 判定 |
|---|---|---|

## まとめ

| 分類 | 件数 |
|---|---|
