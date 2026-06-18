export type Certification = {
  id: number
  title: string
  issuer: string
  date: string
  credentialId?: string
  url: string
  color: string
}

const certifications: Certification[] = [
  {
    id: 1,
    title: 'Full Stack Java Developer',
    issuer: 'ExcelR',
    date: 'October 2025',
    credentialId: '0525F1186 EXCELR ECAP 07102025',
    url: 'https://drive.google.com/file/d/1fnw0GydRUcCf-cBrBcCEdsT6CEd4FP2O/view',
    color: '#FF5C39',
  },
  {
    id: 2,
    title: 'Technology Job Simulation',
    issuer: 'Deloitte Australia (via Forage)',
    date: 'July 2025',
    credentialId: 'EWR3SXGGXAPPHB6i9',
    url: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_u6P9Xde7kPMvWepZR_1751368182488_completion_certificate.pdf',
    color: '#D4FF4F',
  },
  {
    id: 3,
    title: 'Data Visualisation Job Simulation',
    issuer: 'Tata Group (via Forage)',
    date: 'June 2024',
    credentialId: 'RCY8ivvw2ENZvHdwW',
    url: 'https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Tata/MyXvBcppsW2FkNYCX_Tata%20Group_ZfPJTNLLNXsSKRv6s_1719226646762_completion_certificate.pdf',
    color: '#FF5C39',
  },
  {
    id: 4,
    title: 'Introduction to JavaScript',
    issuer: 'Great Learning',
    date: 'January 2024',
    url: 'https://www.mygreatlearning.com/certificate/OZDIDTZO',
    color: '#D4FF4F',
  },
  {
    id: 5,
    title: 'Front-End Development — CSS',
    issuer: 'Great Learning',
    date: '2023',
    url: 'https://www.mygreatlearning.com/certificate/IUJWZYOT',
    color: '#FF5C39',
  },
  {
    id: 6,
    title: 'Front-End Development — HTML',
    issuer: 'Great Learning',
    date: 'July 2023',
    url: 'https://www.mygreatlearning.com/certificate/NZLTSAEZ',
    color: '#D4FF4F',
  },
]

export default certifications
