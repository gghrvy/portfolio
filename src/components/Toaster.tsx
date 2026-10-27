'use client'

import { Check, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ToastTone } from '@/lib/toast'

type Toast = { id: number; message: string; tone: ToastTone }

// A single polite live region; the latest toast replaces the previous one.
export function Toaster() {
  const [current, setCurrent] = useState<Toast | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let hide = 0
    const onToast = (event: Event) => {
      const { message, tone } = (event as CustomEvent<{ message: string; tone: ToastTone }>).detail
      setCurrent({ id: Date.now(), message, tone })
      setVisible(true)
      window.clearTimeout(hide)
      hide = window.setTimeout(() => setVisible(false), 2600)
    }
    window.addEventListener('toast', onToast)
    return () => { window.removeEventListener('toast', onToast); window.clearTimeout(hide) }
  }, [])

  return (
    <div className="toaster" role="status" aria-live="polite" aria-atomic="true">
      {current && (
        <p key={current.id} className="toast" data-tone={current.tone} data-visible={visible}>
          {current.tone === 'success' ? <Check size={16} aria-hidden="true" /> : <TriangleAlert size={16} aria-hidden="true" />}
          {current.message}
        </p>
      )}
    </div>
  )
}
