'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, CanvasTexture } from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'
import { PROJECTS } from '@/lib/theater/projectData'
import type { Section } from '@/lib/theater/cameraShots'
import type { TheaterMode } from '@/lib/theater/lightingStates'

const SECTION_BACKGROUNDS: Record<Section, { inner: string; outer: string }> = {
  lobby:    { inner: '#120d08', outer: '#040305' },
  about:    { inner: '#08101a', outer: '#030408' },
  skills:   { inner: '#0e0a18', outer: '#050407' },
  projects: { inner: '#1a1208', outer: '#050407' },
  contact:  { inner: '#081410', outer: '#030505' },
}

const W = 1280
const H = 720

// Adds subtle film grain to the canvas
function addGrain(ctx: CanvasRenderingContext2D, amount = 18) {
  const imageData = ctx.getImageData(0, 0, W, H)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * amount
    data[i]     = Math.min(255, Math.max(0, data[i]     + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
  ctx.putImageData(imageData, 0, 0)
}

// Adds a cinematic vignette to the canvas
function addVignette(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.85)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, 'rgba(0,0,0,0.75)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)
}

// Letterbox bars — widescreen 2.39:1 feel
function addLetterbox(ctx: CanvasRenderingContext2D) {
  const barH = 52
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, W, barH)
  ctx.fillRect(0, H - barH, W, barH)
}

function buildScreenTexture(
  activeProject: string | null,
  activeSection: Section = 'lobby',
  mode: TheaterMode = 'normal',
  trailerStep = 0,
): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')!

  const project = PROJECTS.find(p => p.id === activeProject)

  // ── TRAILER TITLE CARDS ─────────────────────────────────────────────────
  if (mode === 'trailer') {
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.8)
    bg.addColorStop(0, '#14100a'); bg.addColorStop(1, '#040305')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
    addGrain(ctx, 14); addVignette(ctx)
    ctx.textAlign = 'center'
    if (trailerStep === 0) {
      ctx.fillStyle = 'rgba(200,146,42,0.7)'; ctx.font = '500 14px monospace'; ctx.letterSpacing = '0.4em'
      ctx.fillText('A PORTFOLIO BY', W / 2, H / 2 - 70)
      ctx.fillStyle = '#fff'; ctx.font = '200 92px sans-serif'; ctx.letterSpacing = '0.08em'
      ctx.fillText('HARVY', W / 2, H / 2 + 20)
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '300 20px sans-serif'; ctx.letterSpacing = '0.2em'
      ctx.fillText('FRONTEND DEVELOPER · AI BUILDER', W / 2, H / 2 + 70)
    } else {
      ctx.fillStyle = 'rgba(200,146,42,0.7)'; ctx.font = '500 14px monospace'; ctx.letterSpacing = '0.4em'
      ctx.fillText('NOW SHOWING', W / 2, 120)
      ctx.fillStyle = '#fff'
      PROJECTS.forEach((p, i) => {
        ctx.font = '600 34px sans-serif'; ctx.letterSpacing = '0.04em'
        ctx.fillText(p.title.toUpperCase(), W / 2, 220 + i * 110)
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '400 14px monospace'
        ctx.fillText(`${p.year} · ${p.status.toUpperCase()}`, W / 2, 250 + i * 110)
        ctx.fillStyle = '#fff'
      })
    }
    addLetterbox(ctx)
    return new CanvasTexture(canvas)
  }

  // ── INTERMISSION CARD ───────────────────────────────────────────────────
  if (mode === 'intermission') {
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.8)
    bg.addColorStop(0, '#161008'); bg.addColorStop(1, '#040305')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
    addGrain(ctx, 16); addVignette(ctx)
    ctx.fillStyle = 'rgba(200,146,42,0.5)'; ctx.fillRect(0, 52, W, 1); ctx.fillRect(0, H - 52, W, 1)
    ctx.fillStyle = 'rgba(200,146,42,0.8)'
    ctx.font = '500 16px monospace'; ctx.letterSpacing = '0.5em'; ctx.textAlign = 'center'
    ctx.fillText('· INTERMISSION ·', W / 2, H / 2 - 40)
    ctx.fillStyle = '#ffffff'; ctx.font = '300 64px sans-serif'; ctx.letterSpacing = '0.15em'
    ctx.fillText("WE'LL BE RIGHT BACK", W / 2, H / 2 + 30)
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '400 13px monospace'; ctx.letterSpacing = '0.2em'
    ctx.fillText('MOVE THE MOUSE TO RESUME', W / 2, H / 2 + 80)
    addLetterbox(ctx)
    return new CanvasTexture(canvas)
  }

  // Panel sections render DOM content over the screen (ScreenPanel) —
  // the texture provides atmosphere only, no title card text behind it.
  if (activeSection !== 'lobby') {
    const tint = SECTION_BACKGROUNDS[activeSection]
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.8)
    bg.addColorStop(0, tint.inner)
    bg.addColorStop(1, tint.outer)
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

    addGrain(ctx, 14)
    addVignette(ctx)

    // Thin accent rules top and bottom
    ctx.fillStyle = 'rgba(200,146,42,0.5)'
    ctx.fillRect(0, 52, W, 1)
    ctx.fillRect(0, H - 52, W, 1)

    addLetterbox(ctx)
    return new CanvasTexture(canvas)
  }

  if (project) {
    // ── PROJECT TITLE CARD ────────────────────────────────────────────────
    const accentColor = project.featured ? '#c8922a' : '#7a58c8'
    const accentLight = project.featured ? '#ffd27c' : '#b07cff'

    // Background — dark atmosphere, color-tinted
    const bg = ctx.createRadialGradient(W * 0.35, H * 0.45, 0, W * 0.5, H * 0.5, W * 0.75)
    bg.addColorStop(0, project.featured ? '#1a1208' : '#0e0a18')
    bg.addColorStop(1, '#050407')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

    addGrain(ctx, 14)
    addVignette(ctx)

    // Thin accent line — top
    ctx.fillStyle = accentColor
    ctx.fillRect(0, 52, W, 1.5)

    // "A FILM BY" — small caps label
    ctx.fillStyle = `rgba(${project.featured ? '200,146,42' : '122,88,200'},0.65)`
    ctx.font = '500 13px monospace'
    ctx.letterSpacing = '0.35em'
    ctx.textAlign = 'center'
    ctx.fillText('A FILM BY', W / 2, 90)

    // Director name
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.font = '400 18px sans-serif'
    ctx.letterSpacing = '0.18em'
    ctx.fillText('HARVY MONTE DE RAMOS', W / 2, 118)

    // Divider
    ctx.fillStyle = `rgba(${project.featured ? '200,146,42' : '122,88,200'},0.25)`
    ctx.fillRect(W / 2 - 40, 132, 80, 1)

    // Genre tag
    ctx.fillStyle = accentLight
    ctx.font = '500 14px monospace'
    ctx.letterSpacing = '0.2em'
    ctx.textAlign = 'center'
    ctx.fillText(project.genreTag.toUpperCase(), W / 2, 168)

    // TITLE — large, dominant
    ctx.fillStyle = '#ffffff'
    ctx.letterSpacing = '-0.02em'
    const titleSize = project.title.length > 14 ? 78 : 96
    ctx.font = `700 ${titleSize}px sans-serif`
    ctx.textAlign = 'center'

    // Word wrap for long titles
    const words = project.title.split(' ')
    let line = ''; let ty = H / 2 - 10
    const lines: string[] = []
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > W - 180) { lines.push(line); line = word }
      else { line = test }
    }
    if (line) lines.push(line)
    const lineH = titleSize * 1.1
    ty = H / 2 - ((lines.length - 1) * lineH) / 2 + 20
    lines.forEach(l => { ctx.fillText(l, W / 2, ty); ty += lineH })

    // Year & status
    ctx.fillStyle = 'rgba(255,255,255,0.28)'
    ctx.font = '400 16px monospace'
    ctx.letterSpacing = '0.15em'
    const statusColor = project.status === 'Deployed' || project.status === 'Production'
      ? '#4ade80' : project.status === 'Live Demo' ? '#60a5fa' : '#fbbf24'
    ctx.fillText(`${project.year}`, W / 2, H - 100)

    // Status dot
    ctx.fillStyle = statusColor
    ctx.font = '500 15px monospace'
    ctx.fillText(`● ${project.status.toUpperCase()}`, W / 2, H - 76)

    // Thin accent line — bottom
    ctx.fillStyle = accentColor
    ctx.fillRect(0, H - 52, W, 1.5)

    addLetterbox(ctx)

  } else {
    // ── DEFAULT — DIRECTOR'S TITLE CARD ──────────────────────────────────

    // Deep atmospheric background, tinted per section
    const tint = SECTION_BACKGROUNDS[activeSection]
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.8)
    bg.addColorStop(0, tint.inner)
    bg.addColorStop(1, tint.outer)
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

    addGrain(ctx, 16)
    addVignette(ctx)

    // Top letterbox rule
    ctx.fillStyle = 'rgba(200,146,42,0.5)'
    ctx.fillRect(0, 52, W, 1)

    // "PREMIERE NIGHT" label
    ctx.fillStyle = 'rgba(200,146,42,0.55)'
    ctx.font = '500 12px monospace'
    ctx.letterSpacing = '0.5em'
    ctx.textAlign = 'center'
    ctx.fillText('PREMIERE NIGHT', W / 2, 88)

    // Divider
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.fillRect(W / 2 - 80, 100, 160, 0.8)

    // "A FILM BY" credit
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '400 15px monospace'
    ctx.letterSpacing = '0.3em'
    ctx.fillText('A FILM BY', W / 2, 135)

    // HARVY — the main title, huge
    ctx.fillStyle = '#ffffff'
    ctx.font = '200 110px sans-serif'
    ctx.letterSpacing = '0.08em'
    ctx.textAlign = 'center'
    ctx.fillText('HARVY', W / 2, H / 2 - 10)

    // Subtitle — MONTE DE RAMOS in smaller weight
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '300 36px sans-serif'
    ctx.letterSpacing = '0.22em'
    ctx.fillText('MONTE DE RAMOS', W / 2, H / 2 + 46)

    // Tagline
    ctx.fillStyle = 'rgba(200,146,42,0.7)'
    ctx.fillRect(W / 2 - 120, H / 2 + 70, 240, 0.8)

    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.font = '400 14px sans-serif'
    ctx.letterSpacing = '0.12em'
    ctx.fillText('FRONTEND DEVELOPER  ·  AI BUILDER  ·  CEBU', W / 2, H / 2 + 98)

    // Bottom rule
    ctx.fillStyle = 'rgba(200,146,42,0.5)'
    ctx.fillRect(0, H - 52, W, 1)

    // Bottom label
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.font = '400 11px monospace'
    ctx.letterSpacing = '0.3em'
    ctx.fillText('SELECT A FILM FROM THE POSTER WALL  ·  EXPLORE BELOW', W / 2, H - 24)

    addLetterbox(ctx)
  }

  return new CanvasTexture(canvas)
}

const SCREEN_GEOM = { w: 14, h: 7.5 }
const SCREEN_Z = -15.8

// Gilded proscenium frame dimensions
const PFRAME_W = 15.6
const PFRAME_H = 9.0
const PBAR    = 0.5   // bar thickness
const PDEPTH  = 0.12  // bar depth (z)
const PGOLD   = { color: '#6a4e10' as const, metalness: 0.85, roughness: 0.15, emissive: '#b87818' as const, emissiveIntensity: 0.45 }

function Proscenium() {
  return (
    <group>
      {/* Top bar */}
      <mesh position={[0, PFRAME_H / 2 - PBAR / 2, -0.05]}>
        <boxGeometry args={[PFRAME_W, PBAR, PDEPTH]} />
        <meshStandardMaterial {...PGOLD} />
      </mesh>
      {/* Bottom bar */}
      <mesh position={[0, -(PFRAME_H / 2 - PBAR / 2), -0.05]}>
        <boxGeometry args={[PFRAME_W, PBAR, PDEPTH]} />
        <meshStandardMaterial {...PGOLD} />
      </mesh>
      {/* Left bar */}
      <mesh position={[-(PFRAME_W / 2 - PBAR / 2), 0, -0.05]}>
        <boxGeometry args={[PBAR, PFRAME_H - PBAR * 2, PDEPTH]} />
        <meshStandardMaterial {...PGOLD} />
      </mesh>
      {/* Right bar */}
      <mesh position={[PFRAME_W / 2 - PBAR / 2, 0, -0.05]}>
        <boxGeometry args={[PBAR, PFRAME_H - PBAR * 2, PDEPTH]} />
        <meshStandardMaterial {...PGOLD} />
      </mesh>
      {/* Valance header — wider crown above frame */}
      <mesh position={[0, PFRAME_H / 2 + 0.42, -0.07]}>
        <boxGeometry args={[PFRAME_W + 2.2, 0.72, 0.16]} />
        <meshStandardMaterial color="#5a4010" metalness={0.75} roughness={0.2} emissive="#9a6808" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

export default function Screen() {
  const meshRef = useRef<Mesh>(null)
  const overlayRef = useRef<Mesh>(null)
  const curtainLRef = useRef<Mesh>(null)
  const curtainRRef = useRef<Mesh>(null)
  const prevTexture = useRef<CanvasTexture | null>(null)
  const activeProject = useTheaterStore(s => s.activeProject)
  const activeSection = useTheaterStore(s => s.activeSection)
  const mode = useTheaterStore(s => s.mode)
  const reduced = useReducedMotion()
  const [trailerStep, setTrailerStep] = useState(0)

  // Trailer timeline broadcasts which title card to show
  useEffect(() => {
    const onCard = (e: Event) => setTrailerStep((e as CustomEvent<number>).detail)
    window.addEventListener('trailer-card', onCard)
    return () => window.removeEventListener('trailer-card', onCard)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !meshRef.current) return
    const mat = meshRef.current.material as any
    const oldTex = mat.map as CanvasTexture | null
    const tex = buildScreenTexture(activeProject, activeSection, mode, trailerStep)
    mat.map = tex
    mat.emissiveMap = tex
    mat.needsUpdate = true

    // Crossfade: show the old texture on the overlay and fade it out
    const overlay = overlayRef.current
    if (overlay && oldTex && !reduced) {
      const oMat = overlay.material as any
      if (prevTexture.current) prevTexture.current.dispose()
      prevTexture.current = oldTex
      oMat.map = oldTex
      oMat.needsUpdate = true
      gsap.fromTo(oMat, { opacity: 1 }, { opacity: 0, duration: 0.8, ease: 'power2.out' })
    } else if (oldTex) {
      oldTex.dispose()
    }
  }, [activeProject, activeSection, mode, trailerStep, reduced])

  useFrame(({ clock }) => {
    if (reduced) return
    const t = clock.elapsedTime
    // Grain shimmer — faint emissive oscillation like a running projector
    if (meshRef.current) {
      const mat = meshRef.current.material as any
      mat.emissiveIntensity = 1.1 + Math.sin(t * 6.3) * 0.018 + Math.sin(t * 17.1) * 0.008
    }
    // Slow HVAC-like curtain sway
    if (curtainLRef.current) curtainLRef.current.rotation.z = Math.sin(t * 0.45) * 0.012
    if (curtainRRef.current) curtainRRef.current.rotation.z = Math.sin(t * 0.45 + 1.3) * 0.012
  })

  return (
    <group position={[0, 5.5, SCREEN_Z]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[SCREEN_GEOM.w, SCREEN_GEOM.h]} />
        <meshStandardMaterial
          color="#e8eef4"
          emissive="#d0dce8"
          emissiveIntensity={1.1}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Crossfade overlay — holds the outgoing texture and fades out */}
      <mesh ref={overlayRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[SCREEN_GEOM.w, SCREEN_GEOM.h]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Black frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[SCREEN_GEOM.w + 0.4, SCREEN_GEOM.h + 0.4]} />
        <meshStandardMaterial color="#030205" roughness={1} />
      </mesh>

      <Proscenium />

      {/* Left curtain */}
      <mesh ref={curtainLRef} position={[-(SCREEN_GEOM.w / 2 + 0.9), 0, 0.05]}>
        <planeGeometry args={[1.6, SCREEN_GEOM.h + 2]} />
        <meshStandardMaterial color="#5a0a0a" roughness={0.95} />
      </mesh>

      {/* Right curtain */}
      <mesh ref={curtainRRef} position={[(SCREEN_GEOM.w / 2 + 0.9), 0, 0.05]}>
        <planeGeometry args={[1.6, SCREEN_GEOM.h + 2]} />
        <meshStandardMaterial color="#5a0a0a" roughness={0.95} />
      </mesh>
    </group>
  )
}
