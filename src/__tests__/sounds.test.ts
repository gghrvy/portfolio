import { describe, it, expect, beforeEach } from 'vitest'
import { sounds, SOUND_PREF_KEY } from '../lib/theater/sounds'

describe('SoundManager', () => {
  beforeEach(() => {
    localStorage.clear()
    sounds.setMuted(true)
  })

  it('is muted by default', () => {
    expect(sounds.isMuted).toBe(true)
  })

  it('unmuting persists preference', () => {
    sounds.setMuted(false)
    expect(sounds.isMuted).toBe(false)
    expect(localStorage.getItem(SOUND_PREF_KEY)).toBe('1')
  })

  it('muting persists preference', () => {
    sounds.setMuted(false)
    sounds.setMuted(true)
    expect(localStorage.getItem(SOUND_PREF_KEY)).toBe('0')
  })

  it('loadPreference reads stored value', () => {
    localStorage.setItem(SOUND_PREF_KEY, '1')
    expect(sounds.loadPreference()).toBe(false) // '1' = sound on = not muted
  })

  it('play() is a safe no-op while muted (no AudioContext in jsdom)', () => {
    expect(() => sounds.play('click')).not.toThrow()
    expect(() => sounds.play('thunk')).not.toThrow()
  })
})
