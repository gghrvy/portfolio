import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contact, hero } from '@/content/profile'
import { aria, projects } from '@/content/projects'
import { skillGroups } from '@/content/skills'
import { certifications, experience } from '@/content/timeline'

const root = process.cwd()

describe('portfolio content', () => {
  it('keeps the real resume and project screenshots available', () => {
    expect(existsSync(resolve(root, 'public/cv.pdf'))).toBe(true)
    for (const project of projects) {
      for (const shot of project.shots) expect(existsSync(resolve(root, 'public', shot.src.slice(1)))).toBe(true)
    }
  })

  it('uses verified contact and project information', () => {
    expect(contact.email).toBe('harvyh.montederamos@gmail.com')
    expect(contact.github).toBe('https://github.com/gghrvy')
    const names = projects.map((project) => project.name)
    expect(names).toEqual(['Prospectos', 'Day One', 'OneTap'])
    expect(names).not.toContain('Opportunity Intelligence')
    expect(aria.heading).toBe('Meet Aria.')
  })

  it('puts the name in the hero', () => {
    expect(hero.name.join(' ')).toBe('Harvy Monte de Ramos')
  })

  it('keeps every skill group, role and credential', () => {
    expect(skillGroups).toHaveLength(4)
    expect(experience.map((entry) => entry.title)).toEqual(['Lead Backend Developer', 'Software Developer Intern'])
    expect(certifications).toHaveLength(4)
  })
})
