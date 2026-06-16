'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, CanvasTexture } from 'three'
import { PROJECTS } from '@/lib/theater/projectData'
import { createPosterTexture } from '@/lib/theater/posterTextures'
import { useTheaterStore } from '@/store/theaterStore'

const POSTER_W = 2.2
const POSTER_H = 3.2

// Standees line the left side aisle (between seats at x=-8.55 and left wall at x=-10.8)
const STANDEE_X     = -9.2
const STANDEE_GAP   = 3.6
const STANDEE_START_Z = -5

const FRAME_T = 0.09  // frame bar cross-section thickness
const BASE_H  = 0.08
const BASE_D  = 1.5   // base plate depth (z)
const BASE_W  = 0.12  // base plate width (x)

interface StandeeProps {
  project: typeof PROJECTS[0]
  index: number
  texture: CanvasTexture
}

function Standee({ project, index, texture }: StandeeProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const setSection    = useTheaterStore(s => s.setSection)
  const setProject    = useTheaterStore(s => s.setProject)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const emissiveTarget  = useRef(project.featured ? 0.28 : 0.14)

  // Poster center sits above the base plate
  const cy = BASE_H + POSTER_H / 2

  const frameColor  = project.featured ? '#3a2800' : '#1a1245'
  const accentColor = project.featured ? '#ffd27c' : '#b07cff'

  useFrame((_, delta) => {
    const mesh = meshRef.current as any
    if (!mesh) return
    emissiveTarget.current = hovered ? 0.7 : (project.featured ? 0.28 : 0.14)
    mesh.material.emissiveIntensity +=
      (emissiveTarget.current - mesh.material.emissiveIntensity) * delta * 8
  })

  const z = STANDEE_START_Z + index * STANDEE_GAP

  return (
    <group position={[STANDEE_X, 0, z]}>

      {/* ── Base plate ─────────────────────────────── */}
      <mesh position={[0, BASE_H / 2, 0]}>
        <boxGeometry args={[BASE_W, BASE_H, BASE_D]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* ── Backing board (cardboard-style slab) ───── */}
      <mesh position={[-FRAME_T * 0.5, cy, 0]}>
        <boxGeometry args={[0.05, POSTER_H + FRAME_T * 2, POSTER_W + FRAME_T * 2]} />
        <meshStandardMaterial color="#0e0e0e" roughness={1} />
      </mesh>

      {/* ── Frame — top bar ────────────────────────── */}
      <mesh position={[0, cy + POSTER_H / 2 + FRAME_T / 2, 0]}>
        <boxGeometry args={[FRAME_T, FRAME_T, POSTER_W + FRAME_T * 2]} />
        <meshStandardMaterial color={frameColor} roughness={0.65} metalness={0.1} emissive={accentColor} emissiveIntensity={0.12} />
      </mesh>

      {/* ── Frame — bottom bar ─────────────────────── */}
      <mesh position={[0, cy - POSTER_H / 2 - FRAME_T / 2, 0]}>
        <boxGeometry args={[FRAME_T, FRAME_T, POSTER_W + FRAME_T * 2]} />
        <meshStandardMaterial color={frameColor} roughness={0.65} metalness={0.1} emissive={accentColor} emissiveIntensity={0.12} />
      </mesh>

      {/* ── Frame — left side bar ──────────────────── */}
      <mesh position={[0, cy, POSTER_W / 2 + FRAME_T / 2]}>
        <boxGeometry args={[FRAME_T, POSTER_H + FRAME_T * 2, FRAME_T]} />
        <meshStandardMaterial color={frameColor} roughness={0.65} metalness={0.1} emissive={accentColor} emissiveIntensity={0.12} />
      </mesh>

      {/* ── Frame — right side bar ─────────────────── */}
      <mesh position={[0, cy, -(POSTER_W / 2 + FRAME_T / 2)]}>
        <boxGeometry args={[FRAME_T, POSTER_H + FRAME_T * 2, FRAME_T]} />
        <meshStandardMaterial color={frameColor} roughness={0.65} metalness={0.1} emissive={accentColor} emissiveIntensity={0.12} />
      </mesh>

      {/* ── Easel support strut ────────────────────── */}
      <mesh position={[-0.22, cy * 0.55, 0.28]}>
        <boxGeometry args={[0.04, cy * 1.1, 0.04]} />
        <meshStandardMaterial color="#181818" roughness={0.9} metalness={0.15} />
      </mesh>
      {/* Hinge crossbar */}
      <mesh position={[-0.11, cy, 0.28]}>
        <boxGeometry args={[0.22, 0.04, 0.04]} />
        <meshStandardMaterial color="#202020" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* ── Poster face ────────────────────────────── */}
      {/* rotation [0, π/2, 0] → face points +x (toward center aisle) */}
      <mesh
        ref={meshRef}
        rotation={[0, Math.PI / 2, 0]}
        position={[0, cy, 0]}
        onPointerEnter={() => {
          if (!isTransitioning) { setHovered(true); document.body.style.cursor = 'pointer' }
        }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default' }}
        onClick={() => {
          if (isTransitioning) return
          setProject(project.id)
          setSection('projects')
        }}
      >
        <planeGeometry args={[POSTER_W, POSTER_H]} />
        <meshStandardMaterial
          map={texture}
          emissive={project.featured ? '#ffd27c' : '#b07cff'}
          emissiveIntensity={project.featured ? 0.28 : 0.14}
          roughness={0.75}
        />
      </mesh>

      {/* Hover glow strip below frame */}
      {hovered && (
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0.02, cy - POSTER_H / 2 - 0.2, 0]}>
          <planeGeometry args={[POSTER_W, 0.28]} />
          <meshStandardMaterial
            color={project.featured ? '#3a2800' : '#1a1030'}
            emissive={accentColor}
            emissiveIntensity={0.55}
          />
        </mesh>
      )}
    </group>
  )
}

export default function PosterWall() {
  const [textures, setTextures] = useState<CanvasTexture[]>([])

  useEffect(() => {
    setTextures(PROJECTS.map(p => createPosterTexture(p)))
  }, [])

  if (textures.length === 0) return null

  return (
    <group>
      {PROJECTS.map((project, i) => (
        <Standee key={project.id} project={project} index={i} texture={textures[i]} />
      ))}
    </group>
  )
}