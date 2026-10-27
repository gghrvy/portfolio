'use client'

import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { skillGroups } from '@/content/skills'

export function SkillBoard() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number, focus = false) => {
    const next = (index + skillGroups.length) % skillGroups.length
    const apply = () => flushSync(() => setActive(next))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (next !== active && document.startViewTransition && !reduced) document.startViewTransition(apply)
    else apply()
    if (focus) tabs.current[next]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: skillGroups.length - 1 }
    if (!(event.key in keys)) return
    event.preventDefault()
    select(keys[event.key], true)
  }

  return (
    <div className="wrap skill-board" data-observe>
      <div className="skill-tabs" role="tablist" aria-label="Skill groups" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {skillGroups.map((group, index) => (
          <button
            key={group.id}
            ref={(element) => { tabs.current[index] = element }}
            type="button"
            role="tab"
            id={`skill-tab-${group.id}`}
            aria-selected={index === active}
            aria-controls={`skill-panel-${group.id}`}
            tabIndex={index === active ? 0 : -1}
            className="skill-tab"
            onClick={() => select(index)}
          >
            <span className="skill-tab-index">0{index + 1}</span>
            <span className="skill-tab-title">{group.title}</span>
            <span className="skill-tab-count">{group.tools.length} tools</span>
          </button>
        ))}
      </div>
      <div className="skill-panels">
        {skillGroups.map((group, index) => (
          <section key={group.id} role="tabpanel" id={`skill-panel-${group.id}`} aria-labelledby={`skill-tab-${group.id}`} className="skill-panel" data-active={index === active} tabIndex={0}>
            <h3><span aria-hidden="true">0{index + 1}</span>{group.title}</h3>
            <ul className="skill-chips">
              {group.tools.map((tool, i) => <li key={tool} style={{ '--i': i } as React.CSSProperties}>{tool}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
