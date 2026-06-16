'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'
import { sounds } from '@/lib/theater/sounds'

export default function TrailerButton() {
  const activeSection = useTheaterStore(s => s.activeSection)
  const mode = useTheaterStore(s => s.mode)
  const setMode = useTheaterStore(s => s.setMode)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)

  const show = activeSection === 'lobby' && mode === 'normal' && !isTransitioning

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          onClick={() => { sounds.play('click'); setMode('trailer') }}
          style={{
            position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
            padding: '9px 22px',
            background: 'rgba(8,6,10,0.85)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,210,124,0.35)', borderRadius: 10,
            color: '#ffd27c', fontFamily: "'Space Mono', monospace",
            fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
            cursor: 'pointer', pointerEvents: 'all',
          }}
        >
          ▶ Play Trailer
        </motion.button>
      )}
    </AnimatePresence>
  )
}
