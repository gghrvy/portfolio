'use client'

import Image from 'next/image'
import { AnimatePresence, LazyMotion, MotionConfig, m } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Shot } from '@/content/projects'
import { lockScroll, unlockScroll } from '@/lib/scroll'

const loadFeatures = () => import('./motion-features').then((mod) => mod.default)
const signal = [0.2, 0, 0, 1] as const
const exit = [0.4, 0, 1, 1] as const
const enterSlow = { duration: 0.42, ease: signal }
const enterBase = { duration: 0.24, ease: signal }
const leave = { duration: 0.18, ease: exit }

export type GalleryProps = { id: string; shots: Shot[]; name: string }

// Interactive layer, loaded by GalleryShell only when the gallery nears the viewport.
export default function InteractiveGallery({ id, shots, name }: GalleryProps) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [spot, setSpot] = useState<number | null>(null)
  const [tourOpen, setTourOpen] = useState(false)
  const expandRef = useRef<HTMLButtonElement>(null)
  const main = shots[active]
  const ratio = `${shots[0].width} / ${shots[0].height}`

  useEffect(() => setMounted(true), [])

  const onThumbKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (active + step + shots.length) % shots.length
    show(next)
    event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
  }

  const show = (index: number) => {
    const next = (index + shots.length) % shots.length
    setDirection(next > active || (active === shots.length - 1 && next === 0) ? 1 : -1)
    setActive(next)
    setSpot(null)
  }

  const hotspots = main.hotspots ?? []
  // On narrow screens the tour list is collapsed until asked for; tapping a marker opens it.
  const toggleSpot = (index: number) => {
    setTourOpen(true)
    setSpot((current) => (current === index ? null : index))
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <>
          <figure className="gallery-main">
            <div className="plate gallery-stage" style={{ aspectRatio: ratio }}>
              {!open && (
                <m.div className="gallery-frame" layoutId={`${id}-shot`} transition={enterSlow}>
                  <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    <m.div
                      key={main.src}
                      className="gallery-image"
                      initial={{ opacity: 0, x: 28 * direction }}
                      animate={{ opacity: 1, x: 0, transition: enterBase }}
                      exit={{ opacity: 0, x: -16 * direction, transition: leave }}
                    >
                      <Image src={main.src} alt={main.alt} width={main.width} height={main.height} sizes="(max-width: 900px) 100vw, 62vw" />
                    </m.div>
                  </AnimatePresence>
                </m.div>
              )}
              {!open && hotspots.length > 0 && (
                <div className="hotspots island-dark" style={{ aspectRatio: `${main.width} / ${main.height}` }}>
                  {hotspots.map((hotspot, index) => (
                    <button
                      key={hotspot.title}
                      type="button"
                      className="hotspot"
                      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, '--i': index } as React.CSSProperties}
                      aria-label={`${index + 1}. ${hotspot.title}`}
                      aria-pressed={spot === index}
                      aria-controls={`${id}-tour`}
                      onClick={() => toggleSpot(index)}
                    >
                      <span aria-hidden="true">{index + 1}</span>
                    </button>
                  ))}
                </div>
              )}
              <button ref={expandRef} type="button" className="gallery-expand" onClick={() => setOpen(true)} aria-label={`Expand ${main.label}`} aria-haspopup="dialog">
                <Maximize2 size={15} aria-hidden="true" /><span>Expand</span>
              </button>
            </div>
            <figcaption aria-live="polite"><span>{main.label}</span><p>{main.note}</p></figcaption>
            {hotspots.length > 0 && (
              <button type="button" className="tour-toggle" aria-expanded={tourOpen} aria-controls={`${id}-tour`} onClick={() => setTourOpen((value) => !value)}>
                What to look at <span>({hotspots.length})</span>
              </button>
            )}
            {hotspots.length > 0 && (
              <ol className="tour" id={`${id}-tour`} data-collapsed={!tourOpen} aria-label={`What to look at in ${main.label}`}>
                {hotspots.map((hotspot, index) => (
                  <li key={hotspot.title} data-active={spot === index}>
                    <button type="button" className="tour-item" aria-expanded={spot === index} onClick={() => toggleSpot(index)}>
                      <span className="tour-num" aria-hidden="true">{index + 1}</span>
                      <span className="tour-title">{hotspot.title}</span>
                    </button>
                    {spot === index && <p className="tour-body">{hotspot.body}</p>}
                  </li>
                ))}
              </ol>
            )}
          </figure>

          <div className="gallery-thumbs" role="group" aria-label={`${name} screens. Use arrow keys to switch.`} onKeyDown={onThumbKey}>
            {shots.map((shot, index) => (
              <button key={shot.src} type="button" className="gallery-thumb plate" aria-pressed={index === active} aria-label={`Show ${shot.label}`} onClick={() => show(index)}>
                <Image src={shot.src} alt="" width={shot.width} height={shot.height} sizes="(max-width: 900px) 33vw, 20vw" />
                {index === active && <m.span className="gallery-thumb-indicator" layoutId={`${id}-indicator`} transition={enterBase} aria-hidden="true" />}
              </button>
            ))}
          </div>

          {mounted && createPortal(
            <AnimatePresence onExitComplete={() => expandRef.current?.focus()}>
              {open && <Lightbox key="lightbox" id={id} name={name} shots={shots} active={active} onShow={show} onClose={() => setOpen(false)} />}
            </AnimatePresence>,
            document.body,
          )}
        </>
      </MotionConfig>
    </LazyMotion>
  )
}

function Lightbox({ id, name, shots, active, onShow, onClose }: { id: string; name: string; shots: Shot[]; active: number; onShow: (index: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const shot = shots[active]

  useEffect(() => {
    lockScroll()
    closeRef.current?.focus()
    return () => unlockScroll()
  }, [])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose() }
    if (event.key === 'ArrowRight') onShow(active + 1)
    if (event.key === 'ArrowLeft') onShow(active - 1)
    if (event.key !== 'Tab' || !dialog.current) return
    const focusable = [...dialog.current.querySelectorAll<HTMLElement>('button')]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return (
    <m.div
      ref={dialog}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} screens`}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: enterBase }}
      exit={{ opacity: 0, transition: leave }}
    >
      <div className="lightbox-bar">
        <p><span>{String(active + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}</span> {shot.label}</p>
        <button ref={closeRef} type="button" className="lightbox-button" onClick={onClose} aria-label="Close"><X size={18} aria-hidden="true" /></button>
      </div>
      <div className="lightbox-stage" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <m.div className="lightbox-frame" layoutId={`${id}-shot`} transition={enterSlow}>
          <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="100vw" />
        </m.div>
      </div>
      <div className="lightbox-foot">
        <p>{shot.note}</p>
        <div>
          <button type="button" className="lightbox-button" onClick={() => onShow(active - 1)} aria-label="Previous screen"><ChevronLeft size={18} aria-hidden="true" /></button>
          <button type="button" className="lightbox-button" onClick={() => onShow(active + 1)} aria-label="Next screen"><ChevronRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </m.div>
  )
}
