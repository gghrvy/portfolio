export type ShotName = 'LOBBY' | 'THE_SEAT' | 'THE_BOOTH' | 'NOW_SHOWING' | 'BOX_OFFICE'

export type Section = 'lobby' | 'about' | 'skills' | 'projects' | 'contact'

export interface CameraShot {
  position: [number, number, number]
  target: [number, number, number]
}

export const CAMERA_SHOTS: Record<ShotName, CameraShot> = {
  LOBBY:       { position: [0, 5.5, 10],  target: [0, 5.5, -15] },
  THE_SEAT:    { position: [0, 2.8, 3],   target: [0, 5.5, -15] },
  THE_BOOTH:   { position: [0, 6.5, 4],   target: [0, 5.5, -15] },
  NOW_SHOWING: { position: [0, 5.5, -2],  target: [0, 5.5, -15] },
  // Contact: hover close above the review card on the front-row seat
  BOX_OFFICE:  { position: [2.85, 2.2, 2.9], target: [2.85, 0.6, 1.4] },
}

export const SECTION_TO_SHOT: Record<Section, ShotName> = {
  lobby:    'LOBBY',
  about:    'THE_SEAT',
  skills:   'THE_BOOTH',
  projects: 'NOW_SHOWING',
  contact:  'BOX_OFFICE',
}
