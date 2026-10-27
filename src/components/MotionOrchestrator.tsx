'use client'

import { useEffect } from 'react'
import { Cursor } from '@/components/motion/Cursor'
import { setLenis } from '@/lib/scroll'

declare global { interface Window { __motionReady?: boolean } }

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
        document.querySelectorAll(`.scroll-trace [data-node]`).forEach((node) => {
          const element = node as HTMLElement
          element.dataset.lit = String(sections.findIndex((s) => s.id === element.dataset.node) <= sections.indexOf(entry.target as HTMLElement))
        })
      }
    }, { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach((section) => spy.observe(section))

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); spy.disconnect() }
  }, [])
}

// Lenis smooth scroll (fine pointers only) and the GSAP-scrubbed timeline rail. Loaded after hydration.
function useScrollSystems() {
  useEffect(() => {
    if (prefersReduced()) return
    let cancelled = false
    let cleanup = () => {}

    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]).then(([{ gsap }, { ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const smooth = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      const lenis = smooth ? new Lenis({ autoRaf: false, anchors: { offset: -72 }, lerp: 0.12 }) : null
      const raf = (time: number) => lenis?.raf(time * 1000)
      if (lenis) {
        setLenis(lenis)
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)
      }

      const context = gsap.context(() => {
        const track = document.querySelector<HTMLElement>('.tl-track')
        const fill = track?.querySelector('.tl-rail i')
        if (!track || !fill) return
        gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: true } })
        track.querySelectorAll<HTMLElement>('.tl-item').forEach((item) => {
          ScrollTrigger.create({ trigger: item, start: 'top 60%', onEnter: () => item.classList.add('is-lit'), onLeaveBack: () => item.classList.remove('is-lit') })
        })
      })

      cleanup = () => {
        context.revert()
        gsap.ticker.remove(raf)
        lenis?.destroy()
        setLenis(null)
      }
    })

    return () => { cancelled = true; cleanup() }
  }, [])
}

// [data-magnetic] elements lean toward the pointer (max 6px), transform only.
function useMagnetic() {
  useEffect(() => {
    if (prefersReduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const elements = [...document.querySelectorAll<HTMLElement>('[data-magnetic]')]
    const handlers = elements.map((element) => {
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12
        element.style.transition = 'transform var(--d-fast) var(--ease-signal)'
        element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      }
      const leave = () => {
        element.style.transition = 'transform var(--d-slow) var(--ease-route)'
        element.style.transform = ''
      }
      element.addEventListener('pointermove', move)
      element.addEventListener('pointerleave', leave)
      return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave) }
    })
    return () => handlers.forEach((remove) => remove())
  }, [])
}

export function MotionOrchestrator({ children }: { children: React.ReactNode }) {
  useRevealObserver()
  useHeaderBehaviour()
  useScrollSystems()
  useMagnetic()
  return <>{children}<Cursor /></>
}
