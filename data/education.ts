export type Education = {
  id: number
  degree: string
  institution: string
  location: string
  period: string
  grade?: string
  stream?: string
  honours?: string[]
}

const education: Education[] = [
  {
    id: 1,
    degree: 'BCA (Bachelor of Computer Applications)',
    institution: 'Tilak Maharashtra Vidyapeeth',
    location: 'Navi Mumbai',
    period: 'May 2022 — Jun 2025',
    grade: 'CGPA: 8.30 / 10',
    honours: [
      '🏆 Department Topper',
      '🥇 Winner — Tech Shaastra Hackathon 2024 & 2025',
    ],
  },
  {
    id: 2,
    degree: 'HSC — Higher Secondary Certificate',
    institution: 'Akbar Peerbhoy College of Commerce & Economics',
    location: 'Mumbai',
    period: '2020 — 2022',
    stream: 'Commerce Stream',
  },
  {
    id: 3,
    degree: 'SSC — Secondary School Certificate',
    institution: 'OLGC English High School',
    location: 'Mumbai',
    period: '2020',
  },
]

export default education
