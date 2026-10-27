'use client'

import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { lockScroll, unlockScroll } from '@/lib/scroll'

type Link = { readonly label: string; readonly href: string }

export function MobileMenu({ links }: { links: readonly Link[] }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    lockScroll()
    root.current?.querySelector<HTMLElement>('.mobile-menu-panel a')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); return }
      if (event.key !== 'Tab' || !root.current) return
      const focusable = [...root.current.querySelectorAll<HTMLElement>('button, a')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    const onResize = () => { if (window.innerWidth > 860) setOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      unlockScroll()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <div className="mobile-menu" ref={root}>
      <button ref={trigger} className="mobile-menu-trigger" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation">
        {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        <span>{open ? 'Close' : 'Menu'}</span>
      </button>
      <div className="mobile-menu-panel" id="mobile-navigation" data-open={open} inert={!open}>
        <nav aria-label="Mobile navigation">
          {links.map((link, index) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)} style={{ '--i': index } as React.CSSProperties}>
              <span aria-hidden="true">0{index + 1}</span>{link.label}
            </a>
          ))}
        </nav>
        <a className="mobile-menu-resume" href="/cv.pdf" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Resume <ArrowUpRight size={14} aria-hidden="true" /><span className="visually-hidden"> (PDF, opens in a new tab)</span></a>
      </div>
    </div>
  )
}
