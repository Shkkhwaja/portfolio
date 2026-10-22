import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PageShell, { Section, Pill } from '@/components/seo/PageShell'
import { buildMetadata } from '@/lib/seo-page'
import { SITE_URL, PERSON } from '@/lib/seo-config'
import projects from '@/data/projects'
import { slugify } from '@/lib/slug'

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((p) => ({ slug: slugify(p.title) }))
}

const find = (slug: string) => projects.find((p) => slugify(p.title) === slug)

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = find(params.slug)
  if (!p) return {}
  return buildMetadata({
    title: `${p.title} — ${p.subtitle}`,
    description: `${p.title} — ${p.subtitle}. ${p.description}`.slice(0, 300),
    path: `/projects/${params.slug}`,
    keywords: [p.title, `${p.title} developer`, ...p.stack],
    type: 'article',
  })
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const idx = projects.findIndex((p) => slugify(p.title) === params.slug)
  if (idx === -1) notFound()
  const p = projects[idx]
  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const next = projects[(idx + 1) % projects.length]

  return (
    <PageShell
      crumbs={[
        { name: 'Projects', path: '/projects' },
        { name: p.title, path: `/projects/${params.slug}` },
      ]}
      eyebrow={p.subtitle}
      title={`${p.title} — ${p.subtitle}`}
      intro={p.description}
      schema={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: p.title,
        headline: `${p.title} — ${p.subtitle}`,
        description: p.description,
        url: `${SITE_URL}/projects/${params.slug}`,
        ...(p.liveUrl ? { sameAs: p.liveUrl } : {}),
        image: `${SITE_URL}${p.media.src}`,
        keywords: p.stack.join(', '),
        author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: PERSON.name },
      }}
    >
      {p.media.type === 'image' && (
        <div className="relative aspect-[2/1] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)]">
          <Image src={p.media.src} alt={p.media.alt} fill priority sizes="(min-width:1024px) 960px, 100vw" className="object-cover" />
        </div>
      )}

      <Section id="role" title="My role">
        <p className="max-w-3xl text-[var(--muted)] leading-relaxed">{p.role}</p>
      </Section>

      {p.highlights && p.highlights.length > 0 && (
        <Section id="features" title="Key features">
          <ul className="max-w-3xl list-disc pl-5 space-y-2 text-[var(--muted)] leading-relaxed">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section id="stack" title="Technology stack">
        <ul className="flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Pill key={s}>{s}</Pill>
          ))}
        </ul>
      </Section>

      {p.liveUrl && (
        <Section id="live" title="See it live">
          <a
            href={p.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C39] text-white font-bold px-5 py-3 hover:brightness-110 transition"
          >
            Visit {p.title} ↗
          </a>
        </Section>
      )}

      <nav aria-label="More projects" className="flex flex-wrap justify-between gap-4 pt-4 border-t border-[var(--border)] text-sm">
        <Link href={`/projects/${slugify(prev.title)}`} className="hover:text-[#FF5C39]">
          ← {prev.title}
        </Link>
        <Link href="/projects" className="hover:text-[#FF5C39]">
          All projects
        </Link>
        <Link href={`/projects/${slugify(next.title)}`} className="hover:text-[#FF5C39]">
          {next.title} →
        </Link>
      </nav>
    </PageShell>
  )
}
