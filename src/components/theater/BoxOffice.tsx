'use client'

import { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, CanvasTexture } from 'three'
import { useTheaterStore } from '@/store/theaterStore'

function makeSignTexture(hovered: boolean): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#1a0e06'
  ctx.fillRect(0, 0, 512, 128)
  ctx.strokeStyle = hovered ? 'rgba(255,180,71,0.9)' : 'rgba(255,180,71,0.4)'
  ctx.lineWidth = 3
  ctx.strokeRect(8, 8, 496, 112)
  ctx.fillStyle = hovered ? '#ffd27c' : '#ffb347'
  ctx.font = 'bold 36px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('BOX OFFICE', 256, 52)
  ctx.fillStyle = hovered ? 'rgba(255,210,124,0.7)' : 'rgba(255,180,71,0.4)'
  ctx.font = '400 18px monospace'
  ctx.fillText('GET IN TOUCH  →', 256, 94)
  return new CanvasTexture(canvas)
}

export default function BoxOffice() {
  const setSection = useTheaterStore(s => s.setSection)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
  const [hovered, setHovered] = useState(false)
  const signRef = useRef<Mesh>(null)
  const swing = useRef(0)

  // Gentle swing on hover, like the sign hangs on chains
  useFrame(({ clock }, delta) => {
    const sign = signRef.current
    if (!sign) return
    const target = hovered ? Math.sin(clock.elapsedTime * 4.2) * 0.05 : 0
    swing.current += (target - swing.current) * delta * 6
    sign.rotation.z = swing.current
  })

  useEffect(() => {
    if (!signRef.current) return
    const mat = signRef.current.material as any
    if (mat.map) mat.map.dispose()
    const tex = makeSignTexture(hovered)
    mat.map = tex
    mat.emissiveMap = tex
    mat.needsUpdate = true
  }, [hovered])

  return (
    <group position={[9.5, 0, 2]}>
      {/* Counter body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2.8, 2, 1.6]} />
        <meshStandardMaterial color="#1e1008" roughness={0.88} />
      </mesh>
      {/* Counter top — marble-ish */}
      <mesh position={[0, 2.06, 0]}>
        <boxGeometry args={[3.0, 0.14, 1.8]} />
        <meshStandardMaterial color="#3a2210" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Vertical sign face — clickable */}
      <mesh
        ref={signRef}
        position={[0, 3.3, -0.5]}
        rotation={[0, 0, 0]}
        onPointerEnter={() => {
          if (!isTransitioning) {
            setHovered(true)
            setHoveredZone('contact')
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerLeave={() => {
          setHovered(false)
          setHoveredZone(null)
          document.body.style.cursor = 'default'
        }}
        onClick={() => { if (!isTransitioning) setSection('contact') }}
      >
        <planeGeometry args={[2.4, 0.6]} />
        <meshStandardMaterial
          color="#1a0e06"
          emissive="#ffb347"
          emissiveIntensity={hovered ? 0.8 : 0.35}
        />
      </mesh>
    </group>
  )
}
