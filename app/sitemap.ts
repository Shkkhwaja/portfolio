import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:             SITE_URL,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1.0,
    },
    // Section anchors — helps Google understand page structure
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
      changeFrequency: 'yearly',
      priority:        0.8,
    },
  ]
}
