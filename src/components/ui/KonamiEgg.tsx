'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SEQUENCE = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
]

export default function KonamiEgg() {
  const progress = useRef(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === SEQUENCE[progress.current]) {
        progress.current++
        if (progress.current === SEQUENCE.length) {
          progress.current = 0
          setActive(true)
          setTimeout(() => setActive(false), 3500)
        }
      } else {
        progress.current = 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', inset: 0, zIndex: 999,
            background: 'rgba(5,3,7,0.97)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
            pointerEvents: 'none',
          }}
        >
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(255,210,124,0.6)',
          }}>
            Cheat Code Activated
          </p>
          <h2 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: 36, fontWeight: 700, color: '#fff', textAlign: 'center',
          }}>
            +30 Lives.<br />Still shipping code.
          </h2>
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13, color: 'rgba(255,255,255,0.25)',
          }}>
            ggtempestt@gmail.com
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
