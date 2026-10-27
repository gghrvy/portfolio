import { navLinks } from '@/components/sections/Header'

// Fixed margin trace on wide screens. Fill is a native scroll-driven animation; nodes light via the section spy.
export function ScrollTrace() {
  return (
    <div className="scroll-trace" aria-hidden="true">
      <span className="scroll-trace-fill" />
      {navLinks.map((link, index) => (
        <span key={link.href} className="scroll-trace-node" data-node={link.href.slice(1)} data-lit="false" style={{ '--p': `${((index + 1) / (navLinks.length + 1)) * 100}%` } as React.CSSProperties}>
          <i>0{index + 1}</i>
        </span>
      ))}
    </div>
  )
}
