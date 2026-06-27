'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import { Mesh, CanvasTexture, Texture, Group, SRGBColorSpace } from 'three'
import { PROJECTS } from '@/lib/theater/projectData'
import { createPosterTexture } from '@/lib/theater/posterTextures'
import { useTheaterStore } from '@/store/theaterStore'

// Wall-mounted lightbox poster frames flanking the screen
// Left side: x=-10.5, Right side: x=10.5
// Positioned at z=-5 and z=-10 (near the screen, on the side walls)

// Projects with key-art load a real image; everything else falls back to
// the canvas-drawn poster. Paths are fixed at module scope so useTexture's
// hook call below is never conditional.
const IMAGE_PROJECTS = PROJECTS.filter(p => p.posterImage)
const IMAGE_PATHS = IMAGE_PROJECTS.map(p => p.posterImage!)

const FRAME_W = 2.0
const FRAME_H = 2.9
const FRAME_DEPTH = 0.1
const FRAME_COLOR = '#1a1020'

const POSTER_POSITIONS = [
  { project: PROJECTS[0], x: -10.5, z: -5,  rotY:  Math.PI / 2 },
  { project: PROJECTS[1], x: -10.5, z: -10, rotY:  Math.PI / 2 },
  { project: PROJECTS[2], x:  10.5, z: -5,  rotY: -Math.PI / 2 },
  { project: PROJECTS[3], x:  10.5, z: -10, rotY: -Math.PI / 2 },
]

interface FrameProps {
  project: typeof PROJECTS[0]
  index: number
  x: number
  z: number
  rotY: number
  texture: CanvasTexture | Texture
}

function PosterFrame({ project, index, x, z, rotY, texture }: FrameProps) {
  const posterRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  const phase = useRef(Math.random() * Math.PI * 2)
  const flare = useRef(0)
  const [hovered, setHovered] = useState(false)

  // Trailer timeline flares this poster as the camera passes
  useEffect(() => {
    const onFlare = (e: Event) => {
      if ((e as CustomEvent<number>).detail === index) flare.current = 1
    }
    window.addEventListener('trailer-flare', onFlare)
    return () => window.removeEventListener('trailer-flare', onFlare)
  }, [index])
  const setPendingProject = useTheaterStore(s => s.setPendingProject)
  const setMode = useTheaterStore(s => s.setMode)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
  const isComingSoon = project.id === 'coming-soon' || project.status === 'In Development'
  const targetEmissive = useRef(project.featured ? 1.0 : 0.8)

  useFrame((state, delta) => {
    const mesh = posterRef.current as any
    if (!mesh) return
    flare.current = Math.max(0, flare.current - delta * 0.8)
    const breathe = Math.sin(state.clock.elapsedTime * 0.6 + phase.current) * 0.04
    targetEmissive.current = (hovered ? 1.5 : (project.featured ? 1.0 : 0.8)) + breathe + flare.current * 0.6
    mesh.material.emissiveIntensity +=
      (targetEmissive.current - mesh.material.emissiveIntensity) * delta * 7

    // Tilt toward the viewer on hover
    const g = groupRef.current
    if (g) {
      const targetTilt = hovered ? 0.09 : 0
      g.rotation.x += (targetTilt - g.rotation.x) * delta * 7
    }
  })

  return (
    <group ref={groupRef} position={[x, 4.2, z]} rotation={[0, rotY, 0]}>
      {/* Lightbox housing */}
      <mesh position={[0, 0, -FRAME_DEPTH / 2]}>
        <boxGeometry args={[FRAME_W + 0.18, FRAME_H + 0.18, FRAME_DEPTH]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Inner light (simulates backlight) */}
      <mesh position={[0, 0, -FRAME_DEPTH * 0.4]}>
        <planeGeometry args={[FRAME_W - 0.06, FRAME_H - 0.06]} />
        <meshStandardMaterial color="#fff8e8" emissive="#fff0d0" emissiveIntensity={0.12} />
      </mesh>

      {/* Poster face — clickable */}
      <mesh
        ref={posterRef}
        position={[0, 0, 0.01]}
        onPointerEnter={() => {
          if (!isTransitioning && !isComingSoon) {
            setHovered(true)
            setHoveredZone('projects')
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerLeave={() => {
          setHovered(false)
          setHoveredZone(null)
          document.body.style.cursor = 'default'
        }}
        onClick={() => {
          if (isTransitioning || isComingSoon) return
          setPendingProject(project.id)
          setMode('film-start')
        }}
      >
        <planeGeometry args={[FRAME_W, FRAME_H]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={isComingSoon ? 0.05 : (project.featured ? 1.0 : 0.8)}
          color={isComingSoon ? '#444444' : '#ffffff'}
          roughness={0.8}
        />
      </mesh>

      {isComingSoon && (
        <Html position={[0, 0, 0.02]} center style={{ pointerEvents: 'none' }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 10px', borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            Coming Soon
          </div>
        </Html>
      )}

      {/* Top illumination strip */}
      <mesh position={[0, FRAME_H / 2 + 0.14, 0]}>
        <boxGeometry args={[FRAME_W + 0.18, 0.06, 0.08]} />
        <meshStandardMaterial
          color="#1a1020"
          emissive={project.featured ? '#ffd27c' : '#b07cff'}
          emissiveIntensity={hovered ? 0.9 : 0.35}
        />
      </mesh>

      {/* Hover name label */}
      {hovered && (
        <Html
          position={[0, -(FRAME_H / 2 + 0.5), 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(8,6,12,0.92)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${project.featured ? 'rgba(255,210,124,0.4)' : 'rgba(176,124,255,0.4)'}`,
            borderRadius: 8,
            padding: '7px 16px',
            whiteSpace: 'nowrap',
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: project.featured ? '#ffd27c' : '#b07cff',
              marginBottom: 3,
            }}>
              {project.genreTag}
            </div>
            <div style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
            }}>
              {project.title}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function PosterFrames() {
  const [canvasTextures, setCanvasTextures] = useState<Record<string, CanvasTexture>>({})

  // Canvas fallback only for projects without key art — generated once on mount
  useEffect(() => {
    const map: Record<string, CanvasTexture> = {}
    for (const p of PROJECTS) {
      if (!p.posterImage) map[p.id] = createPosterTexture(p)
    }
    setCanvasTextures(map)
  }, [])

  // Real key-art images — loaded (and Suspense-gated) unconditionally via the
  // fixed module-level path list, never branching on a prop at call time.
  const imageTextures = useTexture(IMAGE_PATHS)

  useEffect(() => {
    imageTextures.forEach(t => { t.colorSpace = SRGBColorSpace })
  }, [imageTextures])

  const textureById: Record<string, CanvasTexture | Texture> = { ...canvasTextures }
  IMAGE_PROJECTS.forEach((p, i) => { textureById[p.id] = imageTextures[i] })

  const ready = PROJECTS.every(p => textureById[p.id])
  if (!ready) return null

  return (
    <group>
      {POSTER_POSITIONS.map((pos, i) => (
        <PosterFrame
          key={pos.project.id}
          project={pos.project}
          index={i}
          x={pos.x}
          z={pos.z}
          rotY={pos.rotY}
          texture={textureById[pos.project.id]}
        />
      ))}
    </group>
  )
}
