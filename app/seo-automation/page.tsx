import Link from 'next/link'
import {
  FiActivity, FiArrowRight, FiBarChart2, FiCheckCircle, FiClock, FiFileText, FiGithub, FiGlobe,
  FiInfo, FiLock, FiMail, FiMap, FiSearch, FiShield,
} from 'react-icons/fi'
import AppShell from '@/components/seo-automation/AppShell'
import MonitorVisual from '@/components/seo-automation/MonitorVisual'
import Reveal from '@/components/seo-automation/Reveal'
import { buildMetadata } from '@/lib/seo-page'
import { SITE_URL } from '@/lib/seo-config'
import {
  APP_NAME, APP_PATH, APP_URL, CONTACT_EMAIL, OAUTH_SCOPE, OPERATOR, POLICY_PATH, REPORT_RETENTION_DAYS,
} from '@/lib/seo-automation'

const DESCRIPTION = `${APP_NAME} is a private SEO monitoring and reporting tool built and operated by ${OPERATOR}. It uses the Google Search Console API, Node.js and GitHub Actions to monitor six websites he is authorised to manage.`

export const metadata = buildMetadata({
  title: `${APP_NAME} — Private SEO Monitoring Tool`,
  description: DESCRIPTION,
  path: APP_PATH,
  keywords: [APP_NAME, 'Google Search Console API', 'SEO monitoring', 'GitHub Actions'],
})

const STEPS = [
  { icon: FiGlobe, title: 'Website Monitoring', text: 'Six websites that I am authorised to manage are checked on a schedule.' },
  { icon: FiSearch, title: 'Google Search Console API', text: 'Performance, indexing-inspection and sitemap data is read for those properties.' },
  { icon: FiActivity, title: 'Automated SEO Audit', text: 'A Node.js script runs in GitHub Actions and checks the data and key site files.' },
  { icon: FiFileText, title: 'Reports', text: 'An audit report is generated for me to review. Nothing is changed automatically.' },
]

const FEATURES = [
  { icon: FiBarChart2, title: 'Search performance analysis', text: 'Reviews Search Console performance data such as clicks, impressions and positions to spot trends.' },
  { icon: FiCheckCircle, title: 'Indexing status checks', text: 'Reads URL inspection results to see how Google reports the indexing status of important pages.' },
  { icon: FiMap, title: 'Sitemap monitoring', text: 'Reads the sitemap information Google holds for each property to catch missing or failing sitemaps.' },
  { icon: FiFileText, title: 'robots.txt availability checks', text: 'Confirms that each site’s public robots.txt file is reachable.' },
  { icon: FiClock, title: 'Scheduled reporting', text: 'Runs on a schedule through GitHub Actions and produces a report each time.' },
]

const STACK = [
  { name: 'Next.js', note: 'This informational website' },
  { name: 'Node.js', note: 'Audit scripts' },
  { name: 'Google Search Console API', note: 'Performance, inspection and sitemap data' },
  { name: 'Google OAuth 2.0', note: 'Authorisation for API access' },
  { name: 'GitHub Actions', note: 'Scheduled runs, secrets and report artifacts' },
]

export default function SeoAutomationPage() {
  return (
    <AppShell
      crumbs={[{ name: APP_NAME, path: APP_PATH }]}
      schema={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${APP_URL}#webpage`,
        url: APP_URL,
        name: APP_NAME,
        description: DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#person` },
      }}
    >
      {/* ── Hero ── */}
      <section aria-labelledby="hero-title" className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#FF5C39]">
            <FiLock size={12} aria-hidden /> Private tool · Not a public service
          </p>
          <h1 id="hero-title" className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Multi Brand <span className="text-[#FF5C39]">SEO Automation</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            A private SEO monitoring and reporting application built and operated by {OPERATOR}. It uses the Google Search
            Console API, Node.js and GitHub Actions to keep an eye on six websites he is authorised to manage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C39] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C39]"
            >
              How it works <FiArrowRight size={15} aria-hidden />
            </a>
            <Link
              href={POLICY_PATH}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-bold transition-colors hover:border-[#FF5C39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C39]"
            >
              <FiShield size={15} aria-hidden /> Privacy Policy
            </Link>
          </div>
        </div>
        <Reveal delay={0.1}>
          <MonitorVisual />
        </Reveal>
      </section>

      {/* ── Private-tool notice ── */}
      <Reveal className="mt-14">
        <aside
          aria-label="Important notice"
          className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm leading-relaxed text-[var(--muted)]"
        >
          <FiInfo className="mt-0.5 shrink-0 text-[#FF5C39]" size={18} aria-hidden />
          <p>
            <strong className="text-[var(--fg)]">This is a private monitoring tool, not a public SEO service.</strong> It has no public
            sign-up and offers nothing to customers. It does not guarantee search rankings, does not automatically index pages
            and does not currently submit sitemaps. Its present functionality is monitoring and reporting.
          </p>
        </aside>
      </Reveal>

      {/* ── About ── */}
      <Section id="about" eyebrow="About" title="About the application">
        <p className="max-w-3xl leading-relaxed text-[var(--muted)]">
          {APP_NAME} is a personal tool that I built to keep track of the search health of six websites that I am authorised to manage.
          Instead of opening each Search Console property by hand, a scheduled workflow gathers the data, runs a set of checks and
          produces a report that I read myself. The application is used only by its operator and only for those websites.
        </p>
      </Section>

      {/* ── How it works ── */}
      <Section id="how-it-works" eyebrow="Process" title="How it works">
        <ol className="grid gap-4 md:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.07} className="relative h-full">
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C39]/10 text-[#FF5C39]" aria-hidden>
                      <Icon size={18} />
                    </span>
                    <span className="font-mono text-xs text-[var(--muted)]" aria-hidden>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold">{title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">{text}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <FiArrowRight className="absolute -right-3.5 top-1/2 hidden -translate-y-1/2 text-[var(--muted)] md:block" size={16} aria-hidden />
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Features ── */}
      <Section id="features" eyebrow="Capabilities" title="Key features">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[#FF5C39]/40">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5C39]/10 text-[#FF5C39]" aria-hidden>
                    <Icon size={18} />
                  </span>
                  <h3 className="text-sm font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Stack ── */}
      <Section id="stack" eyebrow="Built with" title="Technology stack">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map(({ name, note }) => (
            <li key={name} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
              <p className="text-sm font-bold">{name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">{note}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Privacy & security ── */}
      <Section id="privacy" eyebrow="Trust" title="Data privacy & security">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">
              <FiLock className="text-[#FF5C39]" size={16} aria-hidden /> What the application accesses
            </h3>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              It requests the Google OAuth scope <code className="break-all rounded bg-[var(--border)] px-1.5 py-0.5 font-mono text-[12px] text-[var(--fg)]">{OAUTH_SCOPE}</code> to
              read Search Console performance data, indexing inspection results and sitemap information for properties that the
              authorised Google account can access.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">
              <FiGithub className="text-[#FF5C39]" size={16} aria-hidden /> How it is protected
            </h3>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              OAuth credentials are kept in encrypted GitHub Actions repository secrets. Audit reports are generated by GitHub
              Actions and kept as workflow artifacts for up to {REPORT_RETENTION_DAYS} days.
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          Google data is used only for SEO monitoring and reporting. It is not used for advertising and it is not sold. Read the
          full details in the{' '}
          <Link href={POLICY_PATH} className="font-semibold text-[#FF5C39] underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>

      {/* ── Contact ── */}
      <Section id="contact" eyebrow="Contact" title="Contact & support">
        <div className="flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            Questions about this application or its privacy practices? Contact the operator, {OPERATOR}, directly. This is a private
            tool, so there is no public support desk.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C39] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C39]"
            >
              <FiMail size={15} aria-hidden /> {CONTACT_EMAIL}
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold transition-colors hover:border-[#FF5C39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C39]"
            >
              Visit the portfolio
            </Link>
          </div>
        </div>
      </Section>
    </AppShell>
  )
}

function Section({
  id, eyebrow, title, children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-16 scroll-mt-24">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#FF5C39]">{eyebrow}</p>
      <h2 id={`${id}-h`} className="mb-6 text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  )
}
