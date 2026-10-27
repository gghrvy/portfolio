import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { NodeLabel } from '@/components/ui'
import { about, contact, hero } from '@/content/profile'
import { education } from '@/content/timeline'

const facts = [
  { term: 'Based in', detail: hero.location },
  { term: 'Focus', detail: education.body[0] },
  { term: 'Education', detail: `${education.title}, ${education.date}` },
]

export function About() {
  const [first, second] = about.paragraphs
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap about-grid" data-observe>
        <NodeLabel index="02">About</NodeLabel>
        <figure className="about-portrait">
          <Image src="/harvy-profile.jpg" alt="Harvy H. Monte de Ramos" fill sizes="(max-width: 900px) 100vw, 30vw" />
        </figure>
        <div className="about-copy">
          <h2 id="about-title">{about.name}</h2>
          <p>{first}</p>
          <blockquote className="pull-quote"><p>…{about.quote}</p></blockquote>
          <p>{second}</p>
          <a className="button button-ghost" href={`mailto:${contact.email}`}>Start a conversation <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <dl className="about-facts">
          {facts.map((fact) => <div key={fact.term}><dt>{fact.term}</dt><dd>{fact.detail}</dd></div>)}
        </dl>
      </div>
    </section>
  )
}
