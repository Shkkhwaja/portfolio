import Link from 'next/link'
import { SEO_NAV } from './PageShell'

/** Crawlable internal links from the home page to the dedicated content pages. */
export default function ExploreLinks() {
  return (
    <nav aria-label="Explore more" className="border-t border-[var(--border)] py-8">
      <div className="mx-auto max-w-6xl px-6 md:px-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
        <span className="font-mono uppercase tracking-widest text-xs">Explore</span>
        {SEO_NAV.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-[#FF5C39] transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
