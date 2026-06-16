import { describe, it, expect } from 'vitest'
import { CAMERA_SHOTS, SECTION_TO_SHOT, type ShotName } from '../lib/theater/cameraShots'

describe('CAMERA_SHOTS', () => {
  const expectedShots: ShotName[] = ['LOBBY', 'THE_SEAT', 'THE_BOOTH', 'NOW_SHOWING', 'BOX_OFFICE']

  it('has all 5 shots', () => {
    for (const name of expectedShots) {
      expect(CAMERA_SHOTS[name]).toBeDefined()
    }
  })

  it('each shot has position and target as 3-tuples', () => {
    for (const shot of Object.values(CAMERA_SHOTS)) {
      expect(shot.position).toHaveLength(3)
      expect(shot.target).toHaveLength(3)
    }
  })
})

describe('SECTION_TO_SHOT', () => {
  it('maps all 5 sections', () => {
    const sections = ['lobby', 'about', 'skills', 'projects', 'contact'] as const
    for (const s of sections) {
      expect(SECTION_TO_SHOT[s]).toBeDefined()
    }
  })
})
