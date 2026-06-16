'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'

const ZONE_LABELS: Partial<Record<string, string>> = {
  about:    'ABOUT',
  skills:   'SKILLS',
  projects: 'FILMS',
  contact:  'CONTACT',
}

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const hoveredZone = useTheaterStore(s => s.hoveredZone)

  // Mouse tracking + DOM interactive detection
  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) {
      dot.style.display  = 'none'
      ring.style.display = 'none'
      return
    }

    const moveDot   = gsap.quickTo(dot,  'x', { duration: 0.1, ease: 'power3' })
    const moveDotY  = gsap.quickTo(dot,  'y', { duration: 0.1, ease: 'power3' })
    const moveRing  = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })

    const onMove = (e: MouseEvent) => {
      moveDot(e.clientX);  moveDotY(e.clientY)
      moveRing(e.clientX); moveRingY(e.clientY)
    }

    const onDomEnter = () => {
      gsap.to(dot,  { scale: 0, duration: 0.2 })
      gsap.to(ring, { scale: 2.2, borderColor: '#4f8ef7', backgroundColor: 'rgba(79,142,247,0.08)', duration: 0.3 })
    }

    const onDomLeave = () => {
      gsap.to(dot,  { scale: 1, duration: 0.2 })
      gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'transparent', duration: 0.3 })
    }

    const onClick = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
    }

    let domHovered = false
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      const isInteractive = target.closest('button, a, [data-cursor-hover], input, textarea, [role="button"]')
      if (isInteractive && !domHovered) { domHovered = true;  onDomEnter() }
      else if (!isInteractive && domHovered) { domHovered = false; onDomLeave() }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    document.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      document.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  // React to 3D zone hover
  useEffect(() => {
    const ring  = ringRef.current
    const label = labelRef.current
    if (!ring || !label) return

    let pulse: gsap.core.Tween | null = null

    if (hoveredZone) {
      label.textContent = ZONE_LABELS[hoveredZone] ?? ''
      gsap.to(ring,  { width: 64, height: 64, duration: 0.25, ease: 'power2.out' })
      gsap.to(label, { opacity: 1, duration: 0.15, delay: 0.15 })
      // Soft breathing pulse while hovering
      pulse = gsap.to(ring, {
        width: 70, height: 70, duration: 0.8, delay: 0.3,
        yoyo: true, repeat: -1, ease: 'sine.inOut',
      })
    } else {
      gsap.to(ring,  { width: 36, height: 36, duration: 0.2, ease: 'power2.in' })
      gsap.to(label, { opacity: 0, duration: 0.1 })
    }

    return () => { pulse?.kill() }
  }, [hoveredZone])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6,
          backgroundColor: '#ffffff', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 36, height: 36,
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'transparent',
          willChange: 'transform',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 7, letterSpacing: '0.12em',
            color: '#fff', opacity: 0,
            whiteSpace: 'nowrap', pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </div>
    </>
  )
}
