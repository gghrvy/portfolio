'use client'

import { useEffect } from 'react'
import { useIdle } from '@/hooks/useIdle'
import { useTheaterStore } from '@/store/theaterStore'

const IDLE_MS = 60_000

export default function IntermissionController() {
  const idle = useIdle(IDLE_MS)
  const mode = useTheaterStore(s => s.mode)
  const setMode = useTheaterStore(s => s.setMode)

  useEffect(() => {
    if (idle && mode === 'normal') setMode('intermission')
    else if (!idle && mode === 'intermission') setMode('normal')
  }, [idle, mode, setMode])

  return null
}
