import { describe, it, expect } from 'vitest'
import { PROJECTS } from '../lib/theater/projectData'

describe('PROJECTS', () => {
  it('has exactly 4 projects', () => {
    expect(PROJECTS).toHaveLength(4)
  })

  it('each project has required fields', () => {
    for (const p of PROJECTS) {
      expect(p.id).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.genreTag).toBeTruthy()
      expect(p.description).toBeTruthy()
      expect(p.tags.length).toBeGreaterThan(0)
      expect(p.codeSnippet).toBeTruthy()
    }
  })

  it('exactly one project is featured', () => {
    expect(PROJECTS.filter(p => p.featured)).toHaveLength(1)
  })

  it('featured project is digital-twin', () => {
    expect(PROJECTS.find(p => p.featured)?.id).toBe('digital-twin')
  })
})
