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
    ambient: { intensity: 9.0, color: '#6b4e30' },
    ceiling: 3.0,
    frontFill: 1.2,
    screenGlow: 3.0,
    projector: 2.0,
    sideFill: 4.0,
    readingLamp: 0,
  },
  SHOWTIME: {
    ambient: { intensity: 4.5, color: '#4a3420' },
    ceiling: 1.4,
    frontFill: 0.8,
    screenGlow: 5.0,
    projector: 6.0,
    sideFill: 2.5,
    readingLamp: 0,
  },
  INTIMATE: {
    ambient: { intensity: 2.0, color: '#3a2818' },
    ceiling: 0.6,
    frontFill: 0.4,
    screenGlow: 2.0,
    projector: 3.0,
    sideFill: 1.0,
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
