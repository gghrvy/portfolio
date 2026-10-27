'use client'

import { useEffect, useState } from 'react'

const built = [
  { term: 'Stack', detail: 'Next.js 16 · React 19 · TypeScript · Vercel' },
  { term: 'Type', detail: 'Clash Grotesk · IBM Plex Sans · IBM Plex Mono' },
  { term: 'Shortcut', detail: '⌘K / Ctrl K opens a command palette for every section and action' },
  { term: 'Motion', detail: 'CSS scroll-driven animations · View Transitions · Framer Motion · Lenis · Canvas 2D · React Three Fiber' },
]

// Live notes read the same signals the site reacts to.
export function Colophon() {
  const [theme, setTheme] = useState('system')
  const [reduced, setReduced] = useState<boolean | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const readTheme = () => setTheme(root.dataset.themeSource === 'manual' ? `${root.dataset.theme} (manual)` : `system (${root.dataset.theme})`)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const readMotion = () => setReduced(motion.matches)
    readTheme()
    readMotion()
    window.addEventListener('themechange', readTheme)
    motion.addEventListener('change', readMotion)
    return () => { window.removeEventListener('themechange', readTheme); motion.removeEventListener('change', readMotion) }
  }, [])

  return (
    <dl className="colophon" aria-label="Colophon">
      {built.map((item) => <div key={item.term}><dt>{item.term}</dt><dd>{item.detail}</dd></div>)}
      <div>
        <dt>Live</dt>
        <dd>
          <span>Theme: {theme}</span>
          <span>Reduced motion: respected{reduced === null ? '' : reduced ? ' (on, animations calmed)' : ' (off on this device)'}</span>
        </dd>
      </div>
    </dl>
  )
}
