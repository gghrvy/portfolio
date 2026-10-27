'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type PreviewShot = { id: string; src: string; width: number; height: number; tone: 'dark' | 'light' }

// Desktop: a frame in the empty column left of the project index that tracks the hovered or focused row.
// It never covers row text, and hides when that column is too narrow.
// Decorative only: every row already carries its name, outcome, role and stack as text.
export function IndexPreview({ shots }: { shots: PreviewShot[] }) {
  const frame = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(fine.matches)
    update()
    fine.addEventListener('change', update)
    return () => fine.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const list = document.querySelector<HTMLElement>('.work-index')
    const element = frame.current
    if (!enabled || !list || !element) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let raf = 0

    const place = () => { element.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0)` }
    const tick = () => {
      current.x += (target.x - current.x) * 0.18
      current.y += (target.y - current.y) * 0.18
      place()
      raf = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const room = () => list.getBoundingClientRect().left - 40
    const moveTo = (y: number, snap: boolean) => {
      const width = Math.min(320, room())
      element.style.width = `${width}px`
      target.x = list.getBoundingClientRect().left - width - 32
      target.y = y - element.offsetHeight / 2
      if (snap || reduced) { current.x = target.x; current.y = target.y; place(); return }
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const rowId = (node: EventTarget | null) => (node as Element | null)?.closest?.('.work-index a')?.getAttribute('href')?.slice(1) ?? null

    let inside = false
    const onMove = (event: PointerEvent) => {
      const row = (event.target as Element).closest?.('.work-index a')
      if (!row || room() < 200) return
      const rect = row.getBoundingClientRect()
      setActive(rowId(row))
      moveTo(rect.top + rect.height / 2, !inside)
      inside = true
    }
    const onLeave = () => { inside = false; setActive(null) }
    const onFocus = (event: FocusEvent) => {
      const row = (event.target as Element).closest('.work-index a')
      if (!row) return
      if (room() < 200) return
      const rect = row.getBoundingClientRect()
      setActive(rowId(row))
      moveTo(rect.top + rect.height / 2, true)
    }
    const onBlur = () => setActive(null)
    const onScroll = () => { if (!inside) setActive(null) }

    list.addEventListener('pointermove', onMove)
    list.addEventListener('pointerleave', onLeave)
    list.addEventListener('focusin', onFocus)
    list.addEventListener('focusout', onBlur)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      list.removeEventListener('pointermove', onMove)
      list.removeEventListener('pointerleave', onLeave)
      list.removeEventListener('focusin', onFocus)
      list.removeEventListener('focusout', onBlur)
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={frame} className="index-preview" data-visible={active !== null} aria-hidden="true">
      {shots.map((shot) => (
        <div key={shot.id} className="index-preview-shot" data-tone={shot.tone} data-active={shot.id === active}>
          <Image src={shot.src} alt="" width={shot.width} height={shot.height} sizes="360px" loading={shot.id === active ? 'eager' : 'lazy'} />
        </div>
      ))}
    </div>
  )
}
