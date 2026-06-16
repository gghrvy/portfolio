'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'
import { CAMERA_SHOTS } from '@/lib/theater/cameraShots'
import { EASE } from '@/lib/theater/easing'
import { CARD_SEAT_POS } from './HouseLights'

// Waypoints of the 30s tour. Each leg: move to pos while looking at target.
const LEGS: { pos: [number, number, number]; look: [number, number, number]; dur: number; flare?: number; card?: number }[] = [
  { pos: [-8.5, 4.2, -2],  look: [-10.5, 4.2, -5],  dur: 4.0, flare: 0 },  // left poster wall
  { pos: [-8.5, 4.2, -8],  look: [-10.5, 4.2, -10], dur: 3.5, flare: 1 },
  { pos: [-4, 8.5, 8],     look: [0, 5.5, -15],     dur: 4.5 },            // up through the beam
  { pos: [4, 6.5, 11],     look: [-9, 6.5, 12],     dur: 3.5 },            // past the booth
  { pos: [8.5, 4.2, -8],   look: [10.5, 4.2, -5],   dur: 3.5, flare: 2 },  // right posters
  { pos: [0, 2.6, 6],      look: [0, 5.5, -15],     dur: 4.0, flare: 3, card: 0 }, // down the rows
  { pos: [0, 5.5, -4],     look: [0, 5.5, -15],     dur: 4.0, card: 1 },   // screen close-up
  { pos: [2.85, 2.2, 2.9], look: CARD_SEAT_POS,     dur: 3.0 },            // end at the review card
]

export default function Trailer() {
  const { camera } = useThree()
  const mode = useTheaterStore(s => s.mode)
  const setMode = useTheaterStore(s => s.setMode)
  const setSection = useTheaterStore(s => s.setSection)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (mode !== 'trailer') return

    const look = new Vector3(...LEGS[0].look)
    // The final leg lands on the review-card shot, so settle into the contact
    // section — CameraRig's tween is a near-no-op and the lamp comes up.
    const timeline = gsap.timeline({
      onComplete: () => {
        setMode('normal')
        setSection('contact')
      },
    })
    tl.current = timeline

    // Absolute insert times — zero-duration .call()s break '>'/'<' chaining
    let at = 0
    LEGS.forEach((leg, i) => {
      timeline.to(camera.position, {
        x: leg.pos[0], y: leg.pos[1], z: leg.pos[2],
        duration: leg.dur, ease: i === 0 ? EASE.enter : 'power2.inOut',
      }, at)
      timeline.to(look, {
        x: leg.look[0], y: leg.look[1], z: leg.look[2],
        duration: leg.dur, ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(look),
      }, at)
      if (leg.flare !== undefined) {
        timeline.call(() => window.dispatchEvent(new CustomEvent('trailer-flare', { detail: leg.flare })), [], at + leg.dur * 0.4)
      }
      if (leg.card !== undefined) {
        timeline.call(() => window.dispatchEvent(new CustomEvent('trailer-card', { detail: leg.card })), [], at)
      }
      at += leg.dur
    })

    // Skip on any input
    const skip = () => {
      timeline.kill()
      const lobby = CAMERA_SHOTS.LOBBY
      gsap.to(camera.position, {
        x: lobby.position[0], y: lobby.position[1], z: lobby.position[2],
        duration: 1.0, ease: EASE.camera,
        onUpdate: () => camera.lookAt(0, 5.5, -15),
        onComplete: () => setMode('normal'),
      })
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') skip() }
    // Delay the pointer listener a tick so the launching click doesn't skip
    const arm = setTimeout(() => window.addEventListener('pointerdown', skip, { once: true }), 400)
    window.addEventListener('keydown', onKey)

    return () => {
      clearTimeout(arm)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', onKey)
      timeline.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  return null
}
