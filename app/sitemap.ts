import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    /* ── Root ── */
    {
      url:             SITE_URL,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        1.0,
    },

    /* ── Primary section anchors ── */
    {
      url:             `${SITE_URL}/#about`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/#skills`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.8,
    },
    {
      url:             `${SITE_URL}/#experience`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/#projects`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/#education`,
      lastModified:    new Date(),
      changeFrequency: 'yearly',
      priority:        0.7,
    },
    {
      url:             `${SITE_URL}/#certifications`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.7,
    },
    {
      url:             `${SITE_URL}/#contact`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    /* ── SEO intent anchors — hire / location / remote ── */
    {
      url:             `${SITE_URL}/#hire-me`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1.0,
    },
    {
      url:             `${SITE_URL}/#hire-full-stack-developer-mumbai`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1.0,
    },
    {
      url:             `${SITE_URL}/#website-developer-mumbai`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/#full-stack-developer-mumbai`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/#best-developer-near-me`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/#mern-stack-developer-mumbai`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/#nextjs-developer-mumbai`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/#react-developer-mumbai`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/#freelance-developer-mumbai`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/#remote-developer-india`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.85,
    },
    {
      url:             `${SITE_URL}/#available-for-remote-work`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.85,
    },
    {
      url:             `${SITE_URL}/#web-developer-india`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.85,
    },
  ]
}
