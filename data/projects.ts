export type Project = {
  id: number
  title: string
  subtitle: string
  description: string
  role: string
  stack: string[]
  liveUrl: string
  media: {
    type: 'gradient' | 'image' | 'video'
    src: string
    alt: string
  }
  accentColor: string
}

const projects: Project[] = [
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
    id: 2,
    title: 'MehendiBooking',
    subtitle: 'Mehendi Artist Booking Marketplace',
    description:
      'India\'s mehendi-artist discovery and booking platform connecting brides with 500+ verified artists across Mumbai, Navi Mumbai & Thane. Features style-based browsing, ₹99 lifetime-access model, portfolio galleries, and an artist-onboarding flow.',
    role: 'Led full frontend development — booking flows, artist profiles, location-based search, and companion Android app UI.',
    stack: ['Next.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://mehendibooking.com/',
    media: {
      type: 'image',
      src: '/images/projects/mehendibooking.png',
      alt: 'MehendiBooking — Artist Booking Marketplace',
    },
    accentColor: '#D4FF4F',
  },
  {
    id: 3,
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
    id: 4,
    title: 'Design Guild Awards',
    subtitle: 'Architecture & Interior Design Awards',
    description:
      'India\'s premier architecture and interior design awards platform. Multi-section submission system covering applicant details, project overview, category selection, design philosophy, media uploads, and Razorpay payment integration.',
    role: 'Built the full multi-step submission system and jury showcase with integrated Razorpay payments.',
    stack: ['Next.js', 'React', 'Razorpay'],
    liveUrl: 'https://www.thedesignguildawards.com/',
    media: {
      type: 'image',
      src: '/images/projects/thedesignguild.png',
      alt: 'The Design Guild Awards Platform',
    },
    accentColor: '#D4FF4F',
  },
  {
    id: 5,
    title: 'Bellavita Smart Home',
    subtitle: 'Home Automation Brand Website',
    description:
      'Marketing and lead-generation site for a home-automation company with 6500+ projects since 2018. Multi-step lead capture, solutions showcase (lighting, security, curtains, climate), and device-compatibility grid (Alexa, Google Home, HomeKit, Matter).',
    role: 'Developed the full marketing site, multi-step lead form, and interactive solutions showcase.',
    stack: ['Next.js', 'React'],
    liveUrl: 'https://www.bellavitasmarthome.com/',
    media: {
      type: 'image',
      src: '/images/projects/bellavita.png',
      alt: 'Bellavita Smart Home Website',
    },
    accentColor: '#FF5C39',
  },
  {
    id: 6,
    title: 'INKA Media Solutions',
    subtitle: 'Digital Marketing Agency Website',
    description:
      'Conversion-focused agency website with live animated metrics (ROAS, lead growth, ad spend), service pages (SEO, Performance Marketing, Google/Meta Ads, Lead Gen, Brand Strategy), case studies, and a multi-step consultation form.',
    role: 'Architected and built the full site — animated metric counters, service pages, case study layouts, and consultation flow.',
    stack: ['Next.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://inkamediasolutions.com/',
    media: {
      type: 'image',
      src: '/images/projects/inka.png',
      alt: 'INKA Media Solutions Website',
    },
    accentColor: '#D4FF4F',
  },
  {
    id: 7,
    title: 'BLP Interior',
    subtitle: 'Luxury Furniture & Interior Studio',
    description:
      'Portfolio site for a luxury hospitality furniture/décor studio with projects across Four Seasons, Hyatt, and Meliá properties in Tanzania and Ethiopia. Editorial project showcase with full-bleed imagery, testimonials, and downloadable catalogue.',
    role: 'Led frontend development — editorial project showcase, full-bleed imagery system, and testimonial section.',
    stack: ['Next.js', 'React'],
    liveUrl: 'https://blpinterior.vercel.app/',
    media: {
      type: 'image',
      src: '/images/projects/BLP.png',
      alt: 'BLP Interior — Luxury Studio',
    },
    accentColor: '#FF5C39',
  },
]

export default projects
