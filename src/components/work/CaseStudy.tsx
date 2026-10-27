import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { Chips } from '@/components/ui'
import { GalleryShell } from '@/components/work/GalleryShell'
import { Pipeline } from '@/components/work/Pipeline'
import { contact } from '@/content/profile'
import type { Project } from '@/content/projects'

export type NextLink = { id: string; label: string; name: string }

export function NextProject({ next }: { next: NextLink }) {
  return (
    <a className="case-next" href={`#${next.id}`}>
      <span className="case-label">{next.label}</span>
      <span className="case-next-name">{next.name}</span>
      <ArrowDown size={20} aria-hidden="true" />
    </a>
  )
}

export function CaseStudy({ project, flip, next }: { project: Project; flip: boolean; next: NextLink }) {
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
          <div className="case-tldr">
            <p className="case-label">TL;DR</p>
            <p>{project.summary}</p>
          </div>
        </header>

        <dl className="case-meta-strip">
          <div><dt>My role</dt><dd>{project.role}</dd></div>
          <div><dt>Outcome</dt><dd>{project.outcome}</dd></div>
          <div><dt>Core stack</dt><dd>{project.stack.slice(0, 3).join(' · ')}</dd></div>
        </dl>

        <Pipeline steps={project.flow} label={`${project.name} pipeline`} />

        <div className="case-body">
          <GalleryShell id={project.id} shots={project.shots} tone={project.tone} name={project.name} />
          <div className="case-notes">
            <div className="case-note">
              <p className="case-label">Problem</p>
              <p className="case-note-lead">{project.problem}</p>
            </div>
            <div className="case-note">
              <p className="case-label">Approach <span>/ {project.approach.label}</span></p>
              <h4>{project.approach.heading}</h4>
              <p>{project.approach.body}</p>
              <dl className="facts">
                {project.approach.facts.map((fact) => <div key={fact.term}><dt>{fact.term}</dt><dd>{fact.detail}</dd></div>)}
              </dl>
            </div>
            <div className="case-note">
              <p className="case-label">Result <span>/ {project.result.label}</span></p>
              <h4>{project.result.heading}</h4>
              <p>{project.result.body}</p>
            </div>
            <div className="case-meta">
              <p className="case-label">Stack</p>
              <Chips items={project.stack} label={`${project.name} tech stack`} />
              <div className="case-links">
                <a className="button button-ghost button-sm" href={contact.github} target="_blank" rel="noreferrer"><FaGithub aria-hidden="true" /> GitHub<span className="visually-hidden"> profile (opens in a new tab)</span></a>
                <a className="button button-ghost button-sm" href={`mailto:${contact.email}?subject=${encodeURIComponent(`${project.name} demo`)}`}>Request a demo <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </div>

        <NextProject next={next} />
      </div>
    </article>
  )
}
