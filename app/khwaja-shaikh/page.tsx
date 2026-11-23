import Link from 'next/link'
import Image from 'next/image'
import PageShell, { Section, Pill } from '@/components/seo/PageShell'
import { buildMetadata } from '@/lib/seo-page'
import { PERSON, SITE_URL } from '@/lib/seo-config'
import experience from '@/data/experience'
import education from '@/data/education'
import projects from '@/data/projects'
import { slugify } from '@/lib/slug'

const PATH = '/khwaja-shaikh'
const DESCRIPTION =
  'Khwaja Shaikh (Khwaja Hussain Shaikh) is a Full Stack Developer from Mumbai, India, working with React, Next.js, Node.js and MongoDB. Official website with profile, projects, skills and contact details.'

export const metadata = buildMetadata({
  title: 'Khwaja Shaikh — Full Stack Developer in Mumbai (Official Website)',
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'Khwaja Shaikh',
    'Khwaja Shaikh Mumbai',
    'Khwaja Shaikh developer',
    'Khwaja Shaikh full stack developer',
    'Khwaja Hussain Shaikh',
    'Khwaja Shaikh portfolio',
  ],
  type: 'profile',
})

export default function KhwajaShaikhPage() {
  const current = experience[0]
  const degree = education[0]

  return (
    <PageShell
      crumbs={[{ name: 'Khwaja Shaikh', path: PATH }]}
      eyebrow="Official website"
      title="Khwaja Shaikh"
      intro="Full Stack Developer from Mumbai, India — also known as Khwaja Hussain Shaikh. This is the official website and home of his portfolio."
      schema={{
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}${PATH}#profilepage`,
        url: `${SITE_URL}${PATH}`,
        name: 'Khwaja Shaikh — Full Stack Developer in Mumbai',
        description: DESCRIPTION,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#person` },
        mainEntity: { '@id': `${SITE_URL}/#person` },
      }}
    >
      <Section id="who" title="Who is Khwaja Shaikh?">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
          <Image
            src={PERSON.profileImage}
            alt="Khwaja Shaikh — Full Stack Developer in Mumbai"
            width={800}
            height={800}
            priority
            sizes="(min-width: 640px) 224px, 160px"
            className="h-40 w-40 shrink-0 rounded-2xl border border-[var(--border)] object-cover sm:h-56 sm:w-56"
          />
          <div className="max-w-3xl space-y-4 leading-relaxed text-[var(--muted)]">
            <p>
              <strong className="text-[var(--fg)]">Khwaja Shaikh</strong> — full name <strong className="text-[var(--fg)]">{PERSON.name}</strong> — is a
              {' '}{PERSON.title} based in {PERSON.location}. He builds web applications with React, Next.js, Node.js and MongoDB, from
              responsive interfaces to secure REST APIs.
            </p>
            <p>
              He currently works as a {current.role} at {current.company} ({current.period.split('—')[0].trim()} – present). He holds a {degree.degree}
              {' '}from {degree.institution} ({degree.grade}).
            </p>
            <p>
              This website, <a className="font-semibold text-[#FF5C39] underline underline-offset-4" href={SITE_URL}>{SITE_URL.replace('https://', '')}</a>, is
              his own — the place to find his work and to get in touch.
            </p>
          </div>
        </div>
      </Section>

      <Section id="known-as" title="Also searched as">
        <ul className="flex flex-wrap gap-2">
          {['Khwaja Shaikh', 'Khwaja Hussain Shaikh', 'Khwaja Shaikh Mumbai', 'Khwaja Shaikh developer', 'KHS'].map((n) => (
            <Pill key={n}>{n}</Pill>
          ))}
        </ul>
        <p className="mt-3 max-w-3xl text-sm text-[var(--muted)]">
          If you were looking for the Mumbai-based Full Stack Developer, you are in the right place. Official profiles are listed below.
        </p>
      </Section>

      <Section id="profiles" title="Official profiles & contact">
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            ['Website', SITE_URL, SITE_URL.replace('https://', '')],
            ['GitHub', PERSON.github, PERSON.github.replace('https://', '')],
            ['LinkedIn', PERSON.linkedin, PERSON.linkedin.replace('https://', '')],
            ['Email', `mailto:${PERSON.email}`, PERSON.email],
          ].map(([label, href, text]) => (
            <li key={label}>
              <a
                href={href}
                rel="me noopener"
                target={href.startsWith('http') ? '_blank' : undefined}
                className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:border-[#FF5C39]"
              >
                <span className="block font-mono text-xs uppercase tracking-wider text-[var(--muted)]">{label}</span>
                <span className="mt-1 block break-all font-medium">{text}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="work" title="Work by Khwaja Shaikh">
        <ul className="grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/projects/${slugify(p.title)}`}
                className="block h-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:border-[#FF5C39]"
              >
                <span className="font-bold">{p.title}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{p.subtitle}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm">
          <Link href="/projects" className="font-semibold text-[#FF5C39] underline underline-offset-4">
            See all projects
          </Link>
          {' · '}
          <Link href="/about" className="font-semibold text-[#FF5C39] underline underline-offset-4">
            More about him
          </Link>
          {' · '}
          <Link href="/hire" className="font-semibold text-[#FF5C39] underline underline-offset-4">
            Hire Khwaja
          </Link>
        </p>
      </Section>
    </PageShell>
  )
}
