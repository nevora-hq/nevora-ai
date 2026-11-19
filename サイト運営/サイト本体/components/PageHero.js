import SectionBand from "./SectionBand";

// 下層ページ冒頭の写真ヒーロー。トップの写真バンド(SectionBand)を再利用する薄いラッパー。
// title は1ページに1つの h1 になるため、ページ本文側に別の h1 を置かないこと。
// 直下の .page-panel は globals.css の .page-hero + .container > .page-panel で上に重なる。
export default function PageHero({
  eyebrow,
  title,
  lead,
  base = "/images/band/band-01",
  objectPosition = "50% 8%",
}) {
  return (
    <div className="page-hero">
      <SectionBand base={base} widths={[640, 1024, 1536]} objectPosition={objectPosition}>
        {eyebrow && <p className="page-hero-eyebrow">{eyebrow}</p>}
        <h1 className="page-hero-title">{title}</h1>
        {lead && <p className="section-band-lead">{lead}</p>}
      </SectionBand>
    </div>
  );
}
