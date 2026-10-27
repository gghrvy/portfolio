'use client'

import { ArrowRight, Command, Copy, Download, FileText, Mail, SunMoon } from 'lucide-react'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6'
import { useEffect, useMemo, useRef, useState } from 'react'
import { switchTheme } from '@/components/ThemeToggle'
import { contact } from '@/content/profile'
import { projects } from '@/content/projects'
import { getLenis, lockScroll, unlockScroll } from '@/lib/scroll'
import { toast } from '@/lib/toast'

type Item = { id: string; group: 'Go to' | 'Actions'; label: string; hint?: string; icon: React.ReactNode; run: () => void }

export const OPEN_PALETTE = 'palette:open'

function goTo(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(target, { offset: -72, immediate: reduced })
  else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  const heading = target.querySelector<HTMLElement>('h1, h2, h3')
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }) }
}

function buildItems(): Item[] {
  const sections = [['work', 'Selected work'], ...projects.map((p) => [p.id, p.name]), ['aria', 'Aria'], ['about', 'About'], ['skills', 'Skills'], ['experience', 'Experience'], ['contact', 'Contact']]
  const go: Item[] = sections.map(([id, label]) => ({ id: `go-${id}`, group: 'Go to', label, hint: [...projects.map((p) => p.id), 'aria'].includes(id) ? 'Case study' : 'Section', icon: <ArrowRight size={16} aria-hidden="true" />, run: () => goTo(id) }))
  const actions: Item[] = [
    { id: 'copy-email', group: 'Actions', label: 'Copy email address', hint: contact.email, icon: <Copy size={16} aria-hidden="true" />, run: () => { navigator.clipboard.writeText(contact.email).then(() => toast(`Copied ${contact.email}`), () => toast('Couldn’t copy. Select the address and copy it instead.', 'error')) } },
    { id: 'email', group: 'Actions', label: 'Write an email', hint: 'Opens your mail app', icon: <Mail size={16} aria-hidden="true" />, run: () => { window.location.href = `mailto:${contact.email}` } },
    { id: 'theme', group: 'Actions', label: 'Switch theme', hint: 'Light / dark', icon: <SunMoon size={16} aria-hidden="true" />, run: () => switchTheme() },
    { id: 'resume', group: 'Actions', label: 'Open resume', hint: 'PDF, new tab', icon: <FileText size={16} aria-hidden="true" />, run: () => { window.open(contact.resume, '_blank', 'noopener') } },
    { id: 'resume-download', group: 'Actions', label: 'Download resume', hint: 'PDF', icon: <Download size={16} aria-hidden="true" />, run: () => { const link = document.createElement('a'); link.href = contact.resume; link.download = 'Harvy-Monte-de-Ramos-Resume.pdf'; link.click() } },
    { id: 'github', group: 'Actions', label: 'GitHub profile', hint: 'New tab', icon: <FaGithub aria-hidden="true" />, run: () => { window.open(contact.github, '_blank', 'noopener') } },
    { id: 'linkedin', group: 'Actions', label: 'LinkedIn profile', hint: 'New tab', icon: <FaLinkedinIn aria-hidden="true" />, run: () => { window.open(contact.linkedin, '_blank', 'noopener') } },
  ]
  return [...go, ...actions]
}

export function CommandPalette() {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const items = useMemo(buildItems, [])
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? items.filter((item) => `${item.label} ${item.hint ?? ''} ${item.group}`.toLowerCase().includes(q)) : items
  }, [items, query])

  useEffect(() => {
    const open = () => {
      const element = dialog.current
      if (!element || element.open) return
      setQuery('')
      setActive(0)
      element.showModal()
      lockScroll()
      input.current?.focus()
    }
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (dialog.current?.open) dialog.current.close(); else open() }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE, open)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(OPEN_PALETTE, open) }
  }, [])

  useEffect(() => { setActive(0) }, [query])
  useEffect(() => {
    document.getElementById(`cmd-${matches[active]?.id}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, matches])

  const execute = (item: Item | undefined) => {
    if (!item) return
    dialog.current?.close()
    window.setTimeout(item.run, 0)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => (i + 1) % Math.max(matches.length, 1)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => (i - 1 + matches.length) % Math.max(matches.length, 1)) }
    else if (event.key === 'Home') { event.preventDefault(); setActive(0) }
    else if (event.key === 'End') { event.preventDefault(); setActive(Math.max(matches.length - 1, 0)) }
    else if (event.key === 'Enter') { event.preventDefault(); execute(matches[active]) }
  }

  const groups = (['Go to', 'Actions'] as const).map((group) => ({ group, entries: matches.filter((item) => item.group === group) })).filter((g) => g.entries.length)

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Command palette"
      onClose={unlockScroll}
      onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close() }}
    >
      <div className="palette-inner">
        <div className="palette-search">
          <Command size={16} aria-hidden="true" />
          <input
            ref={input}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={matches[active] ? `cmd-${matches[active].id}` : undefined}
            aria-autocomplete="list"
            aria-label="Search sections and actions"
            placeholder="Jump to a section or run an action…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </div>
        <div className="palette-list" id="palette-list" role="listbox" aria-label="Results">
          {groups.length === 0 && <p className="palette-empty">No matches for “{query}”.</p>}
          {groups.map(({ group, entries }) => (
            <div key={group} role="group" aria-label={group}>
              <p className="palette-group" aria-hidden="true">{group}</p>
              {entries.map((item) => {
                const index = matches.indexOf(item)
                return (
                  <div
                    key={item.id}
                    id={`cmd-${item.id}`}
                    role="option"
                    aria-selected={index === active}
                    className="palette-option"
                    onPointerMove={() => setActive(index)}
                    onClick={() => execute(item)}
                  >
                    {item.icon}
                    <span className="palette-label">{item.label}</span>
                    {item.hint && <span className="palette-hint">{item.hint}</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <p className="palette-foot" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> run · <kbd>Esc</kbd> close</p>
      </div>
    </dialog>
  )
}

// Header affordance so the palette is discoverable without knowing the shortcut.
export function CommandButton() {
  const [mac, setMac] = useState(false)
  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), [])
  return (
    <button type="button" className="command-button" onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE))} aria-label="Open command palette" aria-keyshortcuts={mac ? 'Meta+K' : 'Control+K'}>
      <kbd>{mac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd>
    </button>
  )
}
