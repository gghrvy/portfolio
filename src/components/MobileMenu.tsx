'use client'

import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Link = { readonly label: string; readonly href: string }

export function MobileMenu({ links }: { links: readonly Link[] }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="mobile-menu">
      <button ref={trigger} className="mobile-menu-trigger" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation">
        {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        <span>{open ? 'Close' : 'Menu'}</span>
      </button>
      <div className="mobile-menu-panel" id="mobile-navigation" data-open={open}>
        <nav aria-label="Mobile navigation">
          {links.map((link, index) => (
            <a href={link.href} key={link.href} onClick={() => setOpen(false)}>
              <span aria-hidden="true">0{index + 1}</span>{link.label}
            </a>
          ))}
        </nav>
        <a className="mobile-menu-resume" href="/cv.pdf" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Resume <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>
    </div>
  )
}
