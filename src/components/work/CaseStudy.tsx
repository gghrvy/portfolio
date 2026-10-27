import { ArrowUpRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { Chips } from '@/components/ui'
import { Gallery } from '@/components/work/Gallery'
import { Pipeline } from '@/components/work/Pipeline'
import { contact } from '@/content/profile'
import type { Project } from '@/content/projects'

export function CaseStudy({ project, flip }: { project: Project; flip: boolean }) {
  const titleId = `${project.id}-title`
  return (
    <article className="case" id={project.id} data-flip={flip} aria-labelledby={titleId}>
      <div className="wrap">
        <header className="case-head" data-observe>
          <span className="case-index" aria-hidden="true">{project.index}</span>
          <div className="case-title">
            <p className="case-kicker">{project.kicker}</p>
            <h3 id={titleId}>{project.name}</h3>
          </div>
          <div className="case-problem">
            <p className="case-label">Problem</p>
            <p>{project.summary}</p>
          </div>
        </header>

        <Pipeline steps={project.flow} label={`${project.name} pipeline`} />

        <div className="case-body">
          <Gallery id={project.id} shots={project.shots} tone={project.tone} name={project.name} />
          <div className="case-notes">
            <section className="case-note" aria-label="Approach">
              <p className="case-label">Approach <span>/ {project.approach.label}</span></p>
              <h4>{project.approach.heading}</h4>
              <p>{project.approach.body}</p>
              <dl className="facts">
                {project.approach.facts.map((fact) => <div key={fact.term}><dt>{fact.term}</dt><dd>{fact.detail}</dd></div>)}
              </dl>
            </section>
            <section className="case-note" aria-label="Result">
              <p className="case-label">Result <span>/ {project.result.label}</span></p>
              <h4>{project.result.heading}</h4>
              <p>{project.result.body}</p>
            </section>
            <div className="case-meta">
              <p className="case-label">Built with</p>
              <Chips items={project.stack} label={`${project.name} tech stack`} />
              <div className="case-links">
                <a className="button button-ghost button-sm" href={contact.github} target="_blank" rel="noreferrer"><FaGithub aria-hidden="true" /> GitHub</a>
                <a className="button button-ghost button-sm" href={`mailto:${contact.email}?subject=${encodeURIComponent(`${project.name} demo`)}`}>Request a demo <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
