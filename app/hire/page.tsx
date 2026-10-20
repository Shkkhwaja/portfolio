import Link from 'next/link'
import PageShell, { Section } from '@/components/seo/PageShell'
import { buildMetadata } from '@/lib/seo-page'
import { PERSON } from '@/lib/seo-config'

export const metadata = buildMetadata({
  title: 'Hire a Full Stack Developer in Mumbai — Freelance & Full-Time',
  description:
    'Hire Khwaja Hussain Shaikh, a Mumbai Full Stack Developer (MERN, Next.js) for freelance projects, contract work or full-time roles. Remote-friendly, working with clients in India and worldwide.',
  path: '/hire',
  keywords: [
    'hire full stack developer Mumbai',
    'hire Next.js developer',
    'hire MERN stack developer',
    'freelance web developer India',
    'hire React developer India',
  ],
})

const FAQ = [
  {
    q: 'Who is Khwaja Hussain Shaikh?',
    a: 'Khwaja Hussain Shaikh is a Full Stack Developer from Mumbai, India, specialising in the MERN stack and Next.js. He works at ZAR Luxury Pvt. Ltd., holds a BCA from Tilak Maharashtra Vidyapeeth (CGPA 8.30) and won the Tech Shaastra Hackathon in 2024 and 2025.',
  },
  {
    q: 'Is Khwaja available for freelance or full-time work?',
    a: 'Yes. He is open to freelance projects, contract work and full-time roles, in Mumbai or remotely.',
  },
  {
    q: 'What technologies does he work with?',
    a: 'React.js, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, TypeScript, Tailwind CSS, GSAP, REST APIs and JWT authentication, deployed on Vercel and Cloudflare R2.',
  },
  {
    q: 'What kind of projects has he built?',
    a: 'Eight live production websites, including a booking marketplace, an e-commerce storefront, an admin-managed product catalogue, an awards platform with Razorpay payments and agency marketing sites.',
  },
  {
    q: 'How can I contact him?',
    a: `Email ${PERSON.email}, message him on LinkedIn, or use the contact form on the portfolio.`,
  },
]

const SERVICES: [string, string][] = [
  ['Websites & web apps', 'Responsive, SEO-ready Next.js and React sites for businesses, startups and brands.'],
  ['Backends & APIs', 'Node.js / Express REST APIs with JWT authentication and role-based access.'],
  ['Databases', 'MongoDB and PostgreSQL schema design and performance tuning.'],
  ['Performance & SEO', 'Lazy loading, caching, structured data and Core Web Vitals improvements.'],
]

export default function HirePage() {
  return (
    <PageShell
      crumbs={[{ name: 'Hire', path: '/hire' }]}
      eyebrow="Hire"
      title="Hire a Full Stack Developer in Mumbai — Khwaja Shaikh"
      intro="Need a React, Next.js or MERN stack developer who ships production-ready work? Here is how to work with Khwaja."
      schema={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }}
    >
      <Section id="services" title="What I can build for you">
        <ul className="grid sm:grid-cols-2 gap-4">
          {SERVICES.map(([t, d]) => (
            <li key={t} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <h3 className="font-bold">{t}</h3>
              <p className="text-sm text-[var(--muted)] mt-1">{d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq" title="Frequently asked questions">
        <dl className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <dt className="font-bold">{f.q}</dt>
              <dd className="mt-2 text-[var(--muted)] leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="contact" title="Get in touch">
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${PERSON.email}`}
            className="rounded-xl bg-[#FF5C39] text-white font-bold px-5 py-3 hover:brightness-110 transition"
          >
            Email Khwaja
          </a>
          <Link
            href="/#contact"
            className="rounded-xl border border-[var(--border)] px-5 py-3 font-bold hover:border-[#FF5C39] transition-colors"
          >
            Use the contact form
          </Link>
          <a
            href={PERSON.linkedin}
            target="_blank"
            rel="me noopener noreferrer"
            className="rounded-xl border border-[var(--border)] px-5 py-3 font-bold hover:border-[#FF5C39] transition-colors"
          >
            LinkedIn
          </a>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Prefer to chat? Click the robot at the bottom of the page and ask it anything — it knows this portfolio.
        </p>
      </Section>
    </PageShell>
  )
}
