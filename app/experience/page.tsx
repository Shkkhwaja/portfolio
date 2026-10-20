import PageShell, { Pill } from '@/components/seo/PageShell'
import { buildMetadata } from '@/lib/seo-page'
import { SITE_URL } from '@/lib/seo-config'
import experience from '@/data/experience'

export const metadata = buildMetadata({
  title: 'Experience — Full Stack Developer at ZAR Luxury, Mumbai',
  description:
    'Professional experience of Khwaja Hussain Shaikh: Full Stack Developer at ZAR Luxury Pvt. Ltd. (Dec 2025 – present) and Frontend Developer Intern / Web Domain Mentor at SK Children Foundation.',
  path: '/experience',
  keywords: ['ZAR Luxury developer', 'full stack developer experience', 'frontend intern', 'Mumbai developer work experience'],
})

export default function ExperiencePage() {
  return (
    <PageShell
      crumbs={[{ name: 'Experience', path: '/experience' }]}
      eyebrow="Experience"
      title="Professional Experience — Full Stack Developer, Mumbai"
      intro="Where Khwaja Shaikh has worked and what he built there."
      schema={experience.map((e) => ({
        '@context': 'https://schema.org',
        '@type': 'Role',
        roleName: e.role,
        startDate: e.period.split('—')[0].trim(),
        description: e.bullets.join(' '),
        url: `${SITE_URL}/experience`,
      }))}
    >
      {experience.map((e) => (
        <article key={e.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-2xl font-black">
            {e.role} <span className="text-[var(--muted)] font-medium">at {e.company}</span>
          </h2>
          <p className="mt-1 text-sm font-mono text-[#FF5C39]">
            {e.period} · {e.type} · {e.location}
          </p>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-[var(--muted)] leading-relaxed">
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <h3 className="sr-only">Technologies used at {e.company}</h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {e.tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </ul>
        </article>
      ))}
    </PageShell>
  )
}
