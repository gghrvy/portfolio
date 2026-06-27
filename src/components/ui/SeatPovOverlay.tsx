'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'

export default function SeatPovOverlay() {
  const seatPov = useTheaterStore(s => s.seatPov)
  const setSeatPov = useTheaterStore(s => s.setSeatPov)

  return (
    <AnimatePresence>
      {seatPov && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', bottom: 80, right: 28, pointerEvents: 'all' }}
        >
          <button
            onClick={() => setSeatPov(null)}
            style={{
              padding: '8px 18px',
              background: 'rgba(8,6,10,0.88)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Space Mono', monospace",
              fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            ↑ Stand Up
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
