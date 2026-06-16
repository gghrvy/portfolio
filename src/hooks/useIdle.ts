'use client'

import { useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'] as const

export function useIdle(timeoutMs: number): boolean {
  const [idle, setIdle] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const reset = () => {
      setIdle(false)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setIdle(true), timeoutMs)
    }
    reset()
    for (const e of ACTIVITY_EVENTS) window.addEventListener(e, reset, { passive: true })
    return () => {
      if (timer.current) clearTimeout(timer.current)
      for (const e of ACTIVITY_EVENTS) window.removeEventListener(e, reset)
    }
  }, [timeoutMs])

  return idle
}
