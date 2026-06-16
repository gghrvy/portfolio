'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'

export default function TicketStub() {
  const visitorName = useTheaterStore(s => s.visitorName)
  const mode = useTheaterStore(s => s.mode)

  return (
    <AnimatePresence>
      {visitorName && mode !== 'ticket' && (
        <motion.div
          initial={{ y: -70, rotate: -6, opacity: 0 }}
          animate={{ y: 0, rotate: -4, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute', top: 18, right: 24,
            padding: '8px 14px',
            background: 'linear-gradient(170deg, #f3e9d2, #e8d9b8)',
            borderRadius: 4,
            boxShadow: '0 3px 12px rgba(0,0,0,0.5)',
            borderLeft: '2px dashed rgba(80,50,20,0.4)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, letterSpacing: '0.25em', color: 'rgba(80,50,20,0.6)' }}>
            ADMIT ONE · SCREEN 1
          </div>
          <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 12, fontWeight: 700, color: '#3a2410', textTransform: 'uppercase', marginTop: 2 }}>
            {visitorName}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
