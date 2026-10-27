'use client'

import { useEffect } from 'react'
import { Cursor } from '@/components/motion/Cursor'
import { whenIdle, whenIntent } from '@/lib/idle'
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
        const menuOpen = header.querySelector('.mobile-menu-panel[data-open="true"]')
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
    let current: Element | null = null
    const spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.target === current) continue
        current = entry.target
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

// Packets travel down the filled part of the margin trace to its head (wide screens only).
function useTracePackets() {
  useEffect(() => {
    const trace = document.querySelector<HTMLElement>('.scroll-trace')
    const wide = window.matchMedia('(min-width: 1440px)')
    if (!trace || prefersReduced()) return
    const packets = [...trace.querySelectorAll<HTMLElement>('.scroll-trace-packet')]
    const head = trace.querySelector<HTMLElement>('.scroll-trace-head')
    const state = packets.map((_, i) => ({ y: -i * 90, speed: 150 + i * 35 }))
    let frame = 0
    let last = 0
    let height = 0
    let max = 1

    const measure = () => { height = trace.clientHeight; max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight) }
    const tick = (time: number) => {
      const dt = Math.min((time - (last || time)) / 1000, 0.1)
      last = time
      const reach = (window.scrollY / max) * height
      if (head) head.style.transform = `translateY(${reach.toFixed(1)}px)`
      packets.forEach((packet, i) => {
        const p = state[i]
        p.y += p.speed * dt
        if (p.y >= reach) {
          p.y = -40 - i * 60
        }
        packet.style.opacity = reach > 24 && p.y > 0 ? '1' : '0'
        packet.style.transform = `translateY(${Math.max(p.y, 0).toFixed(1)}px)`
      })
      frame = requestAnimationFrame(tick)
    }
    const start = () => { if (!frame && wide.matches && !document.hidden) { measure(); last = 0; frame = requestAnimationFrame(tick) } }
    const stop = () => { cancelAnimationFrame(frame); frame = 0 }
    const sync = () => { stop(); start() }

    const cancel = whenIdle(start)
    window.addEventListener('resize', measure)
    wide.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => { cancel(); stop(); window.removeEventListener('resize', measure); wide.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync) }
  }, [])
}

// Timeline nodes light once their top crosses 60% of the viewport, and unlight when scrolled back above it.
function useTimelineNodes() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.tl-item')
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-lit', entry.boundingClientRect.top < window.innerHeight * 0.6)
    }, { rootMargin: '0px 0px -40% 0px' })
    items.forEach((item) => io.observe(item))
    return () => io.disconnect()
  }, [])
}

// Lenis for fine pointers on first intent. GSAP only scrubs the timeline rail where CSS view timelines are missing.
function useScrollSystems() {
  useEffect(() => {
    if (prefersReduced()) return
    const smooth = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const railFallback = !CSS.supports('animation-timeline: view()')
    if (!smooth && !railFallback) return
    let cancelled = false
    let cleanup = () => {}

    const cancelIntent = whenIntent(async () => {
      const lenis = smooth ? new (await import('lenis')).default({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.12 }) : null
      if (cancelled) { lenis?.destroy(); return }
      setLenis(lenis)
      if (!railFallback) { cleanup = () => { lenis?.destroy(); setLenis(null) }; return }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      if (cancelled) { lenis?.destroy(); return }
      gsap.registerPlugin(ScrollTrigger)
      lenis?.on('scroll', ScrollTrigger.update)
      const context = gsap.context(() => {
        const track = document.querySelector<HTMLElement>('.tl-track')
        const fill = track?.querySelector('.tl-rail i')
        if (track && fill) gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: true } })
      })
      cleanup = () => { context.revert(); lenis?.destroy(); setLenis(null) }
    }, railFallback ? 4000 : undefined)

    return () => { cancelled = true; cancelIntent(); cleanup() }
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
  useTimelineNodes()
  useTracePackets()
  useScrollSystems()
  useMagnetic()
  return <>{children}<Cursor /></>
}
