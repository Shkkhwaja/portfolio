import Link from 'next/link'
import PageShell, { Section } from '@/components/seo/PageShell'
import { buildMetadata } from '@/lib/seo-page'
import { PERSON, SITE_URL } from '@/lib/seo-config'
import experience from '@/data/experience'
import education from '@/data/education'

export const metadata = buildMetadata({
  title: 'About Khwaja Hussain Shaikh — Full Stack Developer in Mumbai',
  description:
    'Khwaja Hussain Shaikh is a Mumbai-based Full Stack Developer (MERN, Next.js) at ZAR Luxury Pvt. Ltd. BCA Department Topper (CGPA 8.30) and two-time Tech Shaastra Hackathon winner.',
  path: '/about',
  keywords: ['about Khwaja Shaikh', 'who is Khwaja Shaikh', 'Full Stack Developer Mumbai', 'MERN stack developer India'],
  type: 'profile',
})

export default function AboutPage() {
  const current = experience[0]
  const degree = education[0]
  return (
    <PageShell
      crumbs={[{ name: 'About', path: '/about' }]}
      eyebrow="About"
      title="About Khwaja Hussain Shaikh — Full Stack Developer in Mumbai"
      intro={PERSON.tagline}
      schema={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/about#page`,
        url: `${SITE_URL}/about`,
        name: 'About Khwaja Hussain Shaikh',
        about: { '@id': `${SITE_URL}/#person` },
      }}
    >
      <Section id="who" title="Who is Khwaja Shaikh?">
        <div className="space-y-4 max-w-3xl leading-relaxed text-[var(--muted)]">
          <p>
            <strong className="text-[var(--fg)]">{PERSON.name}</strong> (also known as Khwaja Shaikh or KHS) is a{' '}
            {PERSON.title} based in Mumbai, Maharashtra, India. He builds fast, scalable and user-focused web
            applications with the MERN stack and Next.js — responsive frontends, secure REST APIs, JWT authentication,
            database optimisation, SEO improvements and cloud deployments on Vercel and Cloudflare R2.
          </p>
          <p>
            Since {current.period.split('—')[0].trim()} he has worked as a {current.role} at{' '}
            <strong className="text-[var(--fg)]">{current.company}</strong>, maintaining production-grade web platforms.
            He has shipped eight live production websites for real clients, from booking marketplaces to e-commerce and
            admin-managed catalogues.
          </p>
          <p>
            He holds a {degree.degree} from {degree.institution} ({degree.grade}), graduated as Department Topper and
            won the Tech Shaastra Hackathon in 2024 and 2025.
          </p>
        </div>
      </Section>

      <Section id="facts" title="Quick facts">
        <dl className="grid sm:grid-cols-2 gap-4">
          {[
            ['Location', PERSON.location],
            ['Current role', `${current.role} @ ${current.company}`],
            ['Education', `${degree.degree}, ${degree.institution}`],
            ['Availability', 'Open to freelance, contract and full-time roles'],
            ['Email', PERSON.email],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <dt className="text-xs font-mono uppercase tracking-wider text-[var(--muted)]">{k}</dt>
              <dd className="mt-1 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="explore" title="Explore the portfolio">
        <ul className="grid sm:grid-cols-2 gap-3">
          {[
            ['/projects', 'Projects', 'Eight live production websites with stack and role details'],
            ['/skills', 'Skills', 'Languages, frameworks, databases and tooling'],
            ['/experience', 'Experience', 'ZAR Luxury and SK Children Foundation'],
            ['/education', 'Education & certifications', 'BCA, HSC, SSC and professional certificates'],
            ['/hire', 'Hire Khwaja', 'Freelance and full-time availability, FAQ and contact'],
          ].map(([href, t, d]) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[#FF5C39] transition-colors"
              >
                <span className="font-bold">{t}</span>
                <span className="block text-sm text-[var(--muted)] mt-1">{d}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  )
}
