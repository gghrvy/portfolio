'use client'

import { Suspense, useEffect, useLayoutEffect, useState } from 'react'
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
import { useTheaterStore } from '@/store/theaterStore'
import { PROJECTS } from '@/lib/theater/projectData'

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

  if (!detectWebGL2()) return <WebGLFallback />

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
        <FilmReelNav />
        <SoundToggle />
        <TrailerButton />
        <TicketStub />
        <Hints />
        <IntermissionController />
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
