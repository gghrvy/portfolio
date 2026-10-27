import { NodeLabel } from '@/components/ui'
import { skillGroups, skillsIntro } from '@/content/skills'

export function Skills() {
  return (
    <section className="skills" id="skills" aria-labelledby="skills-title">
      <div className="wrap skills-head">
        <NodeLabel index="03">{skillsIntro.label}</NodeLabel>
        <div>
          <h2 id="skills-title">{skillsIntro.heading}</h2>
          <p>{skillsIntro.body}</p>
        </div>
      </div>
      <div className="wrap skills-board">
        {skillGroups.map((group, index) => (
          <section className="skill-group" key={group.id} aria-labelledby={`skill-${group.id}`}>
            <h3 id={`skill-${group.id}`}><span aria-hidden="true">0{index + 1}</span>{group.title}<em>{group.tools.length}</em></h3>
            <ul className="chips">{group.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
          </section>
        ))}
      </div>
    </section>
  )
}
