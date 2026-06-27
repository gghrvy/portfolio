'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'

const SECTION_LABELS: Record<string, string> = {
  lobby:    'Grand Lobby',
  about:    'Director\'s Notes',
  skills:   'Production Credits',
  projects: 'Now Showing',
  contact:  'Box Office',
}

export default function NowShowingMarquee() {
  const activeSection = useTheaterStore(s => s.activeSection)
  const mode = useTheaterStore(s => s.mode)

  if (mode === 'ticket' || mode === 'film-start') return null

  const label = SECTION_LABELS[activeSection] ?? activeSection

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 28, overflow: 'hidden',
      background: 'rgba(6,4,8,0.92)',
      borderBottom: '1px solid rgba(255,210,124,0.12)',
      display: 'flex', alignItems: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', gap: 5, padding: '0 14px', flexShrink: 0 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: '50%',
            background: '#ffd27c', boxShadow: '0 0 4px #ffd27c', opacity: 0.7,
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={activeSection}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(255,210,124,0.75)', whiteSpace: 'nowrap',
          }}
        >
          ★ {label} ★
        </motion.p>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 5, padding: '0 14px', flexShrink: 0, marginLeft: 'auto' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: '50%',
            background: '#ffd27c', boxShadow: '0 0 4px #ffd27c', opacity: 0.7,
          }} />
        ))}
      </div>
    </div>
  )
}
