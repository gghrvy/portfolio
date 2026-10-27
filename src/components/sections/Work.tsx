import { ArrowDown } from 'lucide-react'
import { AriaPresence } from '@/components/AriaPresence'
import { NodeLabel, TextLink } from '@/components/ui'
import { CaseStudy } from '@/components/work/CaseStudy'
import { Pipeline } from '@/components/work/Pipeline'
import { contact } from '@/content/profile'
import { aria, projects, workIntro } from '@/content/projects'

const index = [...projects.map((project) => ({ id: project.id, index: project.index, name: project.name, kicker: project.kicker })), { id: 'aria', index: '04', name: 'Aria', kicker: aria.label }]

export function Work() {
  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="wrap work-head">
        <NodeLabel index="01">Selected work</NodeLabel>
        <div>
          <h2 id="work-title">{workIntro.heading}</h2>
          <p>{workIntro.body}</p>
          <TextLink href={`mailto:${contact.email}`}>{workIntro.demo}</TextLink>
        </div>
        <ol className="work-index" aria-label="Projects">
          {index.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>
                <span className="work-index-num">{item.index}</span>
                <span className="work-index-name">{item.name}</span>
                <span className="work-index-kicker">{item.kicker}</span>
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>

      {projects.map((project, i) => <CaseStudy key={project.id} project={project} flip={i % 2 === 1} priority={false} />)}

      <article className="aria" id="aria" aria-labelledby="aria-title">
        <div className="wrap aria-grid">
          <div className="aria-copy">
            <p className="case-kicker"><span className="case-index-inline">04</span> {aria.label}</p>
            <h3 id="aria-title">{aria.heading}</h3>
            <p className="aria-sub">{aria.title}</p>
            <p className="aria-body">{aria.body}</p>
            <dl className="aria-traits">
              {aria.traits.map((trait) => <div key={trait.term}><dt>{trait.term}</dt><dd>{trait.detail}</dd></div>)}
            </dl>
            <Pipeline steps={aria.flow} label="Aria architecture" />
            <p className="aria-footnote">{aria.footnote}</p>
          </div>
          <div className="aria-visual">
            <AriaPresence />
            <ol className="aria-example" aria-label="Example Aria interaction">
              {aria.example.map((step) => <li key={step.label}><span>{step.label}</span><strong>{step.text}</strong></li>)}
            </ol>
          </div>
        </div>
      </article>
    </section>
  )
}
