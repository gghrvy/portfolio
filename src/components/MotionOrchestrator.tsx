'use client'

import { useEffect } from 'react'

function useHeaderBehaviour() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header) return

    let lastY = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const menuOpen = header.querySelector('.mobile-menu-panel:not([hidden])')
        const hide = y > 160 && y > lastY + 4 && !menuOpen && !header.contains(document.activeElement)
        if (hide) header.dataset.hidden = 'true'
        else if (y < lastY - 4 || y <= 160) header.dataset.hidden = 'false'
        lastY = y
        ticking = false
      })
    }

    const links = [...document.querySelectorAll<HTMLAnchorElement>('.site-nav a, .mobile-menu-panel nav a')]
    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.getAttribute('href') ?? ''))
      .filter((section, index, all): section is HTMLElement => !!section && all.indexOf(section) === index)
    const spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const hash = `#${entry.target.id}`
        for (const link of links) {
          if (link.getAttribute('href') === hash) link.setAttribute('aria-current', 'location')
          else link.removeAttribute('aria-current')
        }
        document.documentElement.dataset.section = entry.target.id
      }
    }, { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach((section) => spy.observe(section))

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); spy.disconnect() }
  }, [])
}

declare global { interface Window { __motionReady?: boolean } }

// Marks [data-observe] elements once they enter; each section's CSS decides what that reveal looks like.
function useRevealObserver() {
  useEffect(() => {
    window.__motionReady = true
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        ;(entry.target as HTMLElement).dataset.inview = 'true'
        io.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -12% 0px' })
    document.querySelectorAll('[data-observe]').forEach((element) => io.observe(element))
    return () => io.disconnect()
  }, [])
}

export function MotionOrchestrator({ children }: { children: React.ReactNode }) {
  useRevealObserver()
  useHeaderBehaviour()
  return children
}
