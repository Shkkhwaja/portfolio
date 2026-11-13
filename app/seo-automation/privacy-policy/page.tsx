import Link from 'next/link'
import AppShell from '@/components/seo-automation/AppShell'
import { buildMetadata } from '@/lib/seo-page'
import { SITE_URL } from '@/lib/seo-config'
import {
  APP_NAME, APP_PATH, APP_URL, CONTACT_EMAIL, GOOGLE_API_POLICY_URL, GOOGLE_CONNECTIONS_URL, OAUTH_SCOPE,
  OPERATOR, OPERATOR_LOCATION, POLICY_LAST_UPDATED, POLICY_PATH, POLICY_URL, REPORT_RETENTION_DAYS,
} from '@/lib/seo-automation'

const DESCRIPTION = `Privacy Policy for ${APP_NAME}, a private SEO monitoring tool. Explains how Google Search Console data is accessed, used, stored, retained and how to revoke access.`

export const metadata = buildMetadata({
  title: `Privacy Policy — ${APP_NAME}`,
  description: DESCRIPTION,
  path: POLICY_PATH,
  keywords: [`${APP_NAME} privacy policy`, 'Google OAuth privacy policy', 'Google Search Console API'],
})

const code = 'break-all rounded bg-[var(--border)] px-1.5 py-0.5 font-mono text-[12px] text-[var(--fg)]'
const link = 'font-semibold text-[#FF5C39] underline underline-offset-4 hover:brightness-110'

type PolicySection = { id: string; title: string; body: React.ReactNode }

const SECTIONS: PolicySection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    body: (
      <>
        <p>
          This Privacy Policy explains how {APP_NAME} (the “Application”) handles information, including data received from Google
          APIs. The Application is a private SEO monitoring and reporting tool, built and operated by {OPERATOR} for websites he is
          authorised to manage. It is not a public service: it has no public sign-up, and visitors to this website are not asked to
          log in or to authorise anything.
        </p>
        <p>
          This policy applies to the Application only. The pages under <code className={code}>/seo-automation</code> do not require login
          and do not request Google authorisation. Other features of the portfolio website at {SITE_URL.replace('https://', '')} (for
          example its contact form or AI assistant) are separate from the Application and are not covered here.
        </p>
      </>
    ),
  },
  {
    id: 'operator',
    title: 'Application Operator and Contact',
    body: (
      <>
        <p>
          The Application is operated by <strong>{OPERATOR}</strong>, {OPERATOR_LOCATION}.
        </p>
        <p>
          Contact: <a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </>
    ),
  },
  {
    id: 'information-accessed',
    title: 'Information Accessed Through Google Search Console',
    body: (
      <>
        <p>
          After the Google account owner authorises access, the Application can access the following Search Console information for
          properties that the authorised Google account is able to access:
        </p>
        <ul>
          <li><strong>Performance data</strong> — search analytics for those properties, such as queries, pages, clicks, impressions, click-through rate and average position.</li>
          <li><strong>Indexing inspection results</strong> — the indexing status that Google reports for specific URLs.</li>
          <li><strong>Sitemap information</strong> — the sitemaps recorded for a property and their reported status.</li>
        </ul>
        <p>
          The Application also checks whether each monitored website’s public <code className={code}>robots.txt</code> file is reachable.
          That check is made against the public website and does not involve Google user data.
        </p>
      </>
    ),
  },
  {
    id: 'how-data-is-used',
    title: 'How Google Data Is Used',
    body: (
      <>
        <p>
          Google data is used only to provide SEO monitoring and reporting for the websites listed in the Application: reviewing
          search performance, checking indexing status, monitoring sitemaps and producing scheduled audit reports for the operator to
          read.
        </p>
        <ul>
          <li>Google data is not used for advertising, including personalised or interest-based advertising.</li>
          <li>Google data is not sold.</li>
          <li>The Application does not guarantee search rankings, does not automatically index pages and does not currently submit sitemaps. Its present functionality is monitoring and reporting.</li>
        </ul>
        <p>
          The Application’s use and transfer of information received from Google APIs to any other app will adhere to the{' '}
          <a className={link} href={GOOGLE_API_POLICY_URL} target="_blank" rel="noopener noreferrer">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
      </>
    ),
  },
  {
    id: 'oauth',
    title: 'Google OAuth Authorization',
    body: (
      <>
        <p>The Application requests the following Google OAuth 2.0 scope:</p>
        <p>
          <code className={code}>{OAUTH_SCOPE}</code>
        </p>
        <p>
          This scope covers Google Search Console. Although it technically allows both reading and changing Search Console data, the
          Application currently makes monitoring and reporting requests only; it does not currently submit sitemaps or change
          Search Console settings.
        </p>
        <p>
          Authorisation is given by the Google account owner on Google’s own consent screen. The Application never sees or stores a
          Google account password.
        </p>
      </>
    ),
  },
  {
    id: 'storage-security',
    title: 'Data Storage and Security',
    body: (
      <>
        <ul>
          <li><strong>OAuth credentials</strong> are stored in encrypted GitHub Actions repository secrets. They are not placed in source code or in this website’s client-side code.</li>
          <li><strong>Audit reports</strong> are generated through GitHub Actions and retained as workflow artifacts for up to {REPORT_RETENTION_DAYS} days.</li>
        </ul>
        <p>
          No method of storage or transmission is completely secure, and this policy does not claim any security certification or
          independent audit.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Data Sharing and Third-Party Services',
    body: (
      <>
        <p>Google data is not shared with, or sold to, third parties. The Application relies on two infrastructure and API providers:</p>
        <ul>
          <li><strong>Google</strong> — provides the Search Console API and Google OAuth 2.0.</li>
          <li><strong>GitHub</strong> — runs the scheduled workflows (GitHub Actions) and stores the encrypted secrets and report artifacts.</li>
        </ul>
        <p>
          This informational website is hosted on Vercel. The Application’s Google data is processed in GitHub Actions, not by this
          website.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'Data Retention and Deletion',
    body: (
      <>
        <p>
          Audit reports are kept as GitHub Actions workflow artifacts for up to {REPORT_RETENTION_DAYS} days. Reports may be deleted
          earlier by the operator. Revoking Google access does not by itself delete reports that already exist: they may remain until
          they are deleted or their retention period expires.
        </p>
        <p>
          To ask for stored reports to be deleted, contact <a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'revoking',
    title: 'Revoking Google Account Access',
    body: (
      <>
        <p>You can withdraw the Application’s access at any time from your Google Account:</p>
        <ol>
          <li>
            Open{' '}
            <a className={link} href={GOOGLE_CONNECTIONS_URL} target="_blank" rel="noopener noreferrer">
              your Google Account’s third-party connections
            </a>{' '}
            (Google Account → Security → Your connections to third-party apps &amp; services).
          </li>
          <li>Select {APP_NAME}.</li>
          <li>Choose to delete or remove the connection.</li>
        </ol>
        <p>
          Revoking access prevents future authorised API requests by the Application. Reports that were already generated are not
          removed automatically; see “Data Retention and Deletion” above.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'User Rights',
    body: (
      <>
        <p>
          You may contact the operator to ask what information the Application holds that relates to you, to request deletion of
          stored reports, or to ask a question about this policy. You can also withdraw authorisation yourself at any time, as
          described above. Any further rights depend on the law that applies to you.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    body: (
      <p>
        This policy may be updated from time to time, for example if the Application’s functionality changes. The updated version will
        be published on this page and the “Last updated” date at the top will change.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact Information',
    body: (
      <>
        <p>
          {OPERATOR}, {OPERATOR_LOCATION}
        </p>
        <p>
          Email: <a className={link} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p>
          Application overview:{' '}
          <Link className={link} href={APP_PATH}>
            {APP_URL}
          </Link>
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <AppShell
      crumbs={[
        { name: APP_NAME, path: APP_PATH },
        { name: 'Privacy Policy', path: POLICY_PATH },
      ]}
      schema={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${POLICY_URL}#webpage`,
        url: POLICY_URL,
        name: `Privacy Policy — ${APP_NAME}`,
        description: DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@type': 'Thing', name: APP_NAME, url: APP_URL },
      }}
    >
      <header className="max-w-3xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#FF5C39]">Legal</p>
        <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-lg font-semibold text-[var(--fg)]">{APP_NAME}</p>
        <p className="mt-2 font-mono text-xs text-[var(--muted)]">Last updated: {POLICY_LAST_UPDATED}</p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        {/* contents */}
        <nav aria-label="Policy contents" className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">Contents</p>
          <ol className="space-y-1.5 text-sm">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-2 text-[var(--muted)] transition-colors hover:text-[#FF5C39]">
                  <span className="font-mono text-xs leading-5 text-[var(--muted)]/70">{String(i + 1).padStart(2, '0')}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* body */}
        <article className="max-w-3xl space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24">
              <h2 id={`${s.id}-h`} className="mb-3 text-xl font-black tracking-tight sm:text-2xl">
                <span className="mr-2 font-mono text-base text-[#FF5C39]">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="space-y-3 text-[15px] leading-relaxed text-[var(--muted)] [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_strong]:text-[var(--fg)] [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
                {s.body}
              </div>
            </section>
          ))}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm text-[var(--muted)]">
            <Link href={APP_PATH} className={link}>
              ← Back to the {APP_NAME} overview
            </Link>
          </div>
        </article>
      </div>
    </AppShell>
  )
}
