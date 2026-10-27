'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getLenis } from '@/lib/scroll'

// Appears after ~1.5 screens of scrolling; returns focus to the top of the page for keyboard users.
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { setVisible(window.scrollY > window.innerHeight * 1.5); ticking = false })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: reduced })
    else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    document.querySelector<HTMLElement>('.wordmark')?.focus({ preventScroll: true })
  }

  return (
    <button type="button" className="back-to-top" data-visible={visible} onClick={toTop} aria-label="Back to top" tabIndex={visible ? 0 : -1} aria-hidden={!visible}>
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  )
}
