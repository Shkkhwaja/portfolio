import Link from 'next/link'
import JsonLd from './JsonLd'
import ScrollingMascot from '@/components/ui/ScrollingMascot'
import { breadcrumbSchema } from '@/lib/seo-page'
import { PERSON } from '@/lib/seo-config'

export const SEO_NAV = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Experience', href: '/experience' },
  { label: 'Education', href: '/education' },
  { label: 'Hire Me', href: '/hire' },
]

type Crumb = { name: string; path: string }

/** Server-rendered shell for the crawlable content pages. One <h1> per page, semantic landmarks. */
export default function PageShell({
  crumbs,
  eyebrow,
  title,
  intro,
  schema,
  children,
}: {
  crumbs: Crumb[]
  eyebrow: string
  title: string
  intro: string
  schema?: object | object[]
  children: React.ReactNode
}) {
  const all: Crumb[] = [{ name: 'Home', path: '/' }, ...crumbs]
  const extra = schema ? (Array.isArray(schema) ? schema : [schema]) : []
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <JsonLd data={[breadcrumbSchema(all), ...extra]} />

      <header className="border-b border-[var(--border)] bg-[var(--bg-2)]/80 backdrop-blur sticky top-0 z-50">
        <nav aria-label="Primary" className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="font-black tracking-tight text-lg">
            <span className="text-[#FF5C39]">{PERSON.initials}</span>
            <span className="sr-only"> — {PERSON.name}, home</span>
          </Link>
          <ul className="flex items-center gap-4 sm:gap-6 text-sm overflow-x-auto">
            {SEO_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[var(--muted)] hover:text-[#FF5C39] transition-colors whitespace-nowrap">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-[var(--muted)] mb-6">
          <ol className="flex flex-wrap items-center gap-1.5">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i === all.length - 1 ? (
                  <span aria-current="page" className="text-[var(--fg)]">{c.name}</span>
                ) : (
                  <Link href={c.path} className="hover:text-[#FF5C39]">{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="text-sm font-mono text-[#FF5C39] tracking-widest uppercase mb-3">{eyebrow}</p>
        <h1 className="text-3xl md:text-5xl font-black leading-tight">{title}</h1>
        <p className="mt-4 max-w-3xl text-base md:text-lg text-[var(--muted)] leading-relaxed">{intro}</p>

        <div className="mt-12 space-y-12">{children}</div>
      </main>

      <footer className="border-t border-[var(--border)] mt-8">
        <div className="mx-auto max-w-5xl px-5 py-8 flex flex-col sm:flex-row gap-4 justify-between text-sm text-[var(--muted)]">
          <p>
            © {new Date().getFullYear()} {PERSON.name} — {PERSON.title}, Mumbai, India.
          </p>
          <ul className="flex flex-wrap gap-4">
            <li><a className="hover:text-[#FF5C39]" href={`mailto:${PERSON.email}`}>Email</a></li>
            <li><a className="hover:text-[#FF5C39]" href={PERSON.github} rel="me noopener">GitHub</a></li>
            <li><a className="hover:text-[#FF5C39]" href={PERSON.linkedin} rel="me noopener">LinkedIn</a></li>
            <li><Link className="hover:text-[#FF5C39]" href="/#contact">Contact form</Link></li>
          </ul>
        </div>
      </footer>

      <ScrollingMascot />
    </div>
  )
}

export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined}>
      <h2 id={id ? `${id}-h` : undefined} className="text-2xl md:text-3xl font-black mb-5">{title}</h2>
      {children}
    </section>
  )
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-xs font-mono px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]">{children}</li>
  )
}
