export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <img
        src="/images/hero/home-hero.webp"
        alt=""
        className="hero-banner-img"
        fetchPriority="high"
      />
      <div className="hero-banner-overlay">
        <div className="container hero-banner-inner">
          <p className="hero-banner-eyebrow">WEB MAGAZINE</p>
          <h1 className="hero-banner-title">AI活用の総合ガイド｜NEVORA</h1>
          <p className="hero-banner-lead">
            生成AIツールの選び方・使い方・業務効率化のコツを信頼できる情報でわかりやすく解説します。
          </p>
        </div>
      </div>
    </section>
  );
}
