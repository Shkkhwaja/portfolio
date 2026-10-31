/**
 * Hero backdrop — pure markup + CSS (see ".hb-*" in globals.css). Server component.
 *
 * Design language matches the rest of the site: the fine grid and corner marks from the intro,
 * mono-type micro labels, and only the brand orange + lime. Motion is slow and ambient
 * (drifting glows, rotating hairline rings) — no flashes, no sweeps.
 * Everything animates with transform only.
 */

const PLUS_MARKS = [
  { top: '22%', left: '8%' },
  { top: '68%', left: '14%' },
  { top: '30%', left: '86%' },
  { top: '78%', left: '78%' },
]

export default function HeroBackdrop() {
  return (
    <div className="hb-root" aria-hidden>
      {/* ambient glows: brand orange (left) and lime (lower right) */}
      <div className="hb-blob hb-blob-a" />
      <div className="hb-blob hb-blob-b" />

      {/* fine architectural grid, fading toward the edges */}
      <div className="hb-grid" />

      {/* crosshair marks on grid intersections */}
      {PLUS_MARKS.map((p, i) => (
        <span key={i} className="hb-plus" style={{ top: p.top, left: p.left }} />
      ))}

      {/* hairline rings with two slowly orbiting dots */}
      <svg className="hb-rings" viewBox="0 0 1000 1000" fill="none">
        <defs>
          <linearGradient id="hbRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--hb-orange)" stopOpacity="0.85" />
            <stop offset="60%" stopColor="var(--hb-lime)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--hb-lime)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="hbRingSoft" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--hb-lime)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--hb-lime)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="500" cy="500" r="130" stroke="url(#hbRingSoft)" strokeWidth="1" />
        <circle cx="500" cy="500" r="230" stroke="url(#hbRing)" strokeWidth="1" opacity="0.6" />
        <circle cx="500" cy="500" r="330" stroke="url(#hbRingSoft)" strokeWidth="1" />
        <circle cx="500" cy="500" r="430" stroke="url(#hbRing)" strokeWidth="1" opacity="0.5" />
        <circle cx="500" cy="500" r="495" stroke="url(#hbRingSoft)" strokeWidth="1" />

        <g className="hb-spin" style={{ transformOrigin: '500px 500px' }}>
          <circle cx="500" cy="500" r="280" stroke="var(--hb-orange)" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 10" />
          <circle cx="500" cy="220" r="4.5" fill="var(--hb-orange)" />
        </g>
        <g className="hb-spin-rev" style={{ transformOrigin: '500px 500px' }}>
          <circle cx="500" cy="500" r="380" stroke="var(--hb-lime)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="56 20 6 20" />
          <circle cx="880" cy="500" r="4" fill="var(--hb-lime)" />
        </g>
      </svg>

      {/* corner marks — same motif as the intro screen */}
      <span className="hb-corner hb-corner-tl" />
      <span className="hb-corner hb-corner-br" />

      {/* mono micro labels (desktop only) */}
      <span className="hb-label hb-label-coords">19.0760° N · 72.8777° E</span>
      <span className="hb-label hb-label-side">Full Stack · MERN · Next.js</span>
    </div>
  )
}
