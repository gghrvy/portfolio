import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { TextLink } from '@/components/ui'
import { HeroField } from '@/components/hero/HeroField'
import { availability, contact, hero } from '@/content/profile'

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <HeroField />
      <div className="wrap hero-inner">
        <p className="hero-role" data-reveal="hero" style={{ '--i': -3 } as React.CSSProperties}>{hero.role}</p>
        <h1 className="hero-name" id="hero-name">
          {hero.name.map((line, i) => <span className="mask-line" key={line}><span style={{ '--i': i } as React.CSSProperties}>{line}</span></span>)}
        </h1>
        <div className="hero-grid">
          <p className="hero-statement" data-reveal="hero" style={{ '--i': 0 } as React.CSSProperties}>{hero.statement}</p>
          <div className="hero-detail" data-reveal="hero" style={{ '--i': 1 } as React.CSSProperties}>
            <p className="hero-lede">{hero.lede}</p>
            <ul className="hero-caps" aria-label="Focus areas">{hero.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className="hero-foot" data-reveal="hero" style={{ '--i': 2 } as React.CSSProperties}>
          <div className="hero-actions">
            <a className="button button-primary" href="#work" data-magnetic>View selected work <ArrowDown size={16} aria-hidden="true" /></a>
            <a className="button button-ghost" href={`mailto:${contact.email}`}>Contact me <ArrowUpRight size={16} aria-hidden="true" /></a>
            <TextLink href={contact.resume}>View resume</TextLink>
          </div>
          <p className="status-chip"><span className="status-dot" aria-hidden="true" />{availability.status} · {hero.location}</p>
        </div>
      </div>
    </section>
  )
}
