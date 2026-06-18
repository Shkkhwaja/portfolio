import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import CustomCursor from '@/components/ui/CustomCursor'
import SmoothScroll from '@/components/ui/SmoothScroll'

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

export const metadata: Metadata = {
  title: 'Khwaja Hussain Shaikh — Full Stack Developer',
  description:
    'Full Stack Developer specializing in MERN stack and Next.js. Building scalable web applications, RESTful APIs, and responsive UIs from Mumbai, India.',
  keywords: [
    'Full Stack Developer',
    'MERN Stack',
    'Next.js',
    'React',
    'Node.js',
    'TypeScript',
    'Mumbai',
    'Khwaja Hussain Shaikh',
  ],
  authors: [{ name: 'Khwaja Hussain Shaikh', url: 'https://github.com' }],
  creator: 'Khwaja Hussain Shaikh',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'Khwaja Hussain Shaikh — Full Stack Developer',
    description:
      'Full Stack Developer specializing in MERN stack and Next.js. Building scalable web applications from Mumbai, India.',
    siteName: 'Khwaja Hussain Shaikh Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khwaja Hussain Shaikh — Full Stack Developer',
    description: 'Full Stack Developer | MERN Stack | Next.js | Mumbai',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
