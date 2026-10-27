'use client'

import { useEffect, useState } from 'react'

// Renders a fixed-width placeholder on the server so the live clock never shifts layout.
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone })
    const tick = () => setTime(format.format(new Date()))
    tick()
    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [timeZone])

  return <time className="local-time" suppressHydrationWarning>{time ?? '--:--'}</time>
}
