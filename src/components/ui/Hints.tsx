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
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', bottom: 92, left: '50%', transform: 'translateX(-50%)',
            fontFamily: "'Space Mono', monospace", fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            background: 'rgba(8,6,10,0.7)', backdropFilter: 'blur(8px)',
            padding: '8px 18px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}
        >
          Drag to look around · Click anything that glows
        </motion.p>
      )}
    </AnimatePresence>
  )
}
