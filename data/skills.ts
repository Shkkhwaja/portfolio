export type SkillCategory = {
  category: string
  icon: string
  skills: Skill[]
}

export type Skill = {
  name: string
  icon: string // react-icons component name, e.g. 'SiReact'
  color: string
}

const skills: SkillCategory[] = [
  {
    category: 'Languages',
    icon: 'code',
    skills: [
      { name: 'JavaScript', icon: 'SiJavascript', color: '#F7DF1E' },
      { name: 'TypeScript', icon: 'SiTypescript', color: '#3178C6' },
      { name: 'Java', icon: 'FaJava', color: '#ED8B00' },
      { name: 'HTML5', icon: 'SiHtml5', color: '#E34F26' },
      { name: 'CSS3', icon: 'SiCss3', color: '#1572B6' },
    ],
  },
  {
    category: 'Frontend',
    icon: 'monitor',
    skills: [
      { name: 'React.js', icon: 'SiReact', color: '#61DAFB' },
      { name: 'Next.js', icon: 'SiNextdotjs', color: '#FFFFFF' },
      { name: 'Tailwind CSS', icon: 'SiTailwindcss', color: '#06B6D4' },
      { name: 'Ant Design', icon: 'SiAntdesign', color: '#0170FE' },
      { name: 'GSAP', icon: 'SiGreensock', color: '#88CE02' },
    ],
  },
  {
    category: 'Backend',
    icon: 'server',
    skills: [
      { name: 'Node.js', icon: 'SiNodedotjs', color: '#339933' },
      { name: 'Express.js', icon: 'SiExpress', color: '#FFFFFF' },
      { name: 'Spring Boot', icon: 'SiSpringboot', color: '#6DB33F' },
    ],
  },
  {
    category: 'Databases',
    icon: 'database',
    skills: [
      { name: 'MongoDB', icon: 'SiMongodb', color: '#47A248' },
      { name: 'PostgreSQL', icon: 'SiPostgresql', color: '#336791' },
      { name: 'MySQL', icon: 'SiMysql', color: '#4479A1' },
      { name: 'Oracle SQL', icon: 'SiOracle', color: '#F80000' },
    ],
  },
  {
    category: 'APIs & Auth',
    icon: 'lock',
    skills: [
      { name: 'REST APIs', icon: 'TbApi', color: '#FF5C39' },
      { name: 'JWT Auth', icon: 'SiJsonwebtokens', color: '#D63AFF' },
    ],
  },
  {
    category: 'Tools & Platforms',
    icon: 'tool',
    skills: [
      { name: 'Git', icon: 'SiGit', color: '#F05032' },
      { name: 'GitHub', icon: 'SiGithub', color: '#FFFFFF' },
      { name: 'Vercel', icon: 'SiVercel', color: '#FFFFFF' },
      { name: 'Cloudflare', icon: 'SiCloudflare', color: '#F6821F' },
    ],
  },
]

/* Flat list used for the marquee strip */
export const allSkills: Skill[] = skills.flatMap((cat) => cat.skills)

export default skills
