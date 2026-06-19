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
    'Khwaja Hussain Shaikh is one of the best Full Stack Developers in Mumbai, India — specializing in MERN stack (MongoDB, Express.js, React.js, Node.js) and Next.js. He builds production-grade web applications, RESTful APIs, and high-performance UIs. Available for hire as a freelance developer or full-time opportunity. Currently working at ZAR Luxury Pvt. Ltd. in Mumbai. BCA graduate from Tilak Maharashtra Vidyapeeth with a CGPA of 8.30, Department Topper, and double winner of Tech Shaastra Hackathon 2024 & 2025.',
  email:        'khwajashaikh703@gmail.com',
  location:     'Mumbai, Maharashtra, India',
  github:       'https://github.com/Shkkhwaja/',
  linkedin:     'https://linkedin.com/in/khwaja-shaikh-960b981b1/',
  whatsapp:     'https://wa.me/917039551617',
  profileImage: '/images/profile.jpg',
  resume:       '/resume.pdf',
} as const
