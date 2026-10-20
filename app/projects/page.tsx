import Link from 'next/link'
import Image from 'next/image'
import PageShell, { Pill } from '@/components/seo/PageShell'
import { buildMetadata } from '@/lib/seo-page'
import { SITE_URL } from '@/lib/seo-config'
import projects from '@/data/projects'
import { slugify } from '@/lib/slug'

export const metadata = buildMetadata({
  title: 'Projects — Live Next.js & MERN Stack Websites by Khwaja Shaikh',
  description:
    'Eight live production websites built by Khwaja Hussain Shaikh: Queryly, MehendiBooking, Space One Surfaces, Friday Charm, Design Guild Awards, Bellavita Smart Home, INKA Media and BLP Interior.',
  path: '/projects',
  keywords: ['Next.js projects', 'MERN stack projects', 'full stack developer portfolio projects Mumbai', 'React portfolio'],
})

export default function ProjectsPage() {
  return (
    <PageShell
      crumbs={[{ name: 'Projects', path: '/projects' }]}
      eyebrow="Projects"
      title="Projects by Khwaja Shaikh — Live Next.js, React & MERN Stack Websites"
      intro="A selection of production websites and web applications built for real clients, with the stack used and the role played on each."
      schema={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Projects by Khwaja Hussain Shaikh',
        url: `${SITE_URL}/projects`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: projects.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/projects/${slugify(p.title)}`,
            name: p.title,
          })),
        },
      }}
    >
      <ul className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => {
          const slug = slugify(p.title)
          return (
            <li key={p.id}>
              <article className="h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col">
                {p.media.type === 'image' && (
                  <Link href={`/projects/${slug}`} tabIndex={-1} aria-hidden className="relative block aspect-video bg-[var(--bg)]">
                    <Image src={p.media.src} alt={p.media.alt} fill sizes="(min-width:768px) 480px, 100vw" className="object-cover" />
                  </Link>
                )}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h2 className="text-xl font-black">
                    <Link href={`/projects/${slug}`} className="hover:text-[#FF5C39] transition-colors">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="text-sm font-mono text-[#FF5C39]">{p.subtitle}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{p.description}</p>
                  <ul className="flex flex-wrap gap-2 mt-auto pt-2" aria-label={`${p.title} technologies`}>
                    {p.stack.map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                  </ul>
                  <Link href={`/projects/${slug}`} className="text-sm font-bold text-[#FF5C39] hover:underline">
                    Read the project details →
                  </Link>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </PageShell>
  )
}
