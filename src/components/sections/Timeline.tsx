import { NodeLabel } from '@/components/ui'
import { certifications, education, experience, timelineIntro, type TimelineEntry } from '@/content/timeline'

function Entry({ entry, heading: Heading }: { entry: TimelineEntry; heading: 'h3' | 'h4' }) {
  return (
    <li className="tl-item" data-kind={entry.kind}>
      <span className="tl-node" aria-hidden="true" />
      <div className="tl-meta">
        <span className="tl-kind">{entry.kind}</span>
        <span className="tl-date">{entry.date}</span>
      </div>
      <div className="tl-content">
        <Heading>{entry.title}</Heading>
        <p className="tl-org">{entry.org}</p>
        {entry.body.map((paragraph) => <p className="tl-body" key={paragraph}>{paragraph}</p>)}
        {entry.highlights && <ul className="tl-highlights">{entry.highlights.map((item) => <li key={item}>{item}</li>)}</ul>}
        {entry.scope && (
          <div className="tl-scope">
            <span>{entry.scopeLabel}</span>
            <ul className="chips">{entry.scope.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        )}
      </div>
    </li>
  )
}

export function Timeline() {
  return (
    <section className="timeline" id="experience" aria-labelledby="timeline-title">
      <div className="wrap tl-grid">
        <header className="tl-head">
          <NodeLabel index="04">{timelineIntro.label}</NodeLabel>
          <h2 id="timeline-title">{timelineIntro.heading}</h2>
          <p>{timelineIntro.body}</p>
        </header>
        <div className="tl-track">
          <span className="tl-rail" aria-hidden="true"><i /></span>
          <ol className="tl">
            {experience.map((entry) => <Entry key={entry.title} entry={entry} heading="h3" />)}
          </ol>
          <div className="tl-group">
            <h3>Education and credentials.</h3>
            <p>{timelineIntro.credentialsBody}</p>
          </div>
          <ol className="tl">
            {[education, ...certifications].map((entry) => <Entry key={entry.title} entry={entry} heading="h4" />)}
          </ol>
        </div>
      </div>
    </section>
  )
}
