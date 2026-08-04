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
            AIツールの選び方から使い方まで、はじめての一歩をやさしく解説
          </p>
        </div>
      </div>
    </section>
  );
}
