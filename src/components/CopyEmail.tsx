'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from '@/lib/toast'

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast(`Copied ${email}`)
    } catch {
      toast('Couldn’t copy. Select the address and copy it instead.', 'error')
    }
  }

  return (
    <button type="button" className="button button-ghost button-sm copy-email" onClick={copy} data-state={copied ? 'copied' : 'idle'}>
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy email'}
    </button>
  )
}
