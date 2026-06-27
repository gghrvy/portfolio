'use client'

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import TheaterScene from './TheaterScene'
import ScreenPanel from './ScreenPanel'
import TicketBooth from './TicketBooth'
import Trailer from './Trailer'
import LoadingScreen from '@/components/LoadingScreen'
import FilmReelNav from '@/components/ui/FilmReelNav'
import SoundToggle from '@/components/ui/SoundToggle'
import TrailerButton from '@/components/ui/TrailerButton'
import TicketStub from '@/components/ui/TicketStub'
import Hints from '@/components/ui/Hints'
import CustomCursor from '@/components/ui/CustomCursor'
import IntermissionController from './IntermissionController'
import FilmStartSequence from './FilmStartSequence'
import NowShowingMarquee from '@/components/ui/NowShowingMarquee'
import IntermissionOverlay from './IntermissionOverlay'
import SeatPovOverlay from '@/components/ui/SeatPovOverlay'
import CVDownloadButton from '@/components/ui/CVDownloadButton'
import KonamiEgg from '@/components/ui/KonamiEgg'
import { useTheaterStore } from '@/store/theaterStore'
import type { Section } from '@/lib/theater/cameraShots'
import { sounds } from '@/lib/theater/sounds'
import { PROJECTS } from '@/lib/theater/projectData'

// DOM-rendered ticket form — always visible, always interactive, no Canvas dependency.
function TicketBoothOverlay() {
  const mode = useTheaterStore(s => s.mode)
  const setVisitorName = useTheaterStore(s => s.setVisitorName)
  const [name, setName] = useState('')
  const [printing, setPrinting] = useState(false)

  if (mode !== 'ticket') return null

  const issue = (visitor: string) => {
    if (printing) return
    setPrinting(true)
    sounds.play('chatter')
    localStorage.setItem('hm-visited', '1')
    setVisitorName(visitor.trim() || 'GUEST')
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        pointerEvents: 'all',
        width: 280, padding: '24px',
        background: 'rgba(12,8,6,0.96)', backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,180,71,0.35)', borderRadius: 12,
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.25em', color: '#ffb347', textTransform: 'uppercase', marginBottom: 8 }}>
          Box Office
        </p>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
          One ticket for tonight&apos;s premiere. Your name?
        </p>
        <form onSubmit={e => { e.preventDefault(); issue(name) }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            placeholder="Your name"
            autoFocus
            style={{
              width: '100%', padding: '8px 12px', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6, color: '#fff', fontSize: 13,
              fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none',
              textAlign: 'center', marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button type="submit" disabled={printing} style={{
              padding: '7px 16px', background: 'rgba(255,180,71,0.14)',
              border: '1px solid rgba(255,180,71,0.5)', borderRadius: 6,
              color: '#ffb347', fontFamily: "'Space Mono', monospace",
              fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer',
            }}>
              {printing ? 'PRINTING…' : 'GET TICKET'}
            </button>
            <button type="button" disabled={printing} onClick={() => issue('GUEST')} style={{
              padding: '7px 14px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6,
              color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Mono', monospace",
              fontSize: 10, letterSpacing: '0.12em', cursor: 'pointer',
            }}>
              SKIP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Plain-HTML resume for browsers without WebGL2 (and crawlers)
function WebGLFallback() {
  return (
    <div style={{ minHeight: '100vh', background: '#0c0a0e', color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '48px 20px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: '#ffd27c', textTransform: 'uppercase', marginBottom: 10 }}>Portfolio · Text Version</p>
        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Harvy H. Monte de Ramos</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>Frontend & Full Stack Developer · Cebu, PH</p>
        <p style={{ fontSize: 12, color: '#4ade80', marginBottom: 28 }}>● Open to work · Graduating June 2026 (USJ-R)</p>

        <h2 style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Experience</h2>
        <p style={{ fontSize: 14, fontWeight: 600 }}>Frontend Developer Intern — Xeleqt AI, Cebu City (Mar–Jun 2026)</p>
        <ul style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', paddingLeft: 18, marginBottom: 28 }}>
          <li>Production web interfaces for 3 products — Next.js, React, TypeScript, AWS Amplify, Railway</li>
          <li>Real-time 3D digital-twin dashboards — Three.js, Mapbox GL, Deck.gl</li>
          <li>Role-based auth and CRUD systems — Laravel, MySQL</li>
          <li>Manual regression testing across 15+ features on Android and iOS</li>
        </ul>

        <h2 style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Projects</h2>
        <div style={{ marginBottom: 28 }}>
          {PROJECTS.map(p => (
            <div key={p.id} style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{p.title} <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>— {p.role} · {p.year} · {p.status}</span></p>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>{p.description}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>Contact</h2>
        <p style={{ fontSize: 13, lineHeight: 2 }}>
          <a href="mailto:ggtempestt@gmail.com" style={{ color: '#ffd27c' }}>ggtempestt@gmail.com</a><br />
          <a href="https://github.com/ggkyle" style={{ color: 'rgba(255,255,255,0.6)' }}>github.com/ggkyle</a><br />
          <a href="https://linkedin.com/in/harvy-monte-de-ramos" style={{ color: 'rgba(255,255,255,0.6)' }}>linkedin.com/in/harvy-monte-de-ramos</a><br />
          <a href="/cv.pdf" style={{ color: 'rgba(255,255,255,0.6)' }}>Download CV (PDF)</a>
        </p>
      </div>
    </div>
  )
}

function detectWebGL2(): boolean {
  if (typeof window === 'undefined') return true
  const canvas = document.createElement('canvas')
  return !!canvas.getContext('webgl2')
}

function WIPNote() {
  const mode = useTheaterStore(s => s.mode)
  const activeSection = useTheaterStore(s => s.activeSection)
  if (mode !== 'normal' || activeSection !== 'lobby') return null
  return (
    <div style={{
      position: 'absolute',
      bottom: 90,
      left: '50%',
      transform: 'translateX(-50%)',
      fontFamily: "'Space Mono', monospace",
      fontSize: 10,
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: 'rgba(255,210,124,0.75)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(6px)',
      padding: '6px 16px',
      borderRadius: 4,
      border: '1px solid rgba(255,210,124,0.15)',
    }}>
      ✦ still learning · improving every day ✦
    </div>
  )
}

export default function TheaterApp() {
  const setMode = useTheaterStore(s => s.setMode)
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always')
  const [dpr, setDpr] = useState(1.5)

  // First visit: start at the box office, ticket in hand before the lobby
  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('hm-visited') !== '1') {
      setMode('ticket')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Stop rendering entirely while the tab is hidden
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Deep linking — read ?section= on mount, write on every change
  const activeSection = useTheaterStore(s => s.activeSection)
  const setSection = useTheaterStore(s => s.setSection)

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('section')
    const valid: Section[] = ['lobby', 'about', 'skills', 'projects', 'contact']
    if (param && valid.includes(param as Section)) {
      // Delay until after ticket mode check (which runs in useLayoutEffect)
      const t = setTimeout(() => {
        if (useTheaterStore.getState().mode === 'normal') {
          setSection(param as Section)
        }
      }, 100)
      return () => clearTimeout(t)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const url = activeSection === 'lobby'
      ? window.location.pathname
      : `${window.location.pathname}?section=${activeSection}`
    history.replaceState(null, '', url)
  }, [activeSection])

  // Scroll to navigate sections — throttled to prevent runaway skipping
  const scrollCooldown = useRef(false)
  useEffect(() => {
    const SECTIONS: Section[] = ['lobby', 'about', 'skills', 'projects', 'contact']
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return  // pinch-to-zoom on touchpad — let OrbitControls handle it
      if (Math.abs(e.deltaY) < 50) return  // ignore touchpad micro-scrolls
      const { mode, isTransitioning, activeSection, setSection } = useTheaterStore.getState()
      if (mode !== 'normal' || isTransitioning || scrollCooldown.current) return
      scrollCooldown.current = true
      setTimeout(() => { scrollCooldown.current = false }, 900)
      const idx = SECTIONS.indexOf(activeSection as Section)
      if (e.deltaY > 0 && idx < SECTIONS.length - 1) setSection(SECTIONS[idx + 1])
      else if (e.deltaY < 0 && idx > 0) setSection(SECTIONS[idx - 1])
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // WebGL context loss recovery
  const [webglLost, setWebglLost] = useState(false)
  useEffect(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const onLost = () => setWebglLost(true)
    canvas.addEventListener('webglcontextlost', onLost)
    return () => canvas.removeEventListener('webglcontextlost', onLost)
  }, [])

  if (!detectWebGL2() || webglLost) return <WebGLFallback />

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#08060a' }}>
      {/* Three.js canvas — ScreenPanel lives inside here as Html transform */}
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        frameloop={frameloop}
        dpr={dpr}
        camera={{ fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        >
          <Suspense fallback={null}>
            <TheaterScene />
          </Suspense>
          <ScreenPanel />
          <TicketBooth />
          <Trailer />
        </PerformanceMonitor>
      </Canvas>

      {/* DOM overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
        <NowShowingMarquee />
        <FilmStartSequence />
        <TicketBoothOverlay />
        <FilmReelNav />
        <SoundToggle />
        <TrailerButton />
        <TicketStub />
        <Hints />
        <IntermissionController />
        <IntermissionOverlay />
        <SeatPovOverlay />
        <CVDownloadButton />
        <KonamiEgg />
        <WIPNote />
      </div>

      <LoadingScreen />
      <CustomCursor />

      {/* ARIA live region for section announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        id="theater-announcer"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      />
    </div>
  )
}
