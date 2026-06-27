'use client'

import { motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'

export default function CVDownloadButton() {
  const mode = useTheaterStore(s => s.mode)

  if (mode !== 'normal') return null

  return (
    <motion.a
      href="/cv.pdf"
      download
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute', bottom: 28, left: 28,
        display: 'flex', flexDirection: 'column', gap: 2,
        padding: '8px 14px',
        background: 'rgba(8,6,10,0.88)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,210,124,0.2)',
        borderLeft: '3px solid rgba(255,210,124,0.5)',
        borderRadius: 6,
        textDecoration: 'none',
        pointerEvents: 'all',
        cursor: 'pointer',
      }}
    >
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 7, letterSpacing: '0.25em', textTransform: 'uppercase',
        color: 'rgba(255,210,124,0.5)',
      }}>
        Press Kit
      </span>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.7)',
      }}>
        Download CV
      </span>
    </motion.a>
  )
}
