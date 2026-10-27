'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

function Poster() {
  return <div className="aria-presence" aria-hidden="true"><img src="/aria-presence-source.png" alt="" /></div>
}

const AriaPresence = dynamic(() => import('@/components/AriaPresence').then((mod) => mod.AriaPresence), { ssr: false, loading: Poster })

// Mounts the WebGL portrait only near the viewport, and stops its render loop when it scrolls away.
export function AriaVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setNear(true); preload.disconnect() } }, { rootMargin: '400px 0px' })
    const visible = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting))
    preload.observe(element)
    visible.observe(element)
    return () => { preload.disconnect(); visible.disconnect() }
  }, [])

  return <div ref={ref} className="aria-stage">{near ? <AriaPresence active={active} /> : <Poster />}</div>
}
