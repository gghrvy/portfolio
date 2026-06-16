'use client'

import { useState, useEffect, useRef } from 'react'
import { Mesh, CanvasTexture } from 'three'
import { useTheaterStore } from '@/store/theaterStore'

function makeBoothLabel(hovered: boolean): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 160
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#0e0a14'
  ctx.fillRect(0, 0, 512, 160)
  ctx.strokeStyle = hovered ? 'rgba(170,212,255,0.9)' : 'rgba(170,212,255,0.35)'
  ctx.lineWidth = 2
  ctx.strokeRect(8, 8, 496, 144)
  ctx.fillStyle = hovered ? '#aad4ff' : 'rgba(170,212,255,0.7)'
  ctx.font = 'bold 32px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('PROJECTION BOOTH', 256, 58)
  ctx.fillStyle = hovered ? 'rgba(170,212,255,0.8)' : 'rgba(170,212,255,0.35)'
  ctx.font = '400 18px monospace'
  ctx.fillText('SKILLS & TOOLKIT  →', 256, 100)
  ctx.font = '400 13px monospace'
  ctx.fillStyle = 'rgba(170,212,255,0.25)'
  ctx.fillText('Click to view', 256, 134)
  return new CanvasTexture(canvas)
}

export default function ProjectionBooth() {
  const setSection = useTheaterStore(s => s.setSection)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
  const [hovered, setHovered] = useState(false)
  const labelRef = useRef<Mesh>(null)
  const windowRef = useRef<Mesh>(null)

  useEffect(() => {
    if (!labelRef.current) return
    const mat = labelRef.current.material as any
    if (mat.map) mat.map.dispose()
    const tex = makeBoothLabel(hovered)
    mat.map = tex
    mat.emissiveMap = tex
    mat.needsUpdate = true
  }, [hovered])

  const handlers = {
    onPointerEnter: () => {
      if (!isTransitioning) {
        setHovered(true)
        setHoveredZone('skills')
        document.body.style.cursor = 'pointer'
      }
    },
    onPointerLeave: () => {
      setHovered(false)
      setHoveredZone(null)
      document.body.style.cursor = 'default'
    },
    onClick: () => { if (!isTransitioning) setSection('skills') },
  }

  return (
    <group position={[-9, 6.5, 12]}>
      {/* Booth body */}
      <mesh>
        <boxGeometry args={[4, 3, 3.5]} />
        <meshStandardMaterial color="#120e1c" roughness={0.95} />
      </mesh>

      {/* Glowing projector window (right face) */}
      <mesh ref={windowRef} position={[1.95, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]} {...handlers}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial
          color="#aad4ff"
          emissive="#aad4ff"
          emissiveIntensity={hovered ? 1.4 : 0.7}
          roughness={0.15}
          metalness={0.4}
        />
      </mesh>

      {/* Front-facing label panel */}
      <mesh ref={labelRef} position={[0, -0.5, 1.76]} {...handlers}>
        <planeGeometry args={[3.6, 1.1]} />
        <meshStandardMaterial
          color="#0e0a14"
          emissive="#aad4ff"
          emissiveIntensity={hovered ? 0.6 : 0.25}
        />
      </mesh>
    </group>
  )
}
