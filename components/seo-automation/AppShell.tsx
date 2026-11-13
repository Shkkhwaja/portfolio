import Link from 'next/link'
import { FiArrowLeft, FiShield } from 'react-icons/fi'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/lib/seo-page'
import { APP_NAME, APP_PATH, POLICY_PATH, CONTACT_EMAIL, OPERATOR } from '@/lib/seo-automation'

type Crumb = { name: string; path: string }

/**
 * Minimal, server-rendered chrome shared by the two OAuth pages:
 * header (brand + the two pages + link back to the portfolio), breadcrumbs, JSON-LD and a footer that links
 * to the Privacy Policy. Informational only — no login or Google authorisation controls anywhere.
 */
export default function AppShell({
  crumbs,
  schema,
  children,
}: {
  crumbs: Crumb[]
  schema?: object | object[]
  children: React.ReactNode
}) {
  const all: Crumb[] = [{ name: 'Home', path: '/' }, ...crumbs]
  const extra = schema ? (Array.isArray(schema) ? schema : [schema]) : []

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <JsonLd data={[breadcrumbSchema(all), ...extra]} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[#FF5C39] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-2)]/95">
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
          <Link href={APP_PATH} className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5C39] text-white" aria-hidden>
              <FiShield size={16} />
            </span>
            <span className="hidden sm:inline">{APP_NAME}</span>
            <span className="sm:hidden">Multi Brand SEO</span>
          </Link>
          <ul className="flex items-center gap-4 text-sm sm:gap-6">
            <li>
              <Link href={APP_PATH} className="text-[var(--muted)] transition-colors hover:text-[#FF5C39]">
                Overview
              </Link>
            </li>
            <li>
              <Link href={POLICY_PATH} className="text-[var(--muted)] transition-colors hover:text-[#FF5C39]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="inline-flex items-center gap-1.5 text-[var(--muted)] transition-colors hover:text-[#FF5C39]">
                <FiArrowLeft size={14} aria-hidden />
                <span className="whitespace-nowrap">Portfolio</span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-5 pb-16 pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-[var(--muted)]">
          <ol className="flex flex-wrap items-center gap-1.5">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i === all.length - 1 ? (
                  <span aria-current="page" className="text-[var(--fg)]">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="hover:text-[#FF5C39]">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {children}
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--bg-2)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[var(--fg)]">{APP_NAME}</p>
            <p className="mt-1 max-w-md text-xs leading-relaxed">
              A private SEO monitoring tool built and operated by {OPERATOR}. Not a public service.
            </p>
            <p className="mt-2 text-xs">© {new Date().getFullYear()} {OPERATOR}</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href={POLICY_PATH} className="font-medium text-[var(--fg)] underline underline-offset-4 hover:text-[#FF5C39]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href={APP_PATH} className="hover:text-[#FF5C39]">
                Application overview
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-[#FF5C39]">
                Portfolio
              </Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#FF5C39]">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
