'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D, Color } from 'three'
import { useTheaterStore } from '@/store/theaterStore'
import { makeNoiseTexture } from '@/lib/theater/proceduralTextures'

const ROWS = 6
const COLS = 10
const ROW_SPACING = 1.6
const COL_SPACING = 1.9
const START_Z = 1.5

// Seat part dimensions
const CUSHION_W = 0.82
const CUSHION_H = 0.10
const CUSHION_D = 0.52
const CUSHION_Y = 0.48

const BACKREST_W = 0.82
const BACKREST_H = 0.78
const BACKREST_D = 0.14
const BACKREST_Y = 0.97  // sits on top of cushion

const LEG_W = 0.08
const LEG_H = 0.46
const LEG_D = 0.08
const LEG_Y = 0.23

const COUNT = ROWS * COLS
const HIGHLIGHT_INDEX = Math.floor(ROWS / 2) * COLS + Math.floor(COLS / 2)

const dummy = new Object3D()
const seatColor   = new Color('#8b1a1a')
const highlightColor = new Color('#e63030')

function buildPositions() {
  const positions: [number, number, number][] = []
  for (let row = 0; row < ROWS; row++)
    for (let col = 0; col < COLS; col++)
      positions.push([(col - COLS / 2 + 0.5) * COL_SPACING, 0, START_Z + row * ROW_SPACING])
  return positions
}
const positions = buildPositions()

function initMesh(mesh: InstancedMesh, yOffset: number, xOffset = 0, zOffset = 0, color = seatColor) {
  positions.forEach(([x, , z], i) => {
    dummy.position.set(x + xOffset, yOffset, z + zOffset)
    dummy.rotation.set(0, 0, 0)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    mesh.setColorAt(i, color)
  })
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
}

export default function Seats() {
  const cushionRef  = useRef<InstancedMesh>(null)
  const backrestRef = useRef<InstancedMesh>(null)
  const legLRef     = useRef<InstancedMesh>(null)
  const legRRef     = useRef<InstancedMesh>(null)

  const activeSection  = useTheaterStore(s => s.activeSection)
  const setSection     = useTheaterStore(s => s.setSection)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
  const pulseRef = useRef(0)
  const rockRef = useRef(0)
  const [hovered, setHovered] = useState(false)

  const fabricRough = useMemo(() => {
    if (typeof window === 'undefined') return null
    const t = makeNoiseTexture(64, 2, 200, 255)
    t.repeat.set(2, 2)
    return t
  }, [])

  useEffect(() => {
    const legColor = new Color('#1a0808')
    if (cushionRef.current)  initMesh(cushionRef.current,  CUSHION_Y)
    if (backrestRef.current) initMesh(backrestRef.current, BACKREST_Y, 0, CUSHION_D / 2 - BACKREST_D / 2)
    if (legLRef.current)     initMesh(legLRef.current,     LEG_Y, -CUSHION_W * 0.35, 0, legColor)
    if (legRRef.current)     initMesh(legRRef.current,     LEG_Y,  CUSHION_W * 0.35, 0, legColor)
  }, [])

  useFrame((_, delta) => {
    pulseRef.current += delta * 2.2
    const isAbout = activeSection === 'about'
    const t = isAbout ? 0.5 + Math.sin(pulseRef.current) * 0.5 : 0
    const c = new Color().lerpColors(seatColor, highlightColor, t)

    for (const ref of [cushionRef, backrestRef, legLRef, legRRef]) {
      const mesh = ref.current
      if (!mesh) continue
      mesh.setColorAt(HIGHLIGHT_INDEX, c)
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }

    // Rock the highlighted seat's backrest when hovered
    const targetRock = hovered ? -0.09 : 0
    rockRef.current += (targetRock - rockRef.current) * delta * 8
    const backrest = backrestRef.current
    if (backrest) {
      const [hx, , hz] = positions[HIGHLIGHT_INDEX]
      dummy.position.set(hx, BACKREST_Y, hz + CUSHION_D / 2 - BACKREST_D / 2)
      dummy.rotation.set(rockRef.current, 0, 0)
      dummy.updateMatrix()
      backrest.setMatrixAt(HIGHLIGHT_INDEX, dummy.matrix)
      backrest.instanceMatrix.needsUpdate = true
    }
  })

  const HIGHLIGHT_X = positions[HIGHLIGHT_INDEX][0]
  const HIGHLIGHT_Z = positions[HIGHLIGHT_INDEX][2]

  const sharedProps = { castShadow: false, receiveShadow: false } as const

  return (
    <group>
      {/* Seat cushion */}
      <instancedMesh ref={cushionRef} args={[undefined, undefined, COUNT]} {...sharedProps}>
        <boxGeometry args={[CUSHION_W, CUSHION_H, CUSHION_D]} />
        <meshStandardMaterial roughness={0.92} roughnessMap={fabricRough ?? undefined} metalness={0} vertexColors />
      </instancedMesh>

      {/* Backrest — slightly tilted back */}
      <instancedMesh ref={backrestRef} args={[undefined, undefined, COUNT]} {...sharedProps}>
        <boxGeometry args={[BACKREST_W, BACKREST_H, BACKREST_D]} />
        <meshStandardMaterial roughness={0.92} roughnessMap={fabricRough ?? undefined} metalness={0} vertexColors />
      </instancedMesh>

      {/* Left leg */}
      <instancedMesh ref={legLRef} args={[undefined, undefined, COUNT]} {...sharedProps}>
        <boxGeometry args={[LEG_W, LEG_H, LEG_D]} />
        <meshStandardMaterial color="#1a0808" roughness={0.9} metalness={0.15} />
      </instancedMesh>

      {/* Right leg */}
      <instancedMesh ref={legRRef} args={[undefined, undefined, COUNT]} {...sharedProps}>
        <boxGeometry args={[LEG_W, LEG_H, LEG_D]} />
        <meshStandardMaterial color="#1a0808" roughness={0.9} metalness={0.15} />
      </instancedMesh>

      {/* Invisible click target over highlight seat */}
      <mesh
        position={[HIGHLIGHT_X, 1.6, HIGHLIGHT_Z]}
        onPointerEnter={() => {
          if (!isTransitioning) {
            setHovered(true)
            setHoveredZone('about')
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerLeave={() => {
          setHovered(false)
          setHoveredZone(null)
          document.body.style.cursor = 'default'
        }}
        onClick={() => { if (!isTransitioning) setSection('about') }}
      >
        <boxGeometry args={[CUSHION_W + 0.4, 1.4, CUSHION_D + 0.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
