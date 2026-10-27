import { ArrowDown, ArrowUpRight, Download } from 'lucide-react'
import { HeroField } from '@/components/hero/HeroField'
import { LocalTime } from '@/components/LocalTime'
import { availability, contact, hero } from '@/content/profile'

const order = (i: number) => ({ '--i': i }) as React.CSSProperties

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-name">
      <HeroField />
      <div className="wrap hero-inner">
        <p className="hero-role" data-reveal="hero" style={order(-3)}>{hero.role}</p>
        <h1 className="hero-name" id="hero-name">
          {hero.name.map((line, i) => <span className="mask-line" key={line}><span style={order(i)}>{line}</span></span>)}
        </h1>
        <div className="hero-grid">
          <p className="hero-statement" data-reveal="hero" style={order(0)}>{hero.statement}</p>
          <div className="hero-detail" data-reveal="hero" style={order(1)}>
            <p className="hero-lede">{hero.lede}</p>
            <ul className="hero-caps" aria-label="Focus areas">{hero.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className="hero-foot" data-reveal="hero" style={order(2)}>
          <div className="hero-actions">
            <a className="button button-primary" href="#work" data-magnetic>View selected work <ArrowDown size={16} aria-hidden="true" /></a>
            <div className="button-split">
              <a className="button button-ghost" href={contact.resume} target="_blank" rel="noreferrer">Resume <ArrowUpRight size={16} aria-hidden="true" /><span className="visually-hidden"> (PDF, opens in a new tab)</span></a>
              <a className="button button-ghost button-icon" href={contact.resume} download="Harvy-Monte-de-Ramos-Resume.pdf" aria-label="Download resume (PDF)"><Download size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <dl className="hero-status">
            <div className="hero-status-live"><dt className="visually-hidden">Availability</dt><dd><span className="status-dot" aria-hidden="true" />{availability.status}</dd></div>
            <div><dt>Based in</dt><dd>{hero.location}</dd></div>
            <div><dt>Local time</dt><dd>{hero.timezone} · <LocalTime timeZone={hero.timeZoneId} /></dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}
