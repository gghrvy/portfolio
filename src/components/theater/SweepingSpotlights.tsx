'use client'

import { useRef } from 'react'
import { SpotLight, Object3D } from 'three'
import { useFrame } from '@react-three/fiber'
import { useTheaterStore } from '@/store/theaterStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function SweepingSpotlights() {
  const mode = useTheaterStore(s => s.mode)
  const activeSection = useTheaterStore(s => s.activeSection)
  const reduced = useReducedMotion()

  const leftRef = useRef<SpotLight>(null)
  const rightRef = useRef<SpotLight>(null)
  const targetL = useRef(new Object3D())
  const targetR = useRef(new Object3D())

  const active = mode === 'normal' && activeSection === 'lobby' && !reduced

  useFrame(({ clock }) => {
    if (!active) return
    const t = clock.elapsedTime * 0.18

    if (leftRef.current) {
      leftRef.current.position.set(Math.sin(t) * 7, 11, Math.cos(t) * 5)
      leftRef.current.intensity = 8 + Math.sin(t * 1.3) * 2
    }
    if (rightRef.current) {
      rightRef.current.position.set(Math.sin(t + Math.PI) * 7, 11, Math.cos(t + Math.PI) * 5)
      rightRef.current.intensity = 8 + Math.sin(t * 1.3 + 1) * 2
    }
  })

  if (!active) return null

  return (
    <>
      <spotLight
        ref={leftRef}
        color="#fff5e0"
        intensity={8}
        angle={0.25}
        penumbra={0.7}
        distance={30}
        castShadow={false}
        target={targetL.current}
      />
      <primitive object={targetL.current} position={[0, 0, -5]} />

      <spotLight
        ref={rightRef}
        color="#ffe8c8"
        intensity={8}
        angle={0.25}
        penumbra={0.7}
        distance={30}
        castShadow={false}
        target={targetR.current}
      />
      <primitive object={targetR.current} position={[0, 0, -5]} />
    </>
  )
}
