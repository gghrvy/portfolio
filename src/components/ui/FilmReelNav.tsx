'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'
import { sounds } from '@/lib/theater/sounds'
import type { Section } from '@/lib/theater/cameraShots'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'lobby',    label: 'Lobby' },
  { id: 'about',    label: 'About' },
  { id: 'skills',   label: 'Skills' },
  { id: 'projects', label: 'Films' },
  { id: 'contact',  label: 'Contact' },
]

const sprocketStrip: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 4, padding: '6px 5px',
}

const sprocketHole: React.CSSProperties = {
  width: 6, height: 6, borderRadius: 2,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
}

export default function FilmReelNav() {
  const activeSection = useTheaterStore(s => s.activeSection)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const setSection = useTheaterStore(s => s.setSection)
  const mode = useTheaterStore(s => s.mode)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTransitioning || mode !== 'normal') return
      const idx = SECTIONS.findIndex(s => s.id === activeSection)
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSection(SECTIONS[(idx + 1) % SECTIONS.length].id)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSection(SECTIONS[(idx - 1 + SECTIONS.length) % SECTIONS.length].id)
      } else {
        const num = parseInt(e.key)
        if (num >= 1 && num <= 5) setSection(SECTIONS[num - 1].id)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeSection, isTransitioning, setSection, mode])

  return (
    <motion.nav
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      role="navigation"
      aria-label="Portfolio sections"
      style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center',
        background: 'rgba(8,6,10,0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '0 4px',
        pointerEvents: 'all',
        userSelect: 'none',
      }}
    >
      {/* Left sprocket strip — advances one frame on section change */}
      <div style={{ overflow: 'hidden' }} aria-hidden="true">
        <motion.div
          key={activeSection}
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={sprocketStrip}
        >
          {Array.from({ length: 5 }).map((_, i) => <div key={i} style={sprocketHole} />)}
        </motion.div>
      </div>

      {SECTIONS.map((s, i) => {
        const active = s.id === activeSection
        return (
          <button
            key={s.id}
            onClick={() => {
              if (isTransitioning || mode !== 'normal') return
              sounds.play('click')
              if (s.id === activeSection && s.id !== 'lobby') {
                setSection('lobby')
              } else {
                setSection(s.id)
              }
            }}
            disabled={isTransitioning || mode !== 'normal'}
            aria-current={active ? 'page' : undefined}
            aria-keyshortcuts={String(i + 1)}
            style={{
              position: 'relative', padding: '10px 20px',
              background: 'transparent', border: 'none',
              cursor: isTransitioning ? 'default' : 'pointer',
              fontFamily: "'Space Mono', monospace", fontSize: 9,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: active ? '#ffd27c' : 'rgba(255,255,255,0.32)',
              transition: 'color 0.25s',
              outline: 'none',
            }}
            onFocus={e => { (e.currentTarget as HTMLElement).style.outline = '2px solid rgba(255,210,124,0.5)' }}
            onBlur={e => { (e.currentTarget as HTMLElement).style.outline = 'none' }}
          >
            {s.label}
            {active && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  position: 'absolute', bottom: 6, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: '#ffd27c',
                  boxShadow: '0 0 6px #ffd27c',
                }}
              />
            )}
          </button>
        )
      })}

      {/* Right sprocket strip — advances one frame on section change */}
      <div style={{ overflow: 'hidden' }} aria-hidden="true">
        <motion.div
          key={activeSection}
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={sprocketStrip}
        >
          {Array.from({ length: 5 }).map((_, i) => <div key={i} style={sprocketHole} />)}
        </motion.div>
      </div>
    </motion.nav>
  )
}
