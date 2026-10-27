import { NodeLabel } from '@/components/ui'
import { SkillBoard } from '@/components/sections/SkillBoard'
import { skillsIntro } from '@/content/skills'

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
      <SkillBoard />
    </section>
  )
}
