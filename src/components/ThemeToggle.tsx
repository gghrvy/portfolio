'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'
export type ThemeSource = 'system' | 'manual'

const themeColors: Record<Theme, string> = { dark: '#0c0e0d', light: '#f3eee4' }

export function applyTheme(theme: Theme, source: ThemeSource) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.dataset.themeSource = source
  if (source === 'manual') {
    try { localStorage.setItem('theme', theme) } catch { /* storage unavailable: choice lasts for this visit */ }
  }
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', themeColors[theme]))
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme, source } }))
}

export function ThemeToggle() {
  const button = useRef<HTMLButtonElement>(null)
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const root = document.documentElement
    setTheme(root.dataset.theme === 'light' ? 'light' : 'dark')
    const onTheme = (event: Event) => setTheme((event as CustomEvent<{ theme: Theme }>).detail.theme)
    const system = window.matchMedia('(prefers-color-scheme: light)')
    const onSystem = (event: MediaQueryListEvent) => { if (root.dataset.themeSource !== 'manual') applyTheme(event.matches ? 'light' : 'dark', 'system') }
    window.addEventListener('themechange', onTheme)
    system.addEventListener('change', onSystem)
    return () => { window.removeEventListener('themechange', onTheme); system.removeEventListener('change', onSystem) }
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next: Theme = root.dataset.theme === 'light' ? 'dark' : 'light'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { applyTheme(next, 'manual'); return }

    if (!document.startViewTransition) {
      root.classList.add('theme-fade')
      applyTheme(next, 'manual')
      window.setTimeout(() => root.classList.remove('theme-fade'), 320)
      return
    }

    const rect = button.current!.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    root.classList.add('theme-vt')
    const transition = document.startViewTransition(() => flushSync(() => applyTheme(next, 'manual')))
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 480, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    transition.finished.finally(() => root.classList.remove('theme-vt'))
  }

  return (
    <button ref={button} type="button" className="theme-toggle" onClick={toggle} aria-label="Dark theme" aria-pressed={theme === 'dark'}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <mask id="theme-moon-mask">
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-mask" cx="26" cy="4" r="6" fill="#000" />
        </mask>
        <circle className="theme-core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#theme-moon-mask)" />
        <g className="theme-rays" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
        </g>
      </svg>
    </button>
  )
}
