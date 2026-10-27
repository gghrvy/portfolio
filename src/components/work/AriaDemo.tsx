'use client'

import { useEffect, useRef, useState } from 'react'
import { aria } from '@/content/projects'

const STEP_MS = 520

// A scripted walkthrough: pick a question, watch it route. Clearly labelled as a concept, not a live model.
export function AriaDemo() {
  const [choice, setChoice] = useState(0)
  const [step, setStep] = useState(3)
  const timers = useRef<number[]>([])
  const run = aria.demo[choice]

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const play = (index: number) => {
    timers.current.forEach(clearTimeout)
    setChoice(index)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStep(3); return }
    setStep(0)
    timers.current = [1, 2, 3].map((next) => window.setTimeout(() => setStep(next), next * STEP_MS))
  }

  const low = run.confidence < 0.6
  const stages = [
    { label: 'Incoming request', text: run.question },
    { label: 'Intent', text: `${run.intent} · confidence ${run.confidence.toFixed(2)}` },
    { label: low ? 'Clarification' : 'Aria retrieves', text: run.retrieves },
    { label: 'Response state', text: run.response },
  ]

  return (
    <div className="aria-demo">
      <p className="aria-demo-label">Try a request <span>Scripted demo</span></p>
      <div className="aria-demo-prompts" role="group" aria-label="Example requests">
        {aria.demo.map((item, index) => (
          <button key={item.question} type="button" className="aria-prompt" aria-pressed={index === choice} onClick={() => play(index)}>
            {item.question}
          </button>
        ))}
      </div>
      <ol className="aria-example" aria-label="How Aria routes this request" data-low={low}>
        {stages.map((stage, index) => (
          <li key={stage.label} data-state={index < step || step === 3 ? 'done' : index === step ? 'active' : 'pending'}>
            <span>{stage.label}</span>
            <strong>{index <= step ? stage.text : '…'}</strong>
          </li>
        ))}
      </ol>
      <p className="visually-hidden" aria-live="polite">{step === 3 ? `${stages[1].text}. ${stages[3].text}` : ''}</p>
    </div>
  )
}
