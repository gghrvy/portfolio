'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'
import { sounds } from '@/lib/theater/sounds'

export default function SoundToggle() {
  const soundOn = useTheaterStore(s => s.soundOn)
  const setSoundOn = useTheaterStore(s => s.setSoundOn)

  // Restore preference (browsers require a gesture to unlock audio anyway —
  // the stored preference only takes effect after the first click)
  useEffect(() => {
    if (!sounds.loadPreference()) setSoundOn(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { sounds.setMuted(!soundOn) }, [soundOn])

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4 }}
      onClick={() => setSoundOn(!soundOn)}
      aria-label={soundOn ? 'Mute sound' : 'Enable sound'}
      aria-pressed={soundOn}
      style={{
        position: 'absolute', bottom: 36, right: 28,
        width: 38, height: 38, borderRadius: 10,
        background: 'rgba(8,6,10,0.88)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: soundOn ? '#ffd27c' : 'rgba(255,255,255,0.35)',
        fontSize: 15, cursor: 'pointer', pointerEvents: 'all',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {soundOn ? '♪' : '♪̸'}
    </motion.button>
  )
}
