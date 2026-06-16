import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { Mesh, AdditiveBlending, FrontSide, Group } from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTheaterStore } from '@/store/theaterStore'
import { deriveLightingState } from '@/lib/theater/lightingStates'

// Beam presence per lighting state — strongest during SHOWTIME, faint in HOUSE.
const BEAM_OPACITY = { HOUSE: 0.012, SHOWTIME: 0.035, INTIMATE: 0.02 } as const

export default function ProjectorBeam() {
  const meshRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  const reduced = useReducedMotion()
  const activeSection = useTheaterStore(s => s.activeSection)
  const mode = useTheaterStore(s => s.mode)
  const currentOpacity = useRef(BEAM_OPACITY.HOUSE)

  useFrame(({ clock }, delta) => {
    if (reduced || !meshRef.current) return
    const state = deriveLightingState(activeSection, mode)
    const target = BEAM_OPACITY[state]
    // Ease toward the state's base opacity, then shimmer on top
    currentOpacity.current += (target - currentOpacity.current) * Math.min(1, delta * 2)
    const mat = meshRef.current.material as any
    mat.opacity = currentOpacity.current + Math.sin(clock.elapsedTime * 0.8) * 0.006
  })

  if (reduced) return null

  return (
    <group ref={groupRef} position={[0, 10, 13]}>
      <mesh ref={meshRef} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[5.5, 28, 32, 1, true]} />
        <meshBasicMaterial
          color="#fff8e0"
          transparent
          opacity={0.03}
          blending={AdditiveBlending}
          depthWrite={false}
          side={FrontSide}
        />
      </mesh>
      <Sparkles
        count={200}
        scale={[11, 28, 11]}
        size={1.2}
        speed={0.18}
        opacity={0.16}
        color="#ffe8b0"
        position={[0, -14, 0]}
      />
    </group>
  )
}
