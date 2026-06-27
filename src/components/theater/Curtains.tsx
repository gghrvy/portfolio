'use client'

import { useRef, useEffect } from 'react'
import { Mesh, BufferGeometry, Float32BufferAttribute } from 'three'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Screen is ~14 units wide centered at x=0, z=-15.8
// Each curtain covers one half (7 units), centered at ±3.5
const CURTAIN_W = 8
const CURTAIN_H = 11
const CURTAIN_Y = 5.8
const CURTAIN_Z = -15.3
const LEFT_CLOSED  = -4        // left curtain center when closed
const RIGHT_CLOSED =  4        // right curtain center when closed
const LEFT_OPEN    = -13.5     // left curtain slides off-screen left
const RIGHT_OPEN   =  13.5     // right curtain slides off-screen right
const WAVE_COLS    = 8         // horizontal segments for the gather wave
const WAVE_ROWS    = 16        // vertical segments

function makeCurtainGeometry(flip = false) {
  const geom = new BufferGeometry()
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let row = 0; row <= WAVE_ROWS; row++) {
    const v = row / WAVE_ROWS
    const y = (v - 0.5) * CURTAIN_H
    for (let col = 0; col <= WAVE_COLS; col++) {
      const u = col / WAVE_COLS
      const x = (u - 0.5) * CURTAIN_W
      // Gather wave: sinusoidal ripple along X, deepening toward the top
      const wave = Math.sin(u * Math.PI * 3) * 0.18 * (1 - v * 0.4)
      const z = flip ? -wave : wave
      positions.push(x, y, z)
      normals.push(0, 0, flip ? -1 : 1)
      uvs.push(u, 1 - v)
    }
  }

  for (let row = 0; row < WAVE_ROWS; row++) {
    for (let col = 0; col < WAVE_COLS; col++) {
      const a = row * (WAVE_COLS + 1) + col
      const b = a + 1
      const c = a + (WAVE_COLS + 1)
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  geom.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geom.setAttribute('normal', new Float32BufferAttribute(normals, 3))
  geom.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

const leftGeom  = makeCurtainGeometry(false)
const rightGeom = makeCurtainGeometry(true)

const MATERIAL_PROPS = {
  color: '#6b0d0d' as const,
  roughness: 0.92,
  metalness: 0,
  emissive: '#2a0505' as const,
  emissiveIntensity: 0.25,
}

export default function Curtains() {
  const leftRef  = useRef<Mesh>(null)
  const rightRef = useRef<Mesh>(null)
  const activeSection = useTheaterStore(s => s.activeSection)
  const reduced = useReducedMotion()

  useEffect(() => {
    const open = activeSection !== 'lobby'
    const leftX  = open ? LEFT_OPEN  : LEFT_CLOSED
    const rightX = open ? RIGHT_OPEN : RIGHT_CLOSED

    if (reduced) {
      if (leftRef.current)  leftRef.current.position.x = leftX
      if (rightRef.current) rightRef.current.position.x = rightX
      return
    }

    gsap.to(leftRef.current!.position,  { x: leftX,  duration: 1.6, ease: 'power3.inOut' })
    gsap.to(rightRef.current!.position, { x: rightX, duration: 1.6, ease: 'power3.inOut' })
  }, [activeSection, reduced])

  return (
    <>
      <mesh ref={leftRef} geometry={leftGeom} position={[LEFT_CLOSED, CURTAIN_Y, CURTAIN_Z]}>
        <meshStandardMaterial {...MATERIAL_PROPS} side={2} />
      </mesh>
      <mesh ref={rightRef} geometry={rightGeom} position={[RIGHT_CLOSED, CURTAIN_Y, CURTAIN_Z]}>
        <meshStandardMaterial {...MATERIAL_PROPS} side={2} />
      </mesh>
    </>
  )
}
