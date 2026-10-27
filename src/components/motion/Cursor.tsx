'use client'

import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="tab"], label, input, textarea, select'

// A trailing ring for fine pointers. The native cursor stays; the ring only adds weight to targets.
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ring.current
    if (!element) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = { x: -100, y: -100 }
    const current = { x: -100, y: -100 }
    let frame = 0

    const tick = () => {
      current.x += (target.x - current.x) * 0.22
      current.y += (target.y - current.y) * 0.22
      element.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0)`
      frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.1 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      target.x = event.clientX
      target.y = event.clientY
      element.dataset.visible = 'true'
      element.dataset.active = String(!!(event.target as Element).closest?.(INTERACTIVE))
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onLeave = () => { element.dataset.visible = 'false' }
    const onDown = () => { element.dataset.pressed = 'true' }
    const onUp = () => { element.dataset.pressed = 'false' }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={ring} className="cursor" aria-hidden="true"><span /></div>
}
