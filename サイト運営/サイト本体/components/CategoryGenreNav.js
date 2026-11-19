import { CATEGORY_GENRES } from "../lib/categoryGenres";

// ジャンルごとの24x24線画アイコン(外部ライブラリなし)
const ICON_PATHS = {
  chat: (
    <>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  create: (
    <>
      <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
      <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  work: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M9 7.5V5.5h6v2M3.5 12.5h17" />
    </>
  ),
  learn: (
    <>
      <path d="M3 6.5c3-1.3 6-1.3 9 0v12c-3-1.3-6-1.3-9 0z" />
      <path d="M12 6.5c3-1.3 6-1.3 9 0v12c-3-1.3-6-1.3-9 0z" />
    </>
  ),
  compare: (
    <>
      <path d="M4 20V11M10 20V5M16 20v-7M22 20H2" />
    </>
  ),
};

function GenreIcon({ id }) {
  return (
    <svg
      className="genre-circle-icon"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[id] || ICON_PATHS.compare}
    </svg>
  );
}

// ジャンル数 n の正多角形の頂点に円を並べる。隣の円の中心間距離/直径≒0.7、
// かつリングの外にはみ出さない(R + D/2 ≒ 49.5%)ように式で配置する。
export default function CategoryGenreNav({ selected, onSelect }) {
  const n = CATEGORY_GENRES.length;
  const s = Math.sin(Math.PI / n);
  const R = 49.5 / (1 + s / 0.7);
  const D = (2 * R * s) / 0.7;

  return (
    <nav className="genre-nav" aria-label="ジャンルで絞り込む">
      <div className="genre-nav-ring">
        {CATEGORY_GENRES.map((g, i) => {
          const angle = ((-90 + (360 / n) * i) * Math.PI) / 180;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const active = selected === g.id;
          return (
            <button
              key={g.id}
              type="button"
              className={`genre-circle${active ? " is-active" : ""}`}
              style={{
                left: `${(50 + R * cos).toFixed(2)}%`,
                top: `${(50 + R * sin).toFixed(2)}%`,
                width: `${D.toFixed(2)}%`,
                "--ox": `${(cos * 14).toFixed(1)}%`,
                "--oy": `${(sin * 14).toFixed(1)}%`,
                "--g-soft": g.soft,
                "--g-line": g.line,
              }}
              aria-pressed={active}
              onClick={() => onSelect(g.id)}
            >
              <span className="genre-circle-body">
                <GenreIcon id={g.icon} />
                <span className="genre-circle-label">{g.label}</span>
                <span className="genre-circle-count">{g.categories.length}カテゴリ</span>
              </span>
            </button>
          );
        })}
        <button
          type="button"
          className={`genre-hub${selected === null ? " is-active" : ""}`}
          aria-pressed={selected === null}
          aria-label="すべてのカテゴリを表示"
          onClick={() => onSelect(null)}
        >
          <img
            src="/images/logo-mark.png"
            alt=""
            width={36}
            height={36}
            className="genre-hub-mark"
          />
          <span className="genre-hub-name">すべて</span>
        </button>
      </div>
    </nav>
  );
}
