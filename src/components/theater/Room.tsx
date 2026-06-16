'use client'

import { useMemo } from 'react'
import { DoubleSide } from 'three'
import { makeNoiseTexture } from '@/lib/theater/proceduralTextures'

const ROOM = { w: 22, h: 12, d: 32 }

export default function Room() {
  const wallRough = useMemo(() => {
    if (typeof window === 'undefined') return null
    const t = makeNoiseTexture(128, 8, 180, 235)
    t.repeat.set(4, 2)
    return t
  }, [])

  const floorRough = useMemo(() => {
    if (typeof window === 'undefined') return null
    const t = makeNoiseTexture(128, 3, 120, 200)
    t.repeat.set(6, 8)
    return t
  }, [])

  const wallMat = (
    <meshStandardMaterial
      color="#4a3020"
      roughness={0.9}
      roughnessMap={wallRough ?? undefined}
      metalness={0.04}
      side={DoubleSide}
    />
  )

  return (
    <group>
      {/* Floor — wood with noise sheen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={false}>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <meshStandardMaterial
          color="#2a1810"
          roughness={0.8}
          roughnessMap={floorRough ?? undefined}
          metalness={0.05}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.h, 0]}>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <meshStandardMaterial color="#1e1420" roughness={0.95} metalness={0} />
      </mesh>

      {/* Back wall (behind camera) */}
      <mesh position={[0, ROOM.h / 2, ROOM.d / 2]}>
        <planeGeometry args={[ROOM.w, ROOM.h]} />
        {wallMat}
      </mesh>

      {/* Front wall (screen wall) */}
      <mesh position={[0, ROOM.h / 2, -ROOM.d / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM.w, ROOM.h]} />
        <meshStandardMaterial color="#3a2416" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-ROOM.w / 2, ROOM.h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM.d, ROOM.h]} />
        {wallMat}
      </mesh>

      {/* Right wall */}
      <mesh position={[ROOM.w / 2, ROOM.h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM.d, ROOM.h]} />
        {wallMat}
      </mesh>

      {/* Carpet aisle strip — slightly reflective wear */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5]}>
        <planeGeometry args={[1.6, 20]} />
        <meshStandardMaterial color="#5a1010" roughness={0.7} metalness={0.04} />
      </mesh>
    </group>
  )
}
