'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheaterStore } from '@/store/theaterStore'
import { PROJECTS } from '@/lib/theater/projectData'

type Phase = 'countdown' | 'title'

export default function FilmStartSequence() {
  const mode = useTheaterStore(s => s.mode)
  const pendingProject = useTheaterStore(s => s.pendingProject)
  const setMode = useTheaterStore(s => s.setMode)
  const setProject = useTheaterStore(s => s.setProject)
  const setSection = useTheaterStore(s => s.setSection)
  const setPendingProject = useTheaterStore(s => s.setPendingProject)

  const [phase, setPhase] = useState<Phase>('countdown')
  const [count, setCount] = useState(3)
  const [opacity, setOpacity] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const project = PROJECTS.find(p => p.id === pendingProject)

  useEffect(() => {
    if (mode !== 'film-start') {
      setPhase('countdown')
      setCount(3)
      setOpacity(0)
      return
    }

    timers.current.forEach(clearTimeout)
    timers.current = []

    const t = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms)
      timers.current.push(id)
    }

    setOpacity(0)
    setPhase('countdown')
    setCount(3)

    t(() => setOpacity(1), 50)
    t(() => setCount(2), 900)
    t(() => setCount(1), 1800)
    t(() => { setPhase('title'); setCount(3) }, 2700)
    t(() => setOpacity(0), 3400)
    t(() => {
      const pending = useTheaterStore.getState().pendingProject
      setProject(pending)
      setPendingProject(null)
      setSection('projects')
      setMode('normal')
    }, 3900)

    return () => timers.current.forEach(clearTimeout)
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  if (mode !== 'film-start') return null

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: '#050304',
      opacity,
      transition: 'opacity 0.45s ease',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'all',
    }}>
      {phase === 'countdown' && (
        <>
          <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 32 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.2)',
            }} />
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              width: 2, height: 56, transformOrigin: 'top center',
              background: 'linear-gradient(rgba(255,210,124,0.9), rgba(255,210,124,0))',
              animation: 'leaderSweep 1s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Clash Display', sans-serif",
              fontSize: 72, fontWeight: 600, color: '#fff',
            }}>
              {count}
            </div>
          </div>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(255,210,124,0.6)',
          }}>
            Now Presenting
          </p>
        </>
      )}

      {phase === 'title' && project && (
        <div style={{ textAlign: 'center', padding: '0 48px' }}>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: project.featured ? '#ffd27c' : '#b07cff', marginBottom: 20,
          }}>
            {project.genreTag}
          </p>
          <h1 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 52, fontWeight: 700, color: '#fff',
            lineHeight: 1.1, marginBottom: 16,
          }}>
            {project.title}
          </h1>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14, color: 'rgba(255,255,255,0.4)',
          }}>
            {project.role} · {project.year}
          </p>
        </div>
      )}
    </div>
  )
}
