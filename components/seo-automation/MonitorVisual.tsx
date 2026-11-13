/**
 * Illustrative "SEO monitoring" visual: an abstract dashboard card with a trend line, bars and status rows.
 * Purely decorative — no real or invented metrics are shown. Pure SVG/CSS, server-rendered.
 */
export default function MonitorVisual() {
  const bars = [38, 56, 44, 68, 52, 78, 64]
  return (
    <div className="relative" role="img" aria-label="Illustration of an SEO monitoring dashboard with a trend line, bars and status checks">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-[#FF5C39]/15 via-transparent to-[var(--lime)]/15 blur-2xl" aria-hidden />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl sm:p-6">
        {/* window chrome */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Monitoring</span>
        </div>

        {/* trend */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] text-[var(--muted)]">Search performance</span>
            <span className="rounded-full bg-[#FF5C39]/10 px-2 py-0.5 font-mono text-[10px] text-[#FF5C39]">Overview</span>
          </div>
          <svg viewBox="0 0 300 110" className="h-28 w-full" fill="none" aria-hidden>
            <defs>
              <linearGradient id="saLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF5C39" />
                <stop offset="100%" stopColor="var(--lime)" />
              </linearGradient>
              <linearGradient id="saFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5C39" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#FF5C39" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[28, 56, 84].map((y) => (
              <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
            ))}
            <path d="M0 88 C30 80 45 62 75 66 S120 40 150 46 S200 70 225 38 S275 24 300 18 L300 110 L0 110 Z" fill="url(#saFill)" />
            <path
              className="sa-draw"
              pathLength={1}
              d="M0 88 C30 80 45 62 75 66 S120 40 150 46 S200 70 225 38 S275 24 300 18"
              stroke="url(#saLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* bars + checks */}
        <div className="mt-4 grid grid-cols-5 gap-4">
          <div className="col-span-3 flex h-24 items-end gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3" aria-hidden>
            {bars.map((h, i) => (
              <span
                key={i}
                className="sa-grow flex-1 rounded-t-md bg-gradient-to-t from-[#FF5C39] to-[#FF5C39]/50"
                style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
          <ul className="col-span-2 space-y-2.5 text-[11px]">
            {['Indexing', 'Sitemap', 'robots.txt'].map((t, i) => (
              <li key={t} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-2">
                <span className="font-mono text-[var(--fg)]">{t}</span>
                <span className="sa-pulse h-2 w-2 rounded-full bg-green-500" style={{ animationDelay: `${i * 300}ms` }} aria-hidden />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
