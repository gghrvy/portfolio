'use client'

import { useRef, useEffect } from 'react'
import {
  AmbientLight, DirectionalLight, PointLight, SpotLight, Color, Object3D,
} from 'three'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'
import {
  LIGHTING_PRESETS, deriveLightingState, type LightingStateName,
} from '@/lib/theater/lightingStates'
import { EASE, DUR } from '@/lib/theater/easing'
import { sounds } from '@/lib/theater/sounds'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Review card seat (front row, two seats right of center) — see ReviewCard.tsx
export const CARD_SEAT_POS: [number, number, number] = [2.85, 0.56, 1.5]

export default function HouseLights() {
  const ambientRef   = useRef<AmbientLight>(null)
  const ceilingRef   = useRef<DirectionalLight>(null)
  const frontRef     = useRef<DirectionalLight>(null)
  const screenRef    = useRef<PointLight>(null)
  const projectorRef = useRef<SpotLight>(null)
  const sideLRef     = useRef<PointLight>(null)
  const sideRRef     = useRef<PointLight>(null)
  const lampRef      = useRef<SpotLight>(null)
  const lampTarget   = useRef<Object3D>(new Object3D())

  const activeSection = useTheaterStore(s => s.activeSection)
  const mode          = useTheaterStore(s => s.mode)
  const reduced       = useReducedMotion()
  const prevState     = useRef<LightingStateName | null>(null)
  const tweensRef     = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    const state = deriveLightingState(activeSection, mode)
    if (state === prevState.current) return
    const isInitial = prevState.current === null
    prevState.current = state
    if (!isInitial) sounds.play('thunk')
    const p = LIGHTING_PRESETS[state]

    const lights = {
      ambient: ambientRef.current, ceiling: ceilingRef.current,
      front: frontRef.current, screen: screenRef.current,
      projector: projectorRef.current, sideL: sideLRef.current,
      sideR: sideRRef.current, lamp: lampRef.current,
    }
    if (Object.values(lights).some(l => !l)) return

    tweensRef.current.forEach(t => t.kill())
    tweensRef.current = []

    const targetColor = new Color(p.ambient.color)

    if (reduced) {
      lights.ambient!.intensity = p.ambient.intensity
      lights.ambient!.color.copy(targetColor)
      lights.ceiling!.intensity = p.ceiling
      lights.front!.intensity = p.frontFill
      lights.screen!.intensity = p.screenGlow
      lights.projector!.intensity = p.projector
      lights.sideL!.intensity = p.sideFill
      lights.sideR!.intensity = p.sideFill
      lights.lamp!.intensity = p.readingLamp
      return
    }

    const tw = (target: object, vars: gsap.TweenVars) =>
      tweensRef.current.push(gsap.to(target, { duration: DUR.lights, ease: EASE.camera, ...vars }))

    tw(lights.ambient!, { intensity: p.ambient.intensity })
    tw(lights.ambient!.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b })
    tw(lights.ceiling!, { intensity: p.ceiling })
    tw(lights.front!, { intensity: p.frontFill })
    tw(lights.screen!, { intensity: p.screenGlow })
    tw(lights.projector!, { intensity: p.projector })
    tw(lights.sideL!, { intensity: p.sideFill })
    tw(lights.sideR!, { intensity: p.sideFill })
    tw(lights.lamp!, { intensity: p.readingLamp })
  }, [activeSection, mode, reduced])

  // Aim the reading lamp at the review card
  useEffect(() => {
    lampTarget.current.position.set(...CARD_SEAT_POS)
    if (lampRef.current) {
      lampRef.current.target = lampTarget.current
    }
  }, [])

  // Start in HOUSE (lobby is the initial section)
  const init = LIGHTING_PRESETS.HOUSE

  return (
    <>
      <ambientLight ref={ambientRef} intensity={init.ambient.intensity} color={init.ambient.color} />
      <directionalLight ref={ceilingRef} position={[0, 14, 0]} intensity={init.ceiling} color="#d0c0e8" />
      <directionalLight ref={frontRef} position={[0, 4, -10]} intensity={init.frontFill} color="#c8a870" />
      <pointLight ref={screenRef} position={[0, 5, -11]} intensity={init.screenGlow} color="#aad4ff" distance={28} decay={1.5} />
      <spotLight
        ref={projectorRef}
        position={[0, 11, 12]}
        intensity={init.projector}
        angle={Math.PI / 11}
        penumbra={0.7}
        color="#fff8e8"
        distance={42}
        decay={1.2}
      />
      <pointLight ref={sideLRef} position={[-8, 5, 0]} intensity={init.sideFill} color="#ff8840" distance={20} decay={2} />
      <pointLight ref={sideRRef} position={[ 8, 5, 0]} intensity={init.sideFill} color="#ff8840" distance={20} decay={2} />
      {/* Reading lamp — warm pool over the review-card seat, off outside INTIMATE */}
      <spotLight
        ref={lampRef}
        position={[CARD_SEAT_POS[0], 6.5, CARD_SEAT_POS[2] + 1.2]}
        intensity={init.readingLamp}
        angle={Math.PI / 9}
        penumbra={0.6}
        color="#ffd9a0"
        distance={12}
        decay={1.6}
      />
      <primitive object={lampTarget.current} />
    </>
  )
}
