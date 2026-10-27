// Runs work once the page has loaded and the main thread is idle, so it never competes with first paint.
export function whenIdle(task: () => void, timeout = 2000) {
  let handle = 0
  let cancelled = false
  const schedule = () => {
    if (cancelled) return
    if (typeof window.requestIdleCallback === 'function') handle = window.requestIdleCallback(task, { timeout })
    else handle = setTimeout(task, 300) as unknown as number
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
  return () => {
    cancelled = true
    window.removeEventListener('load', schedule)
    if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(handle)
    clearTimeout(handle)
  }
}

// Runs work on the first sign of user intent, or (if a fallback is given) that long after the page goes idle.
export function whenIntent(task: () => void, fallback?: number) {
  const events = ['pointermove', 'pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'] as const
  let done = false
  let timer = 0
  const run = () => {
    if (done) return
    done = true
    events.forEach((name) => window.removeEventListener(name, run))
    clearTimeout(timer)
    task()
  }
  events.forEach((name) => window.addEventListener(name, run, { passive: true, once: true }))
  const cancelIdle = fallback === undefined ? () => {} : whenIdle(() => { timer = setTimeout(run, fallback) as unknown as number })
  return () => {
    done = true
    events.forEach((name) => window.removeEventListener(name, run))
    clearTimeout(timer)
    cancelIdle()
  }
}
