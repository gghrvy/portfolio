'use client'

import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MotionOrchestrator({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      const heroContent = gsap.utils.toArray<HTMLElement>('.hero-copy > *')
      const opportunityPanel = document.querySelector<HTMLElement>('.opportunity-panel')
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (heroContent.length) intro.from(heroContent, { y: 20, opacity: 0, duration: 0.68, stagger: 0.07, delay: 0.06 })
      if (opportunityPanel) intro.from(opportunityPanel, { x: 20, opacity: 0, duration: 0.68 }, '<0.2')

      gsap.utils.toArray<HTMLElement>('.project, .capability, .experience, .about-layout').forEach((element) => {
        gsap.from(element, { y: 32, opacity: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 83%', once: true } })
      })
    })
    return () => context.revert()
  }, [])
  return children
}
