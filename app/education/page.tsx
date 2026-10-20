import PageShell from '@/components/seo/PageShell'
import { buildMetadata } from '@/lib/seo-page'
import education from '@/data/education'
import certifications from '@/data/certifications'

export const metadata = buildMetadata({
  title: 'Education & Certifications — BCA Department Topper, Tech Shaastra Winner',
  description:
    'Khwaja Shaikh holds a BCA from Tilak Maharashtra Vidyapeeth (CGPA 8.30, Department Topper) and certifications from ExcelR, Deloitte (Forage), Tata (Forage) and Great Learning.',
  path: '/education',
  keywords: ['BCA Tilak Maharashtra Vidyapeeth', 'Tech Shaastra Hackathon winner', 'ExcelR Full Stack Java', 'developer certifications'],
})

export default function EducationPage() {
  return (
    <PageShell
      crumbs={[{ name: 'Education', path: '/education' }]}
      eyebrow="Education"
      title="Education & Certifications"
      intro="Academic background, honours and professional certificates."
    >
      <section aria-labelledby="edu-h">
        <h2 id="edu-h" className="text-2xl md:text-3xl font-black mb-5">
          Education
        </h2>
        <ol className="space-y-4">
          {education.map((e) => (
            <li key={e.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="text-lg font-bold">{e.degree}</h3>
              <p className="text-[var(--muted)]">
                {e.institution}, {e.location}
              </p>
              <p className="text-sm font-mono text-[#FF5C39] mt-1">
                {e.period}
                {e.grade ? ` · ${e.grade}` : ''}
                {e.stream ? ` · ${e.stream}` : ''}
              </p>
              {e.honours && (
                <ul className="mt-3 list-disc pl-5 text-sm text-[var(--muted)]">
                  {e.honours.map((h) => (
                    <li key={h}>{h.replace(/^[^A-Za-z0-9]+/, '')}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cert-h">
        <h2 id="cert-h" className="text-2xl md:text-3xl font-black mb-5">
          Certifications
        </h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {certifications.map((c) => (
            <li key={c.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-sm text-[var(--muted)]">
                {c.issuer} · {c.date}
              </p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#FF5C39] hover:underline mt-2 inline-block"
              >
                View certificate ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
