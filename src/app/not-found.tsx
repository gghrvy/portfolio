import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Monogram } from '@/components/Monogram'
import { ThemeToggle } from '@/components/ThemeToggle'

export const metadata: Metadata = { title: 'Route not found | Harvy Monte de Ramos', robots: { index: false } }

// The same elbow-graph motif as the hero, with one route that never arrives.
function BrokenRoute() {
  return (
    <svg className="nf-graph" viewBox="0 0 480 220" aria-hidden="true">
      <path d="M20 40H170V120M170 120H330V60M170 120V190H300" className="nf-line" />
      <path d="M330 60H400" className="nf-line nf-line-hot" />
      <path d="M400 60H460" className="nf-line nf-line-broken" />
      {[[20, 40], [170, 120], [330, 60], [300, 190], [400, 60]].map(([x, y]) => <rect key={`${x}-${y}`} x={x - 6} y={y - 6} width="12" height="12" transform={`rotate(45 ${x} ${y})`} className="nf-node" />)}
      <rect x="454" y="54" width="12" height="12" transform="rotate(45 460 60)" className="nf-node nf-node-missing" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <>
      <header className="site-header">
        <div className="wrap site-header-inner">
          <a className="wordmark" href="/" aria-label="Harvy Monte de Ramos home"><Monogram /></a>
          <div className="header-actions"><ThemeToggle /></div>
        </div>
      </header>
      <main id="main" className="not-found" tabIndex={-1}>
        <div className="wrap nf-grid">
          <p className="node-label"><span>[404]</span> / Route not found</p>
          <h1>This route isn’t in the graph.</h1>
          <p className="nf-body">The page you’re looking for doesn’t exist or has moved. Everything else is one hop away.</p>
          <div className="nf-actions">
            <a className="button button-primary" href="/"><ArrowLeft size={16} aria-hidden="true" /> Back to home</a>
            <a className="button button-ghost" href="/#work">View selected work <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <BrokenRoute />
        </div>
      </main>
    </>
  )
}
