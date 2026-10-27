import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

export function NodeLabel({ index, children }: { index: string; children: ReactNode }) {
  return <p className="node-label" data-node={index}><span>[{index}]</span> / {children}</p>
}

export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const external = href.startsWith('http') || href.endsWith('.pdf')
  return (
    <a className={`link ${className}`} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      <span className="link-text">{children}</span>
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  )
}

export function Chips({ items, label }: { items: string[]; label: string }) {
  return <ul className="chips" aria-label={label}>{items.map((item) => <li key={item}>{item}</li>)}</ul>
}
