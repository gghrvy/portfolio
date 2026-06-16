'use client'

import { useMemo, useRef } from 'react'
import { CanvasTexture, MeshStandardMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ── helpers ──────────────────────────────────────────────────────────────────

function makeExitTex(text = 'EXIT'): CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128; c.height = 48
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#001800'; ctx.fillRect(0, 0, 128, 48)
  ctx.strokeStyle = '#00ff44'; ctx.lineWidth = 2
  ctx.strokeRect(2, 2, 124, 44)
  ctx.fillStyle = '#00ff44'; ctx.font = 'bold 22px monospace'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(text, 64, 25)
  return new CanvasTexture(c)
}

// ── constants ────────────────────────────────────────────────────────────────

const WALL_X = 10.8   // half room width
const ROOM_D = 32     // room depth
const ROOM_H = 12     // room height

// Acoustic panel layout on side walls
const PANEL_W = 2.2
const PANEL_H = 2.8
const PANEL_DEPTH = 0.12
const PANEL_Y = 3.2
const PANEL_COLOR = '#3d1a1a'

const PANEL_Z_POSITIONS = [-12, -7.5, -3, 1.5, 6, 10.5]

// ── sub-components ───────────────────────────────────────────────────────────

function AcousticPanels() {
  return (
    <group>
      {/* Left wall panels */}
      {PANEL_Z_POSITIONS.map(z => (
        <group key={`lp-${z}`} position={[-WALL_X + PANEL_DEPTH / 2, PANEL_Y, z]}>
          {/* Panel body */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[PANEL_W, PANEL_H, PANEL_DEPTH]} />
            <meshStandardMaterial color={PANEL_COLOR} roughness={1} metalness={0} />
          </mesh>
          {/* Top trim strip */}
          <mesh position={[0, PANEL_H / 2 + 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[PANEL_W + 0.1, 0.08, PANEL_DEPTH + 0.04]} />
            <meshStandardMaterial color="#5a2a18" roughness={0.7} metalness={0.1} />
          </mesh>
          {/* Bottom trim strip */}
          <mesh position={[0, -(PANEL_H / 2 + 0.04), 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[PANEL_W + 0.1, 0.08, PANEL_DEPTH + 0.04]} />
            <meshStandardMaterial color="#5a2a18" roughness={0.7} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Right wall panels */}
      {PANEL_Z_POSITIONS.map(z => (
        <group key={`rp-${z}`} position={[WALL_X - PANEL_DEPTH / 2, PANEL_Y, z]}>
          <mesh rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[PANEL_W, PANEL_H, PANEL_DEPTH]} />
            <meshStandardMaterial color={PANEL_COLOR} roughness={1} metalness={0} />
          </mesh>
          <mesh position={[0, PANEL_H / 2 + 0.04, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[PANEL_W + 0.1, 0.08, PANEL_DEPTH + 0.04]} />
            <meshStandardMaterial color="#5a2a18" roughness={0.7} metalness={0.1} />
          </mesh>
          <mesh position={[0, -(PANEL_H / 2 + 0.04), 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[PANEL_W + 0.1, 0.08, PANEL_DEPTH + 0.04]} />
            <meshStandardMaterial color="#5a2a18" roughness={0.7} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function WallSconces() {
  const bulbMats = useRef<MeshStandardMaterial[]>([])
  const nextFlicker = useRef(3 + Math.random() * 4)
  const flickerEnd = useRef(0)
  const flickerIdx = useRef(0)
  const reduced = useReducedMotion()

  useFrame(({ clock }) => {
    if (reduced) return
    const t = clock.elapsedTime
    if (t > nextFlicker.current) {
      // Start a flicker on a random bulb
      flickerIdx.current = Math.floor(Math.random() * bulbMats.current.length)
      flickerEnd.current = t + 0.3
      nextFlicker.current = t + 3 + Math.random() * 5
    }
    const mat = bulbMats.current[flickerIdx.current]
    if (!mat) return
    if (t < flickerEnd.current) {
      mat.emissiveIntensity = 2.5 * (0.4 + Math.abs(Math.sin(t * 40)) * 0.6)
    } else {
      mat.emissiveIntensity += (2.5 - mat.emissiveIntensity) * 0.2
    }
  })

  const sconce = (x: number, z: number, side: 'left' | 'right', idx: number) => {
    const dir = side === 'left' ? 1 : -1
    return (
      <group key={`sc-${x}-${z}`} position={[x, 5.2, z]}>
        {/* Backplate */}
        <mesh rotation={[0, dir * Math.PI / 2, 0]}>
          <boxGeometry args={[0.3, 0.6, 0.06]} />
          <meshStandardMaterial color="#2a1a10" roughness={0.8} />
        </mesh>
        {/* Arm */}
        <mesh position={[dir * 0.12, 0, 0]}>
          <boxGeometry args={[0.24, 0.06, 0.06]} />
          <meshStandardMaterial color="#3a2818" roughness={0.6} metalness={0.3} />
        </mesh>
        {/* Bulb — emissive, flicker target */}
        <mesh position={[dir * 0.25, 0, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            ref={(m) => { if (m) bulbMats.current[idx] = m }}
            color="#fff4d0" emissive="#ffcc66" emissiveIntensity={2.5}
          />
        </mesh>
        {/* Shade cone */}
        <mesh position={[dir * 0.25, -0.08, 0]} rotation={[dir > 0 ? Math.PI : 0, 0, 0]}>
          <coneGeometry args={[0.14, 0.2, 8]} />
          <meshStandardMaterial color="#2e1a0a" roughness={0.9} side={2} />
        </mesh>
      </group>
    )
  }

  const zs = [-11, -6, -1, 4, 9]
  const leftSconces  = zs.map((z, i) => sconce(-WALL_X + 0.1, z, 'left', i))
  const rightSconces = zs.map((z, i) => sconce( WALL_X - 0.1, z, 'right', zs.length + i))

  return <group>{leftSconces}{rightSconces}</group>
}

function ProsceniumArch() {
  const ARCH_Z = -15.5
  const ARCH_W = 16.2  // wider than screen
  const ARCH_H = 10.0

  return (
    <group position={[0, 0, ARCH_Z]}>
      {/* Left pillar */}
      <mesh position={[-ARCH_W / 2 - 0.6, ARCH_H / 2, 0]}>
        <boxGeometry args={[1.2, ARCH_H, 0.5]} />
        <meshStandardMaterial color="#2e1a10" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[ARCH_W / 2 + 0.6, ARCH_H / 2, 0]}>
        <boxGeometry args={[1.2, ARCH_H, 0.5]} />
        <meshStandardMaterial color="#2e1a10" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Top beam */}
      <mesh position={[0, ARCH_H + 0.3, 0]}>
        <boxGeometry args={[ARCH_W + 3.6, 0.6, 0.5]} />
        <meshStandardMaterial color="#2e1a10" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Emissive gold trim on top beam */}
      <mesh position={[0, ARCH_H + 0.08, 0.28]}>
        <boxGeometry args={[ARCH_W + 3.6, 0.08, 0.08]} />
        <meshStandardMaterial color="#3a2200" emissive="#ffd27c" emissiveIntensity={0.5} />
      </mesh>
      {/* Footlights — emissive strip at bottom of screen */}
      <mesh position={[0, -0.05, 0.3]}>
        <boxGeometry args={[ARCH_W, 0.06, 0.08]} />
        <meshStandardMaterial color="#200e00" emissive="#ff9040" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function CeilingDetail() {
  return (
    <group>
      {/* Perimeter cornice — left */}
      <mesh position={[-WALL_X + 0.15, ROOM_H - 0.15, 0]}>
        <boxGeometry args={[0.3, 0.3, ROOM_D]} />
        <meshStandardMaterial color="#251810" roughness={0.9} />
      </mesh>
      {/* Perimeter cornice — right */}
      <mesh position={[WALL_X - 0.15, ROOM_H - 0.15, 0]}>
        <boxGeometry args={[0.3, 0.3, ROOM_D]} />
        <meshStandardMaterial color="#251810" roughness={0.9} />
      </mesh>
      {/* Ceiling emissive edge strip — left */}
      <mesh position={[-WALL_X + 0.05, ROOM_H - 0.05, 0]}>
        <boxGeometry args={[0.04, 0.04, ROOM_D]} />
        <meshStandardMaterial color="#200e00" emissive="#ff8030" emissiveIntensity={0.4} />
      </mesh>
      {/* Ceiling emissive edge strip — right */}
      <mesh position={[WALL_X - 0.05, ROOM_H - 0.05, 0]}>
        <boxGeometry args={[0.04, 0.04, ROOM_D]} />
        <meshStandardMaterial color="#200e00" emissive="#ff8030" emissiveIntensity={0.4} />
      </mesh>
      {/* Central ceiling beam */}
      <mesh position={[0, ROOM_H - 0.1, 0]}>
        <boxGeometry args={[1.0, 0.2, ROOM_D]} />
        <meshStandardMaterial color="#1e1010" roughness={0.95} />
      </mesh>
    </group>
  )
}

function AisleStepLights() {
  const ROW_COUNT = 6
  const ROW_SPACING = 1.6
  const START_Z = 1.5

  return (
    <group>
      {Array.from({ length: ROW_COUNT }).map((_, i) => {
        const z = START_Z + i * ROW_SPACING - 0.7
        return (
          <group key={i}>
            {/* Left side step light */}
            <mesh position={[-1.2, 0.04, z]}>
              <boxGeometry args={[0.3, 0.04, 0.12]} />
              <meshStandardMaterial color="#100600" emissive="#ff6020" emissiveIntensity={0.8} />
            </mesh>
            {/* Right side step light */}
            <mesh position={[1.2, 0.04, z]}>
              <boxGeometry args={[0.3, 0.04, 0.12]} />
              <meshStandardMaterial color="#100600" emissive="#ff6020" emissiveIntensity={0.8} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function ExitSigns() {
  const exitTex = useMemo(() => typeof window !== 'undefined' ? makeExitTex() : null, [])

  if (!exitTex) return null

  const signs = [
    { pos: [-WALL_X + 0.1, 2.8,  14] as [number,number,number], rot: [0,  Math.PI / 2, 0] as [number,number,number] },
    { pos: [ WALL_X - 0.1, 2.8,  14] as [number,number,number], rot: [0, -Math.PI / 2, 0] as [number,number,number] },
    { pos: [-WALL_X + 0.1, 2.8, -8] as [number,number,number],  rot: [0,  Math.PI / 2, 0] as [number,number,number] },
    { pos: [ WALL_X - 0.1, 2.8, -8] as [number,number,number],  rot: [0, -Math.PI / 2, 0] as [number,number,number] },
  ]

  return (
    <group>
      {signs.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <planeGeometry args={[0.7, 0.26]} />
          <meshStandardMaterial
            map={exitTex}
            emissive="#00ff44"
            emissiveIntensity={0.6}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  )
}

function SpeakerPanels() {
  const SCREEN_Z = -15.8
  return (
    <group>
      {/* Left speaker panel */}
      <mesh position={[-8.5, 5.5, SCREEN_Z + 0.2]}>
        <boxGeometry args={[1.6, 5.0, 0.2]} />
        <meshStandardMaterial color="#0e0808" roughness={1} />
      </mesh>
      {/* Left speaker grille lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`lsg-${i}`} position={[-8.5, 3.4 + i * 0.55, SCREEN_Z + 0.31]}>
          <boxGeometry args={[1.3, 0.04, 0.02]} />
          <meshStandardMaterial color="#1a0e0e" roughness={1} />
        </mesh>
      ))}
      {/* Right speaker panel */}
      <mesh position={[8.5, 5.5, SCREEN_Z + 0.2]}>
        <boxGeometry args={[1.6, 5.0, 0.2]} />
        <meshStandardMaterial color="#0e0808" roughness={1} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`rsg-${i}`} position={[8.5, 3.4 + i * 0.55, SCREEN_Z + 0.31]}>
          <boxGeometry args={[1.3, 0.04, 0.02]} />
          <meshStandardMaterial color="#1a0e0e" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function Baseboard() {
  return (
    <group>
      <mesh position={[-WALL_X + 0.04, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, ROOM_D]} />
        <meshStandardMaterial color="#3a1a0a" roughness={0.9} />
      </mesh>
      <mesh position={[WALL_X - 0.04, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, ROOM_D]} />
        <meshStandardMaterial color="#3a1a0a" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export default function Decor() {
  return (
    <group>
      <AcousticPanels />
      <WallSconces />
      <ProsceniumArch />
      <CeilingDetail />
      <AisleStepLights />
      <ExitSigns />
      <SpeakerPanels />
      <Baseboard />
    </group>
  )
}
