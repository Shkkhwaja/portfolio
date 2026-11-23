export type Project = {
  id: number
  title: string
  subtitle: string
  description: string
  role: string
  stack: string[]
  /** public site; omit until the project is deployed / linkable */
  liveUrl?: string
  /** short bullet list shown on the project detail page and used by the chatbot / llms files */
  highlights?: string[]
  /** defaults to 'live' */
  status?: 'live' | 'in-progress'
  media: {
    type: 'gradient' | 'image' | 'video'
    src: string
    alt: string
  }
  accentColor: string
}

const projects: Project[] = [
  {
    id: 10,
    title: 'CodeMind AI',
    subtitle: 'AI-Assisted Bug Investigation for GitHub Repos',
    description:
      'An evidence-driven engineering platform that investigates a bug in a GitHub repository step by step — problem, evidence, hypotheses, root cause, fix and validation — before AI is involved, with human approval before any pull request. Includes secure sign-in with a forgot-password flow (email OTP verification over Google SMTP), GitHub App integration and encrypted token storage.',
    role: 'Built the full stack — secure sign-in and sessions, the forgot-password OTP flow, encrypted GitHub token storage, GitHub App integration and the investigation workflow UI.',
    stack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'GitHub App', 'Nodemailer', 'Ant Design', 'Tailwind CSS'],
    highlights: [
      'Investigation workflow: problem → evidence → hypotheses → root cause → fix → validation → human approval → pull request; AI comes in only after the evidence is gathered.',
      'Evidence gathering from the repository (exact text, symbols, files, dependencies, git history and vector search) feeds the AI step.',
      'Secure sign-in: scrypt-hashed passwords and random session tokens in HttpOnly cookies (only a hash of the token is stored).',
      'GitHub App integration, with GitHub tokens encrypted at rest (AES-256-GCM).',
      'Forgot-password flow: the user requests a 6-digit one-time code (OTP) sent by email through Google SMTP (Nodemailer), verifies it, then sets a new password.',
      'OTP safeguards: the code expires in 10 minutes, works once, is burned after 5 wrong guesses, and only a keyed hash of it is stored.',
      'Account safety: the reset response is identical whether or not the email is registered, resends have a cooldown and rate limits, and a successful reset signs the user out on every device.',
    ],
    liveUrl: 'https://codemind-ai-rho.vercel.app/login',
    media: {
      type: 'image',
      src: '/images/projects/codemind-ai.png',
      alt: 'CodeMind AI — sign-in screen: Investigate. Understand. Fix. Validate.',
    },
    accentColor: '#FF5C39',
  },
  {
    id: 1,
    title: 'Queryly',
    subtitle: 'AI-Powered Q&A Platform',
    description:
      'A full-stack Q&A / knowledge-sharing platform (Quora-style) with Google and email authentication, role-based access control, user profiles, likes, and comments. Supports 40+ beta users.',
    role: 'Designed and built the full frontend and backend — auth system, real-time interactions, and role-based dashboards.',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Ant Design'],
    liveUrl: 'http://queryly.vercel.app/',
    media: {
      type: 'image',
      src: '/images/projects/queryly.png',
      alt: 'Queryly — AI-Powered Q&A Platform',
    },
    accentColor: '#FF5C39',
  },
  {
    id: 5,
    title: 'Friday Charm',
    subtitle: 'Fashion & Lifestyle E-Commerce',
    description:
      'A modern fashion and lifestyle e-commerce storefront with curated product collections, smooth browsing experience, and a clean checkout flow. Built for performance and conversion.',
    role: 'Built the full storefront — product listings, category pages, cart flow, and responsive UI optimized for mobile-first shoppers.',
    stack: ['Next.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://fridaycharm.vercel.app/',
    media: {
      type: 'image',
      src: '/images/projects/friday-charm.png',
      alt: 'Friday Charm — Fashion E-Commerce',
    },
    accentColor: '#FF5C39',
  },
  {
    id: 11,
    title: 'FinalYear Labs',
    subtitle: 'Final-Year Project Platform for Students',
    description:
      'A platform where BCA, MCA, BSc IT and B.Tech students find a final-year project, preview the live demo, and get source code, report and PPT help, viva preparation and WhatsApp support — with category browsing, project search and custom-project requests.',
    role: 'Designed and built the website — project catalogue, search, demo previews and the WhatsApp support flow.',
    stack: ['Project Catalogue', 'Live Demos', 'Search', 'WhatsApp Support'],
    liveUrl: 'https://finalyear-labs.vercel.app/',
    media: {
      type: 'image',
      src: '/images/projects/finalyear-labs.png',
      alt: 'FinalYear Labs — Your Final-Year Project Starts Here',
    },
    accentColor: 'var(--lime)',
  },
]

export default projects
