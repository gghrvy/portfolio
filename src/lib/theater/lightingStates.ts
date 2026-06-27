import type { Section } from './cameraShots'

export type LightingStateName = 'HOUSE' | 'SHOWTIME' | 'INTIMATE'
export type TheaterMode = 'normal' | 'trailer' | 'intermission' | 'ticket' | 'film-start'

export interface LightingPreset {
  ambient: { intensity: number; color: string }
  ceiling: number      // cool overhead directional
  frontFill: number    // warm front directional
  screenGlow: number   // blue point light at the screen
  projector: number    // projector spotlight
  sideFill: number     // both warm side point lights
  readingLamp: number  // spotlight over the review-card seat
}

// SHOWTIME matches the current (pre-house-lights) scene values.
export const LIGHTING_PRESETS: Record<LightingStateName, LightingPreset> = {
  // Tuned for ACES tone mapping — ambient carries the "lights up" feel,
  // side fills kept moderate to avoid blown hotspots near the walls.
  HOUSE: {
    ambient: { intensity: 5.2, color: '#3a2a18' },
    ceiling: 1.6,
    frontFill: 0.5,
    screenGlow: 2.0,
    projector: 2.0,
    sideFill: 2.2,
    readingLamp: 0,
  },
  SHOWTIME: {
    ambient: { intensity: 1.8, color: '#2e1e10' },
    ceiling: 0.6,
    frontFill: 0.4,
    screenGlow: 4.0,
    projector: 6.0,
    sideFill: 1.2,
    readingLamp: 0,
  },
  INTIMATE: {
    ambient: { intensity: 1.0, color: '#241810' },
    ceiling: 0.3,
    frontFill: 0.2,
    screenGlow: 1.5,
    projector: 3.0,
    sideFill: 0.6,
    readingLamp: 9.0,
  },
}

export function deriveLightingState(section: Section, mode: TheaterMode): LightingStateName {
  if (mode === 'trailer') return 'SHOWTIME'
  if (mode === 'film-start') return 'SHOWTIME'
  if (mode === 'intermission') return 'HOUSE'
  if (section === 'contact') return 'INTIMATE'
  if (section === 'lobby') return 'HOUSE'
  return 'SHOWTIME'
}
