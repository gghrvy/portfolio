'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'

const KEY = 'hm-hints'

export default function Hints() {
  const [show, setShow] = useState(false)
  const mode = useTheaterStore(s => s.mode)

  // Re-arms on mode change so first-visit users see it after the ticket booth
  useEffect(() => {
    if (mode !== 'normal' || localStorage.getItem(KEY) === '1') return
    const t = setTimeout(() => {
      if (useTheaterStore.getState().mode === 'normal' &&
          useTheaterStore.getState().activeSection === 'lobby') setShow(true)
    }, 4000)
    return () => clearTimeout(t)
  }, [mode])

  useEffect(() => {
    if (!show) return
    const dismiss = () => {
      setShow(false)
      localStorage.setItem(KEY, '1')
    }
    window.addEventListener('pointerdown', dismiss, { once: true })
    window.addEventListener('keydown', dismiss, { once: true })
    return () => {
      window.removeEventListener('pointerdown', dismiss)
      window.removeEventListener('keydown', dismiss)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && mode === 'normal' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', bottom: 92, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(8,6,10,0.82)', backdropFilter: 'blur(10px)',
            padding: '12px 20px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.07)',
            pointerEvents: 'none', whiteSpace: 'nowrap',
            display: 'flex', gap: 20, alignItems: 'center',
          }}
        >
          {[
            { key: '↕ Scroll', desc: 'Navigate' },
            { key: '← →', desc: 'Arrow keys' },
            { key: '1–5', desc: 'Jump to section' },
            { key: 'Click', desc: 'Glowing objects' },
            { key: 'Drag', desc: 'Look around' },
          ].map(({ key, desc }) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,210,124,0.7)', marginBottom: 3 }}>{key}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{desc}</div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
