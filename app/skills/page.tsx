import PageShell, { Section, Pill } from '@/components/seo/PageShell'
import { buildMetadata } from '@/lib/seo-page'
import { SITE_URL } from '@/lib/seo-config'
import skills from '@/data/skills'

export const metadata = buildMetadata({
  title: 'Skills — React, Next.js, Node.js, MongoDB & TypeScript Developer',
  description:
    "Khwaja Shaikh's technical skills: JavaScript, TypeScript, Java, React.js, Next.js, Tailwind CSS, GSAP, Node.js, Express.js, Spring Boot, MongoDB, PostgreSQL, MySQL, REST APIs, JWT, Git, Vercel and Cloudflare.",
  path: '/skills',
  keywords: ['React developer skills', 'Next.js developer', 'Node.js developer Mumbai', 'MongoDB', 'TypeScript developer India'],
})

export default function SkillsPage() {
  return (
    <PageShell
      crumbs={[{ name: 'Skills', path: '/skills' }]}
      eyebrow="Skills"
      title="Technical Skills — MERN Stack, Next.js & Full Stack Development"
      intro="The languages, frameworks, databases and tools Khwaja Shaikh uses to build production web applications."
      schema={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Technical skills of Khwaja Hussain Shaikh',
        url: `${SITE_URL}/skills`,
        itemListElement: skills
          .flatMap((c) => c.skills)
          .map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name })),
      }}
    >
      {skills.map((cat) => (
        <Section key={cat.category} id={cat.category.toLowerCase().replace(/[^a-z]+/g, '-')} title={cat.category}>
          <ul className="flex flex-wrap gap-2">
            {cat.skills.map((s) => (
              <Pill key={s.name}>{s.name}</Pill>
            ))}
          </ul>
        </Section>
      ))}
    </PageShell>
  )
}
