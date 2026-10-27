import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { TextLink } from '@/components/ui'
import { availability, contact, hero } from '@/content/profile'

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <div className="hero-field" aria-hidden="true" />
      <div className="wrap hero-inner">
        <p className="hero-role" data-reveal="hero">{hero.role}</p>
        <h1 className="hero-name" id="hero-name">
          {hero.name.map((line) => <span className="mask-line" key={line}><span>{line}</span></span>)}
        </h1>
        <div className="hero-grid">
          <p className="hero-statement" data-reveal="hero">{hero.statement}</p>
          <div className="hero-detail" data-reveal="hero">
            <p className="hero-lede">{hero.lede}</p>
            <ul className="hero-caps" aria-label="Focus areas">{hero.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className="hero-foot" data-reveal="hero">
          <div className="hero-actions">
            <a className="button button-primary" href="#work">View selected work <ArrowDown size={16} aria-hidden="true" /></a>
            <a className="button button-ghost" href={`mailto:${contact.email}`}>Contact me <ArrowUpRight size={16} aria-hidden="true" /></a>
            <TextLink href={contact.resume}>View resume</TextLink>
          </div>
          <p className="status-chip"><span className="status-dot" aria-hidden="true" />{availability.status} · {hero.location}</p>
        </div>
      </div>
    </section>
  )
}
