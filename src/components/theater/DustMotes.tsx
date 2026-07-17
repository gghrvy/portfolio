'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points } from 'three'

const COUNT = 80

export default function DustMotes() {
  const ref = useRef<Points>(null)

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      // Scatter across the projector beam volume
      pos[i * 3]     = (Math.random() - 0.5) * 7       // x: ±3.5
      pos[i * 3 + 1] = 5.5 + Math.random() * 7.5       // y: 5.5 → 13
      pos[i * 3 + 2] = -14 + Math.random() * 18         // z: -14 → 4
      vel[i * 3]     = (Math.random() - 0.5) * 0.012
      vel[i * 3 + 1] = -(0.008 + Math.random() * 0.018) // slow fall
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008
    }
    return { positions: pos, velocities: vel }
  }, [])

  useFrame((_, delta) => {
    const pts = ref.current
    if (!pts) return
    const pos = pts.geometry.attributes.position.array as Float32Array
    const dt = Math.min(delta, 0.05)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     += velocities[i * 3]     * dt * 60
      pos[i * 3 + 1] += velocities[i * 3 + 1] * dt * 60
      pos[i * 3 + 2] += velocities[i * 3 + 2] * dt * 60
      // Respawn at the top when a particle drifts too low
      if (pos[i * 3 + 1] < 4.5) {
        pos[i * 3 + 1] = 12 + Math.random() * 2
        pos[i * 3]     = (Math.random() - 0.5) * 7
        pos[i * 3 + 2] = -14 + Math.random() * 18
      }
    }
    pts.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#fff8e8"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
