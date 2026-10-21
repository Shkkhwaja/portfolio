/**
 * Central SEO configuration.
 * To use a custom domain, set NEXT_PUBLIC_SITE_URL in Vercel → Settings → Env Vars.
 * Example: NEXT_PUBLIC_SITE_URL=https://khwajashaikh.dev
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://khwajashaikh.vercel.app'

export const PERSON = {
  name:         'Khwaja Hussain Shaikh',
  shortName:    'Khwaja Shaikh',
  initials:     'KHS',
  title:        'Full Stack Developer',
  tagline:      'Full Stack Developer specializing in MERN Stack, Next.js & scalable web applications.',
  description:
    'Khwaja Hussain Shaikh is a Full Stack Developer in Mumbai, India, building fast MERN-stack and Next.js web apps. Works at ZAR Luxury; BCA Department Topper and 2x Tech Shaastra Hackathon winner. Open to freelance and full-time work.',
  email:        'khwajashaikh703@gmail.com',
  location:     'Mumbai, Maharashtra, India',
  github:       'https://github.com/Shkkhwaja/',
  linkedin:     'https://www.linkedin.com/in/khwaja-shaikh/',
  linkedinLegacy: 'https://linkedin.com/in/khwaja-shaikh-960b981b1/', // older URL still used in on-page links; kept in sameAs
  whatsapp:     'https://wa.me/917039551617',
  profileImage: '/images/khwaja-shaikh.jpg', // 800x800 headshot (from public/images/personal-photo)
  ogImage:      '/images/og-image.jpg', // 1200x630 crop of the same headshot, ~38 KB
  resume:       '/resume.pdf',
} as const
