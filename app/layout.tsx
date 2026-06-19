import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import CustomCursor from '@/components/ui/CustomCursor'
import SmoothScroll from '@/components/ui/SmoothScroll'
import { SITE_URL, PERSON } from '@/lib/seo-config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
})

/* ─────────────────────────────────────────────────────────────────
   METADATA
   Covers: Google, Bing, LinkedIn, Twitter/X, WhatsApp, Facebook,
   Slack, Discord, iMessage, Open Graph crawlers, and AI models
   that read standard meta tags (Perplexity, You.com, Arc, etc.)
───────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  /* ── Base URL (required for absolute OG image paths) ── */
  metadataBase: new URL(SITE_URL),

  /* ── Primary identity ── */
  title: {
    default: `${PERSON.name} — ${PERSON.title}`,
    template: `%s | ${PERSON.name}`,
  },
  description: PERSON.description,

  /* ── Keywords ── */
  keywords: [
    /* Identity */
    'Khwaja Hussain Shaikh',
    'Khwaja Shaikh',
    'Khwaja Shaikh Mumbai',
    'Khwaja Shaikh developer',
    'Khwaja Shaikh full stack developer',
    'who is Khwaja Shaikh',
    'who is Khwaja Shaikh Mumbai',
    'KHS developer',
    'Khwajashaikh',
    /* Best / top developer search intent */
    'best developer in Mumbai',
    'best full stack developer Mumbai',
    'best developer in India',
    'best full stack developer India',
    'top developer Mumbai',
    'top full stack developer India',
    'best web developer Mumbai',
    'best MERN stack developer India',
    'best Next.js developer Mumbai',
    'best React developer India',
    /* Hire / freelance intent */
    'hire full stack developer Mumbai',
    'hire React developer India',
    'hire Next.js developer',
    'hire MERN stack developer',
    'hire web developer Mumbai',
    'freelance developer Mumbai',
    'freelance full stack developer India',
    'available for hire developer Mumbai',
    'web developer for hire India',
    'remote developer India',
    /* Role / skill keywords */
    'Full Stack Developer Mumbai',
    'MERN Stack Developer India',
    'Next.js Developer Mumbai',
    'React Developer India',
    'Node.js Developer Mumbai',
    'JavaScript Developer Mumbai',
    'TypeScript Developer India',
    'Web Developer Mumbai',
    'Software Developer Mumbai',
    /* Project / company */
    'ZAR Luxury developer',
    'Tilak Maharashtra Vidyapeeth BCA',
    'Tech Shaastra Hackathon winner',
    'Queryly developer',
    'MehendiBooking developer',
    /* Technologies */
    'MERN Stack', 'Next.js', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL',
  ],

  /* ── Author & creator ── */
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator:  PERSON.name,
  publisher: PERSON.name,

  /* ── Canonical & alternates ── */
  alternates: {
    canonical: SITE_URL,
    languages: { 'en-IN': SITE_URL, 'en': SITE_URL },
  },

  /* ── Robots directive — allow ALL crawlers including AI ── */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  /* ── Open Graph (LinkedIn, Facebook, WhatsApp, Discord, Slack) ── */
  openGraph: {
    type: 'profile',
    url: SITE_URL,
    locale: 'en_IN',
    siteName: `${PERSON.name} — Portfolio`,
    title: `${PERSON.name} — ${PERSON.title}`,
    description: PERSON.description,
    images: [
      {
        url: `${SITE_URL}/images/profile.jpg`,
        width: 1200,
        height: 630,
        alt: `${PERSON.name} — ${PERSON.title} from Mumbai, India`,
        type: 'image/jpeg',
      },
    ],
    // Profile-specific OG tags (used by LinkedIn to generate rich cards)
    firstName: 'Khwaja Hussain',
    lastName:  'Shaikh',
    username:  'khwajashaikh',
    gender:    'male',
  },

  /* ── Twitter / X Card ── */
  twitter: {
    card:        'summary_large_image',
    title:       `${PERSON.name} — ${PERSON.title}`,
    description: PERSON.description,
    images:      [`${SITE_URL}/images/profile.jpg`],
    creator:     '@khwajashaikh',
  },

  /* ── Icons ── */
  icons: {
    icon:        '/favicon.svg',
    shortcut:    '/favicon.svg',
    apple:       '/favicon.svg',
  },

  /* ── App / PWA hints ── */
  applicationName: `${PERSON.name} Portfolio`,
  category:        'Technology',

  /* ── Verification tokens (add your actual codes here) ─────────
     Google: https://search.google.com/search-console
     Bing:   https://www.bing.com/webmasters
  ─────────────────────────────────────────────────────────────── */
  // verification: {
  //   google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  //   yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
  //   other:  { 'msvalidate.01': 'YOUR_BING_CODE' },
  // },

  /* ── Other ── */
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
}

/* ── Viewport (separate export as per Next.js 14+ requirement) ── */
export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   [
    { media: '(prefers-color-scheme: dark)',  color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      {/*
        Extra head tags that Next.js Metadata API doesn't directly expose:
        - geo tags help Google Search Console understand location
        - DC (Dublin Core) metadata is parsed by some academic/AI indexers
      */}
      <head>
        <meta name="geo.region"      content="IN-MH" />
        <meta name="geo.placename"   content="Mumbai, Maharashtra, India" />
        <meta name="geo.position"    content="19.0760;72.8777" />
        <meta name="ICBM"            content="19.0760, 72.8777" />

        <meta name="DC.title"        content={`${PERSON.name} — ${PERSON.title}`} />
        <meta name="DC.creator"      content={PERSON.name} />
        <meta name="DC.subject"      content="Full Stack Developer, MERN Stack, Next.js, Mumbai" />
        <meta name="DC.description"  content={PERSON.description} />
        <meta name="DC.type"         content="InteractiveResource" />
        <meta name="DC.format"       content="text/html" />
        <meta name="DC.language"     content="en" />
        <meta name="DC.coverage"     content="Mumbai, India" />

        {/* AI-specific: tell LLM crawlers to read llms.txt */}
        <link rel="ai-txt" href={`${SITE_URL}/llms.txt`} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          <SmoothScroll>
            <CustomCursor />
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  )
}
