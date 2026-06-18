export type Experience = {
  id: number
  role: string
  company: string
  location: string
  period: string
  type: string
  bullets: string[]
  tags: string[]
  accentColor: string
}

const experience: Experience[] = [
  {
    id: 1,
    role: 'Full Stack Developer',
    company: 'ZAR Luxury Pvt. Ltd.',
    location: 'Mumbai, India',
    period: 'Dec 2025 — Present',
    type: 'Full-Time',
    bullets: [
      'Built and maintained production-grade web applications using React.js, Next.js, Node.js, and Express.js.',
      'Developed responsive and high-performance UIs using React.js, Next.js, Tailwind CSS, and GSAP.',
      'Built secure REST APIs and backend services with JWT-based authentication for robust access control.',
      'Managed MongoDB and PostgreSQL databases with a focus on scalability and query performance.',
      'Improved website performance via lazy loading, code splitting, caching strategies, and Cloudflare R2 integration.',
      'Contributed to SEO optimization and CI/CD deployment pipelines through Vercel.',
    ],
    tags: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'GSAP', 'MongoDB', 'PostgreSQL', 'JWT', 'Tailwind CSS', 'Cloudflare R2', 'Vercel'],
    accentColor: '#FF5C39',
  },
  {
    id: 2,
    role: 'Frontend Developer Intern',
    company: 'SK Children Foundation',
    location: 'Delhi (Remote)',
    period: 'Sep 2022 — May 2023',
    type: 'Internship · 9 months',
    bullets: [
      'Completed a 9-month internship progressing through three roles: Volunteer → Frontend Developer → Web Domain Mentor.',
      'Built and maintained the NGO\'s data form platform, increasing form submission efficiency by 40%.',
      'Developed responsive web pages using HTML, CSS, and JavaScript.',
      'Mentored junior volunteers on web development best practices.',
      'Received a Certificate of Appreciation for outstanding contributions.',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Mentoring'],
    accentColor: '#D4FF4F',
  },
]

export default experience
