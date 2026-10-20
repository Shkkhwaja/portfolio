import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-config'
import projects from '@/data/projects'
import { slugify } from '@/lib/slug'

type Entry = MetadataRoute.Sitemap[number]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: [string, Entry['changeFrequency'], number][] = [
    ['', 'weekly', 1.0],
    ['/about', 'monthly', 0.8],
    ['/projects', 'weekly', 0.9],
    ['/skills', 'monthly', 0.7],
    ['/experience', 'monthly', 0.7],
    ['/education', 'yearly', 0.5],
    ['/hire', 'monthly', 0.8],
  ]
  return [
    ...pages.map(([path, changeFrequency, priority]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${slugify(p.title)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
