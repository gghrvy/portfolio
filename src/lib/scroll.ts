import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) { lenis = instance }
export function getLenis() { return lenis }

export function lockScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll() {
  document.documentElement.style.overflow = ''
  lenis?.start()
}
