'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'
import { CAMERA_SHOTS } from '@/lib/theater/cameraShots'
import { EASE } from '@/lib/theater/easing'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Camera-only side of the ticket flow — the form UI lives in TicketBoothOverlay (DOM).
const BOOTH_CAM = { position: [6.6, 2.9, 5.6] as const, target: [9.5, 2.8, 1.6] as const }

export default function TicketBooth() {
  const { camera } = useThree()
  const mode = useTheaterStore(s => s.mode)
  const setMode = useTheaterStore(s => s.setMode)
  const visitorName = useTheaterStore(s => s.visitorName)
  const reduced = useReducedMotion()
  const placed = useRef(false)
  const animating = useRef(false)

  // Park camera at the booth when ticket mode begins
  useEffect(() => {
    if (mode !== 'ticket' || placed.current) return
    placed.current = true
    camera.position.set(...BOOTH_CAM.position)
    camera.lookAt(...BOOTH_CAM.target)
  }, [mode, camera])

  // When the form is submitted (visitorName set), dolly to the lobby then unlock
  useEffect(() => {
    if (mode !== 'ticket' || visitorName === null || animating.current) return
    animating.current = true
    const lobby = CAMERA_SHOTS.LOBBY
    const done = () => setMode('normal')
    if (reduced) {
      camera.position.set(...lobby.position)
      done()
      return
    }
    gsap.to(camera.position, {
      x: lobby.position[0], y: lobby.position[1], z: lobby.position[2],
      duration: 2.2, delay: 0.9, ease: EASE.camera,
      onUpdate: () => camera.lookAt(0, 5.5, -15),
      onComplete: done,
    })
  }, [visitorName]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
