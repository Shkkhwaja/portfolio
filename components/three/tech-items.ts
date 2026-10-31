/**
 * The collectible technologies in the profile scene's mini-game.
 * Descriptions only describe what each technology is (plus where the portfolio itself shows real usage);
 * edit this list to change what the game shows.
 */
export type TechItem = {
  id: string
  name: string
  abbr: string
  color: string
  desc: string
}

export const TECH_ITEMS: TechItem[] = [
  { id: 'react', name: 'React', abbr: 'R', color: '#61DAFB', desc: 'The UI library behind most of the interfaces on this site — components, state and fast rendering.' },
  { id: 'next', name: 'Next.js', abbr: 'Nx', color: '#F5F0E6', desc: 'The full-stack React framework this portfolio is built with — App Router, SSR and SEO-friendly pages.' },
  { id: 'node', name: 'Node.js', abbr: 'No', color: '#7CC95A', desc: 'JavaScript runtime used for backends and REST APIs, alongside Express.' },
  { id: 'ts', name: 'TypeScript', abbr: 'TS', color: '#4C8DDB', desc: 'Typed JavaScript that makes larger codebases safer and easier to maintain.' },
  { id: 'python', name: 'Python', abbr: 'Py', color: '#FFD43B', desc: 'A versatile language for scripting, automation and backend work.' },
  { id: 'django', name: 'Django', abbr: 'Dj', color: '#44B78B', desc: 'A batteries-included Python web framework for building data-driven apps quickly.' },
  { id: 'flutter', name: 'Flutter', abbr: 'Fl', color: '#54C5F8', desc: 'A cross-platform toolkit for building mobile apps from a single codebase.' },
  { id: 'ai', name: 'AI / ML', abbr: 'AI', color: '#FF5C39', desc: 'Machine learning and AI — including AI-assisted development with tools like Claude Code and Codex.' },
]
