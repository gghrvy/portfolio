'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const timer = setTimeout(() => setState('idle'), 2200)
    return () => clearTimeout(timer)
  }, [state])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <>
      <button type="button" className="button button-ghost button-sm copy-email" onClick={copy} data-state={state}>
        {state === 'copied' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {state === 'copied' ? 'Copied' : 'Copy email'}
      </button>
      <span className="visually-hidden" role="status">{state === 'copied' ? 'Email address copied to clipboard' : state === 'failed' ? 'Copy failed, select the address instead' : ''}</span>
    </>
  )
}
