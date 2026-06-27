'use client'

import { useEffect, Suspense } from 'react'
import { Html } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'
import AboutPanel from '@/components/panels/AboutPanel'
import SkillsPanel from '@/components/panels/SkillsPanel'
import ProjectPanel from '@/components/panels/ProjectPanel'

// Contact has no screen panel — it lives on the ReviewCard at the seat
const PANEL_MAP: Record<string, React.ComponentType> = {
  about:    AboutPanel,
  skills:   SkillsPanel,
  projects: ProjectPanel,
}

// Screen mesh sits at [0, 5.5, -15.8]. We place Html 0.2 units in front.
const SCREEN_POS: [number, number, number] = [0, 5.5, -15.6]

// Scales the Html in world space: at 5.7, the 860px-wide panel maps to
// ~13 world units, fitting inside the 14-unit-wide screen mesh.
const DISTANCE_FACTOR = 5.7

export default function ScreenPanel() {
  const activeSection   = useTheaterStore(s => s.activeSection)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const setSection      = useTheaterStore(s => s.setSection)

  const Panel = activeSection !== 'lobby' ? PANEL_MAP[activeSection] : null

  // Escape key: clear seat POV first, then return to lobby
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const state = useTheaterStore.getState()
      if (state.seatPov) { state.setSeatPov(null); return }
      if (activeSection !== 'lobby') setSection('lobby')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeSection, setSection])

  return (
    <Html
      transform
      position={SCREEN_POS}
      distanceFactor={DISTANCE_FACTOR}
      style={{
        width: 860,
        pointerEvents: (Panel && !isTransitioning) ? 'auto' : 'none',
      }}
    >
      <AnimatePresence mode="wait">
        {Panel && !isTransitioning && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 860,
              maxHeight: 460,
              overflowY: 'auto',
              padding: '28px 36px',
              boxSizing: 'border-box',
              borderTop: '1px solid rgba(200,146,42,0.35)',
              borderBottom: '1px solid rgba(200,146,42,0.35)',
              color: '#fff',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,210,124,0.3) transparent',
            }}
          >
            <Suspense fallback={null}>
              <Panel />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  )
}
