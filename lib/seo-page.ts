import type { Metadata } from 'next'
import { SITE_URL, PERSON } from '@/lib/seo-config'

type PageMeta = {
  title: string
  description: string
  path: string // e.g. "/projects"
  keywords?: string[]
  type?: 'website' | 'article' | 'profile'
}

/** Per-page metadata with canonical, Open Graph, Twitter and robots — layout supplies the title template. */
export function buildMetadata({ title, description, path, keywords = [], type = 'website' }: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`
  const image = `${SITE_URL}${PERSON.ogImage}`
  return {
    title,
    description,
    keywords: [PERSON.name, 'Khwaja Shaikh', 'Full Stack Developer Mumbai', ...keywords],
    alternates: { canonical: url },
    openGraph: {
      type: type === 'profile' ? 'profile' : type,
      url,
      title: `${title} | ${PERSON.name}`,
      description,
      siteName: `${PERSON.name} — Portfolio`,
      locale: 'en_IN',
      images: [{ url: image, width: 1200, height: 630, alt: `${PERSON.name} — ${PERSON.title}` }],
    },
    twitter: { card: 'summary_large_image', title: `${title} | ${PERSON.name}`, description, images: [image] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  }
}
