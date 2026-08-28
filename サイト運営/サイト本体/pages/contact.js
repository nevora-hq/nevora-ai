import Layout from "../components/Layout";

const CONTACT_EMAIL = "nevora01123@gmail.com";
const MAIL_SUBJECT = "【AI活用の総合ガイド｜NEVORA】お問い合わせ";

// お問い合わせはメール直行に一本化している(2026-08-28)。
// 以前はフォーム配信サービス(Formspree)経由の送信フォームを置いていたが、
// 外部サービスへ入力内容を預ける構成をやめ、運営者アドレスへのmailtoに統一した。
// メールソフトが使えない環境向けに、アドレス自体も本文中に明示している。
const MAIL_BODY = [
  "お名前:",
  "ご連絡先メールアドレス:",
  "",
  "お問い合わせ内容:",
  "",
  "",
  "※該当する記事がある場合は、記事タイトルまたはURLもご記入ください。",
].join("\n");

export default function Contact() {
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    MAIL_SUBJECT
  )}&body=${encodeURIComponent(MAIL_BODY)}`;

  return (
    <Layout
      title="お問い合わせ | AI活用の総合ガイド｜NEVORA"
      description="AI活用の総合ガイド｜NEVORAへのお問い合わせページです。ご意見・訂正依頼はメールでお寄せください。"
      canonicalPath="/contact"
    >
      <h1 className="page-title">お問い合わせ</h1>
      <div className="article-body">
        <p>
          記事内容へのご意見・ご指摘、掲載情報の訂正依頼、取材・お仕事のご依頼は、
          下記のメールアドレスまでご連絡ください。内容を確認のうえ、必要に応じて運営者よりご返信いたします。
        </p>

        <div className="contact-mail-box">
          <p className="contact-mail-label">メールアドレス</p>
          <p className="contact-mail-address">{CONTACT_EMAIL}</p>
          <a href={mailtoHref} className="affiliate-link-btn contact-mail-btn">
            メールソフトで作成する
          </a>
          <p className="contact-mail-note">
            ボタンを押すと、お使いのメールソフトで宛先・件名・記入項目を入れた下書きが開きます。
            開かない場合は、上のアドレスをコピーしてお送りください。
          </p>
        </div>

        <h2>ご連絡の際にお書き添えいただきたいこと</h2>
        <ul>
          <li>お名前(ニックネームでも構いません)</li>
          <li>ご連絡先メールアドレス(返信をご希望の場合)</li>
          <li>該当する記事のタイトルまたはURL(記事に関するご連絡の場合)</li>
          <li>お問い合わせ内容</li>
        </ul>

        <h2>ご返信について</h2>
        <p>
          個人で運営しているため、ご返信までにお時間をいただく場合があります。
          また、内容によってはご返信を差し控えさせていただくことがあります。あらかじめご了承ください。
        </p>

        <p className="page-note" style={{ marginTop: 24, marginBottom: 0 }}>
          いただいた個人情報は、お問い合わせへの対応のみに利用します。詳しくは
          <a href="/privacy-policy">プライバシーポリシー</a>
          をご確認ください。
        </p>
      </div>
    </Layout>
  );
}
