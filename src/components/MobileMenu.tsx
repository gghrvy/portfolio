'use client'

import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

const links = [
  ['Work', '#work'],
  ['Aria', '#aria'],
  ['Experience', '#experience'],
  ['About', '#about'],
  ['Contact', '#contact'],
] as const

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  return <div className="mobile-menu">
    <button className="mobile-menu-trigger" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>
      {open ? <X size={19} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      <span>Menu</span>
    </button>
    {open && <div className="mobile-menu-panel" id="mobile-navigation">
      <nav aria-label="Mobile navigation">
        {links.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <a className="mobile-menu-resume" href="/cv.pdf" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Resume <ArrowUpRight size={14} aria-hidden="true" /></a>
    </div>}
  </div>
}
