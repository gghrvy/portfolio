import { ArrowUpRight } from 'lucide-react'
import { MobileMenu } from '@/components/MobileMenu'
import { Monogram } from '@/components/Monogram'
import { contact } from '@/content/profile'

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
] as const

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <a className="wordmark" href="#top" aria-label="Harvy Monte de Ramos home"><Monogram /></a>
        <nav className="site-nav" aria-label="Primary navigation">
          {navLinks.map((link, index) => (
            <a key={link.href} href={link.href} data-section={link.href.slice(1)}>
              <span aria-hidden="true">0{index + 1}</span>{link.label}
            </a>
          ))}
        </nav>
        <a className="header-resume" href={contact.resume} target="_blank" rel="noreferrer">Resume <ArrowUpRight size={14} aria-hidden="true" /></a>
        <MobileMenu links={navLinks} />
      </div>
    </header>
  )
}
