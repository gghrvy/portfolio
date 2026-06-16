import { describe, it, expect } from 'vitest'
import { EASE, DUR } from '../lib/theater/easing'

describe('animation language', () => {
  it('defines the three easing idioms', () => {
    expect(EASE.camera).toBe('power3.inOut')
    expect(EASE.enter).toBe('power2.out')
    expect(EASE.dom).toEqual([0.22, 1, 0.36, 1])
  })

  it('micro durations stay under 0.3s', () => {
    expect(DUR.micro).toBeLessThanOrEqual(0.3)
  })

  it('transitions stay in the 0.8–1.5s band', () => {
    expect(DUR.transition).toBeGreaterThanOrEqual(0.8)
    expect(DUR.transition).toBeLessThanOrEqual(1.5)
    expect(DUR.lights).toBeGreaterThanOrEqual(0.8)
    expect(DUR.lights).toBeLessThanOrEqual(1.5)
  })

  it('ambient loops are slow (4s+)', () => {
    expect(DUR.ambientMin).toBeGreaterThanOrEqual(4)
    expect(DUR.ambientMax).toBeGreaterThan(DUR.ambientMin)
  })
})
