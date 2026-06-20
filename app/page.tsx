import Navbar from '@/components/ui/Navbar'
import LoadingScreen from '@/components/ui/LoadingScreen'
import ScrollingMascot from '@/components/ui/ScrollingMascot'
import Hero from '@/components/sections/Hero'
import ProfileSection from '@/components/sections/ProfileSection'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Education from '@/components/sections/Education'
import Certifications from '@/components/sections/Certifications'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'
import StructuredData from '@/components/seo/StructuredData'
import ConsoleBranding from '@/components/ui/ConsoleBranding'

export default function Home() {
  return (
    <>
      {/* JSON-LD structured data — parsed by Google, Bing, AI crawlers */}
      <StructuredData />
      <ConsoleBranding />

      <LoadingScreen />
      <Navbar />
      <ScrollingMascot />
      <main>
        <Hero />
        <ProfileSection />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
