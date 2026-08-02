import Layout from "../components/Layout";
import Mascot from "../components/Mascot";
import { getMainMascot, getCategoryMascot } from "../lib/categoryMascot";
import { MAJOR_CATEGORIES } from "../lib/categoryMeta";

export default function About() {
  const mainMascot = getMainMascot();
  const categoryMascots = MAJOR_CATEGORIES.map((name) => ({
    category: name,
    mascot: getCategoryMascot(name),
  })).filter((c) => c.mascot);

  return (
    <Layout
      title="運営者情報 | AI活用の総合ガイド｜NEVORA"
      description="AI活用の総合ガイド｜NEVORAの運営者情報です。"
      canonicalPath="/about"
    >
      <h1 className="page-title">運営者情報</h1>
      <div className="article-body">
        <table className="compare-table">
          <tbody>
            <tr>
              <th style={{ width: "30%" }}>サイト名</th>
              <td>AI活用の総合ガイド｜NEVORA</td>
            </tr>
            <tr>
              <th>運営者</th>
              <td>nevora</td>
            </tr>
            <tr>
              <th>所在地</th>
              <td>非公開(お問い合わせフォームよりご連絡ください)</td>
            </tr>
            <tr>
              <th>連絡先</th>
              <td>
                nevora01123@gmail.com(
                <a href="/contact">お問い合わせフォーム</a>
                からもご連絡いただけます)
              </td>
            </tr>
            <tr>
              <th>運営開始</th>
              <td>2026年7月</td>
            </tr>
          </tbody>
        </table>

        <h2>サイトの目的</h2>
        <p>
          当サイトは、生成AI・AIツールに関する情報を発信し、読者の皆様の業務効率化やスキルアップに役立てていただくことを目的として運営しています。
          記事内では、関連するツール・サービスをアフィリエイトリンクを通じてご紹介することがあります。
        </p>

        <h2>運営者について</h2>
        <p>
          個人でこのサイトを運営しています。自分自身が日々の業務でさまざまなAIツールを実際に試してきた経験をもとに、
          「カタログのような情報の羅列」ではなく、実際に使う場面を想定した比較・体験ベースの記事作りを心がけています。
          ツールの仕様・料金・機能は変更される場合があるため、導入の際は必ず公式サイトの最新情報をご確認ください。
        </p>

        <h2>サイトの案内キャラクターについて</h2>
        <p>
          当サイトでは、カテゴリごとの案内役として公式マスコットキャラクターを起用しています。
          いずれも実在の専門家・資格保有者を表すものではなく、読者の皆様に記事内容を分かりやすくお伝えするための、
          当サイト独自のブランドキャラクターです。
        </p>
        <div className="mascot-roster-main">
          <Mascot mascot={mainMascot} size={64} />
          <div>
            <p className="mascot-roster-role">{mainMascot.role}</p>
            <p className="mascot-roster-desc">
              サイト全体の案内役。トップページやカテゴリ紹介、各カテゴリ担当キャラクターをまとめる役割を担っています。
            </p>
          </div>
        </div>
        <ul className="mascot-roster-grid">
          {categoryMascots.map(({ category, mascot }) => (
            <li key={category} className="mascot-roster-item">
              <Mascot mascot={mascot} size={48} />
              <div>
                <p className="mascot-roster-role">{category} 担当</p>
              </div>
            </li>
          ))}
        </ul>

        <h2>記事制作・情報の取り扱いについて</h2>
        <p>
          記事は次の方針で制作しています。
        </p>
        <ul>
          <li>統計データや調査結果を引用する際は、出典・調査主体・調査対象を明記し、記事末尾の「出典」欄からたどれるようにしています</li>
          <li>商品の紹介は、実際に本文中で取り上げている悩み・カテゴリに合致するものに限定し、内容と無関係な商品を割り込ませないようにしています</li>
          <li>断定的な効果効能の表現は避け、個人差がある旨を明記するようにしています</li>
          <li>掲載後に情報の誤りや古くなった記載に気づいた場合は、確認のうえ随時修正しています</li>
        </ul>

        <h2>運営サイトについて</h2>
        <p>
          当サイトのほか、以下のサイトも運営しています。
        </p>
        <ul>
          <li>
            <a href="https://nevora-beauty.vercel.app/" target="_blank" rel="noopener noreferrer">
              美容の総合ガイド｜NEVORA
            </a>
          </li>
          <li>
            <a href="https://nevora-money.vercel.app/" target="_blank" rel="noopener noreferrer">
              お金の総合ガイド｜NEVORA
            </a>
          </li>
          <li>
            <a href="https://nevora-job.vercel.app/" target="_blank" rel="noopener noreferrer">
              副業・在宅ワークの総合ガイド｜NEVORA
            </a>
          </li>
          <li>
            <a href="https://nevora-lifestyle.vercel.app/" target="_blank" rel="noopener noreferrer">
              生活を豊かにする総合ガイド｜NEVORA
            </a>
          </li>
        </ul>

        <h2>免責事項</h2>
        <p>
          当サイトに掲載する情報については、正確性・安全性を保証するものではありません。詳細は
          <a href="/terms">免責事項・利用規約</a>
          をご確認ください。
        </p>

        <h2>プライバシーポリシー</h2>
        <p>
          個人情報の取り扱いについては<a href="/privacy-policy">プライバシーポリシー</a>をご確認ください。
        </p>

        <h2>お問い合わせについて</h2>
        <p>
          記事内容の訂正依頼・ご意見・掲載に関するお問い合わせは、
          <a href="/contact">お問い合わせフォーム</a>
          より随時受け付けています。内容を確認のうえ、必要に応じて担当者よりご連絡いたします。
        </p>
      </div>
    </Layout>
  );
}
