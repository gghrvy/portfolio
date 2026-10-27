import { About } from '@/components/sections/About'
import { Contact, Footer } from '@/components/sections/Contact'
import { ScrollTrace } from '@/components/motion/ScrollTrace'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { Skills } from '@/components/sections/Skills'
import { Timeline } from '@/components/sections/Timeline'
import { Work } from '@/components/sections/Work'

export default function Home() {
  return (
    <>
      <Header />
      <ScrollTrace />
      <main>
        <Hero />
        <Work />
        <About />
        <Skills />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
