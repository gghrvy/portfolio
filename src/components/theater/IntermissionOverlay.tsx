'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'

export default function IntermissionOverlay() {
  const mode = useTheaterStore(s => s.mode)
  const setMode = useTheaterStore(s => s.setMode)

  useEffect(() => {
    if (mode !== 'intermission') return
    const dismiss = () => setMode('normal')
    window.addEventListener('pointerdown', dismiss, { once: true })
    window.addEventListener('keydown', dismiss, { once: true })
    return () => {
      window.removeEventListener('pointerdown', dismiss)
      window.removeEventListener('keydown', dismiss)
    }
  }, [mode, setMode])

  return (
    <AnimatePresence>
      {mode === 'intermission' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute', inset: 0, zIndex: 40,
            background: 'rgba(5,3,7,0.96)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 20,
            pointerEvents: 'all',
          }}
        >
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'rgba(255,210,124,0.5)',
          }}>
            Premiere Night · Harvy Monte de Ramos
          </p>

          <h1 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 56, fontWeight: 700, color: '#fff',
            letterSpacing: '0.06em', textAlign: 'center',
          }}>
            INTERMISSION
          </h1>

          <div style={{
            width: 64, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,210,124,0.4), transparent)',
          }} />

          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13, color: 'rgba(255,255,255,0.3)',
            maxWidth: 320, textAlign: 'center', lineHeight: 1.7,
          }}>
            The show resumes shortly.<br />
            Grab some popcorn.
          </p>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)', marginTop: 24,
          }}>
            Click anywhere to continue
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
