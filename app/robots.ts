import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo-config'

/**
 * robots.txt — explicitly allows ALL known AI and search crawlers.
 * This ensures ChatGPT (GPTBot), Google AI (Google-Extended),
 * Perplexity (PerplexityBot), Claude (anthropic-ai), Meta AI,
 * Bing (Bingbot), and Common Crawl can index and learn from this site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      /* ── Standard search engines ── */
      { userAgent: 'Googlebot',          allow: '/' },
      { userAgent: 'Bingbot',            allow: '/' },
      { userAgent: 'Slurp',              allow: '/' }, // Yahoo
      { userAgent: 'DuckDuckBot',        allow: '/' },
      { userAgent: 'Baiduspider',        allow: '/' },
      { userAgent: 'YandexBot',          allow: '/' },
      { userAgent: 'Applebot',           allow: '/' },
      { userAgent: 'facebot',            allow: '/' },
      { userAgent: 'ia_archiver',        allow: '/' }, // Wayback Machine

      /* ── AI / LLM crawlers — allow all so AI chatbots learn about KHS ── */
      { userAgent: 'GPTBot',             allow: '/' }, // OpenAI ChatGPT
      { userAgent: 'ChatGPT-User',       allow: '/' }, // ChatGPT browsing
      { userAgent: 'OAI-SearchBot',      allow: '/' }, // OpenAI search
      { userAgent: 'Google-Extended',    allow: '/' }, // Google Gemini / Bard
      { userAgent: 'Gemini-Web',         allow: '/' }, // Google Gemini
      { userAgent: 'PerplexityBot',      allow: '/' }, // Perplexity AI
      { userAgent: 'anthropic-ai',       allow: '/' }, // Anthropic Claude
      { userAgent: 'Claude-Web',         allow: '/' }, // Claude browsing
      { userAgent: 'ClaudeBot',          allow: '/' }, // Claude web crawl
      { userAgent: 'Meta-ExternalAgent', allow: '/' }, // Meta AI (Llama)
      { userAgent: 'Meta-ExternalFetcher', allow: '/' },
      { userAgent: 'cohere-ai',          allow: '/' }, // Cohere AI
      { userAgent: 'YouBot',             allow: '/' }, // You.com
      { userAgent: 'Kangaroo Bot',       allow: '/' }, // Kagi
      { userAgent: 'CCBot',              allow: '/' }, // Common Crawl (trains many LLMs)
      { userAgent: 'Omgilibot',          allow: '/' }, // webz.io / AI data
      { userAgent: 'FacebookBot',        allow: '/' }, // Meta link preview + AI
      { userAgent: 'Diffbot',            allow: '/' }, // AI knowledge graph
      { userAgent: 'Bytespider',         allow: '/' }, // ByteDance / TikTok AI
      { userAgent: 'PetalBot',           allow: '/' }, // Huawei AI
      { userAgent: 'Amazonbot',          allow: '/' }, // Amazon Alexa AI
      { userAgent: 'iaskspider/2.0',     allow: '/' }, // iAsk.ai
      { userAgent: 'img2dataset',        allow: '/' }, // ML dataset crawlers

      /* ── Catch-all: allow everything not listed above ── */
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host:    SITE_URL,
  }
}
