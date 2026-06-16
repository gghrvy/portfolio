import { describe, it, expect } from 'vitest'
import {
  deriveLightingState,
  LIGHTING_PRESETS,
  type LightingStateName,
} from '../lib/theater/lightingStates'

describe('deriveLightingState', () => {
  it('lobby derives HOUSE', () => {
    expect(deriveLightingState('lobby', 'normal')).toBe('HOUSE')
  })

  it('show sections derive SHOWTIME', () => {
    expect(deriveLightingState('about', 'normal')).toBe('SHOWTIME')
    expect(deriveLightingState('skills', 'normal')).toBe('SHOWTIME')
    expect(deriveLightingState('projects', 'normal')).toBe('SHOWTIME')
  })

  it('contact derives INTIMATE', () => {
    expect(deriveLightingState('contact', 'normal')).toBe('INTIMATE')
  })

  it('trailer mode forces SHOWTIME regardless of section', () => {
    expect(deriveLightingState('lobby', 'trailer')).toBe('SHOWTIME')
  })

  it('intermission mode forces HOUSE regardless of section', () => {
    expect(deriveLightingState('projects', 'intermission')).toBe('HOUSE')
  })
})

describe('LIGHTING_PRESETS', () => {
  const names: LightingStateName[] = ['HOUSE', 'SHOWTIME', 'INTIMATE']

  it('all three presets exist with all light channels', () => {
    for (const n of names) {
      const p = LIGHTING_PRESETS[n]
      expect(p.ambient.intensity).toBeTypeOf('number')
      expect(p.ambient.color).toMatch(/^#/)
      expect(p.ceiling).toBeTypeOf('number')
      expect(p.frontFill).toBeTypeOf('number')
      expect(p.screenGlow).toBeTypeOf('number')
      expect(p.projector).toBeTypeOf('number')
      expect(p.sideFill).toBeTypeOf('number')
      expect(p.readingLamp).toBeTypeOf('number')
    }
  })

  it('HOUSE is much brighter than SHOWTIME (lights up)', () => {
    expect(LIGHTING_PRESETS.HOUSE.ambient.intensity).toBeGreaterThanOrEqual(
      LIGHTING_PRESETS.SHOWTIME.ambient.intensity * 2.5,
    )
  })

  it('only INTIMATE has the reading lamp on', () => {
    expect(LIGHTING_PRESETS.INTIMATE.readingLamp).toBeGreaterThan(0)
    expect(LIGHTING_PRESETS.HOUSE.readingLamp).toBe(0)
    expect(LIGHTING_PRESETS.SHOWTIME.readingLamp).toBe(0)
  })
})
