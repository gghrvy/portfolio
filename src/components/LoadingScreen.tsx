'use client'

import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import gsap from 'gsap'

// Film-leader countdown: number derived from load progress (3 → 2 → 1),
// sweep hand rotates continuously, iris-out reveal when done.
export default function LoadingScreen() {
  const { progress } = useProgress()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)

  const count = progress >= 100 ? 1 : 3 - Math.min(2, Math.floor(progress / 34))

  useEffect(() => {
    if (progress < 100 || leaving) return
    const el = ref.current
    if (!el) return
    setLeaving(true)
    // Safety fallback for headless/throttled-rAF environments
    const safetyTimer = setTimeout(() => setVisible(false), 1600)
    gsap.fromTo(el,
      { clipPath: 'circle(75% at 50% 50%)' },
      {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.9, delay: 0.45, ease: 'power2.inOut',
        onComplete: () => { clearTimeout(safetyTimer); setVisible(false) },
      },
    )
    return () => clearTimeout(safetyTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  // Hard maximum: dismiss after 4s regardless (headless guard)
  useEffect(() => {
    const maxTimer = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(maxTimer)
  }, [])

  if (!visible) return null

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0a0806',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 28,
      }}
    >
      {/* Film flicker */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        animation: 'leaderFlicker 0.12s infinite',
        background: 'rgba(255,255,255,0.015)',
      }} />

      {/* Countdown circle */}
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.25)',
        }} />
        {/* Inner ring */}
        <div style={{
          position: 'absolute', inset: 14, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
        }} />
        {/* Crosshair lines */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        {/* Sweep hand */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 2, height: 76, transformOrigin: 'top center',
          background: 'linear-gradient(rgba(255,210,124,0.9), rgba(255,210,124,0))',
          animation: 'leaderSweep 1s linear infinite',
        }} />
        {/* The number */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Clash Display', sans-serif",
          fontSize: 84, fontWeight: 600, color: '#fff',
        }}>
          {count}
        </div>
      </div>

      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10, letterSpacing: '0.35em',
        color: 'rgba(255,210,124,0.7)', textTransform: 'uppercase',
      }}>
        ★ Premiere Night · Harvy Monte de Ramos ★
      </p>

      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em',
      }}>
        {Math.round(progress)}%
      </p>

      <style>{`
        @keyframes leaderFlicker {
          0%, 100% { opacity: 1 } 50% { opacity: 0.96 }
        }
        @keyframes leaderSweep {
          from { transform: rotate(0deg) } to { transform: rotate(360deg) }
        }
      `}</style>
    </div>
  )
}
