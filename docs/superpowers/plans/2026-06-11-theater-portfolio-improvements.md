# Theater Portfolio Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 3D cinema theater portfolio from a decorative backdrop with floating modals into a fully immersive experience where the cinema screen IS the content surface and all major 3D objects navigate sections on click.

**Architecture:** Replace the DOM-overlay `PanelShell` modal with a `ScreenPanel` component that uses `@react-three/drei`'s `<Html transform>` to render panel content directly on the cinema screen mesh in 3D space. Rework all 5 camera shots to face the screen. Add a `hoveredZone` field to the Zustand store so `CustomCursor` can show a label when hovering 3D interactive objects.

**Tech Stack:** Next.js 16, React 19, Three.js, `@react-three/fiber`, `@react-three/drei` (Html), Framer Motion, GSAP, Zustand

**Spec:** `docs/superpowers/specs/2026-06-11-theater-portfolio-improvements-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/lib/theater/cameraShots.ts` | Modify | Camera positions — all 5 shots now face the screen |
| `src/store/theaterStore.ts` | Modify | Add `hoveredZone: Section \| null` + `setHoveredZone` |
| `src/__tests__/theaterStore.test.ts` | Modify | Tests for `hoveredZone` |
| `src/components/theater/Seats.tsx` | Modify | Call `setHoveredZone('about')` on hover |
| `src/components/theater/ProjectionBooth.tsx` | Modify | Call `setHoveredZone('skills')` on hover |
| `src/components/theater/BoxOffice.tsx` | Modify | Call `setHoveredZone('contact')` on hover |
| `src/components/theater/PosterFrames.tsx` | Modify | Call `setHoveredZone('projects')` on hover |
| `src/components/ui/CustomCursor.tsx` | Modify | Subscribe to `hoveredZone`, expand ring + show section label |
| `src/components/theater/Screen.tsx` | Modify | Add per-section background tint to `buildScreenTexture` |
| `src/components/theater/ScreenPanel.tsx` | **Create** | `<Html transform>` overlay on the screen mesh |
| `src/components/ui/FilmReelNav.tsx` | Modify | Clicking active section returns to lobby |
| `src/components/theater/TheaterApp.tsx` | Modify | Remove `<PanelShell />`, add `<ScreenPanel />` inside Canvas |
| `src/components/panels/PanelShell.tsx` | **Delete** | Replaced by `ScreenPanel` |
| `src/components/panels/AboutPanel.tsx` | Modify | Tighten sizes to fit screen proportions |
| `src/components/panels/ProjectPanel.tsx` | Modify | Left accent bar + year in list view |

---

## Task 1: Update Camera Shots

**Files:**
- Modify: `src/lib/theater/cameraShots.ts`
- Test: `src/__tests__/cameraShots.test.ts` (existing — no changes needed, just verify it still passes)

- [ ] **Step 1: Run the existing test to confirm baseline**

```bash
npx vitest run src/__tests__/cameraShots.test.ts
```
Expected: all 3 tests pass.

- [ ] **Step 2: Update all 5 shots in `cameraShots.ts`**

Replace the entire `CAMERA_SHOTS` constant (lines 10-16):

```ts
export const CAMERA_SHOTS: Record<ShotName, CameraShot> = {
  LOBBY:       { position: [0, 5.5, 10],  target: [0, 5.5, -15] },
  THE_SEAT:    { position: [0, 2.8, 3],   target: [0, 5.5, -15] },
  THE_BOOTH:   { position: [-6, 8, 10],   target: [0, 5.5, -15] },
  NOW_SHOWING: { position: [0, 5.5, -2],  target: [0, 5.5, -15] },
  BOX_OFFICE:  { position: [5, 3.5, 7],   target: [0, 5.5, -15] },
}
```

- [ ] **Step 3: Run the test again**

```bash
npx vitest run src/__tests__/cameraShots.test.ts
```
Expected: all 3 tests still pass (tests only check structure, not specific values).

- [ ] **Step 4: Commit**

```bash
git add src/lib/theater/cameraShots.ts
git commit -m "feat: rework all camera shots to face the screen"
```

---

## Task 2: Add `hoveredZone` to Store

**Files:**
- Modify: `src/store/theaterStore.ts`
- Modify: `src/__tests__/theaterStore.test.ts`

- [ ] **Step 1: Write failing tests first**

Add two new test cases to `src/__tests__/theaterStore.test.ts`. Also update `beforeEach` to reset `hoveredZone`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useTheaterStore } from '../store/theaterStore'

describe('theaterStore', () => {
  beforeEach(() => {
    useTheaterStore.setState({
      activeSection: 'lobby',
      activeProject: null,
      isTransitioning: false,
      hoveredZone: null,
    })
  })

  it('starts at lobby section', () => {
    expect(useTheaterStore.getState().activeSection).toBe('lobby')
  })

  it('setSection updates activeSection', () => {
    useTheaterStore.getState().setSection('about')
    expect(useTheaterStore.getState().activeSection).toBe('about')
  })

  it('setProject updates activeProject', () => {
    useTheaterStore.getState().setProject('digital-twin')
    expect(useTheaterStore.getState().activeProject).toBe('digital-twin')
  })

  it('setTransitioning locks the flag', () => {
    useTheaterStore.getState().setTransitioning(true)
    expect(useTheaterStore.getState().isTransitioning).toBe(true)
  })

  it('setSection to projects does not auto-set activeProject', () => {
    useTheaterStore.getState().setSection('projects')
    expect(useTheaterStore.getState().activeProject).toBeNull()
  })

  it('hoveredZone starts null', () => {
    expect(useTheaterStore.getState().hoveredZone).toBeNull()
  })

  it('setHoveredZone updates hoveredZone', () => {
    useTheaterStore.getState().setHoveredZone('about')
    expect(useTheaterStore.getState().hoveredZone).toBe('about')
  })

  it('setHoveredZone can be cleared to null', () => {
    useTheaterStore.getState().setHoveredZone('skills')
    useTheaterStore.getState().setHoveredZone(null)
    expect(useTheaterStore.getState().hoveredZone).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to confirm new tests fail**

```bash
npx vitest run src/__tests__/theaterStore.test.ts
```
Expected: `hoveredZone starts null`, `setHoveredZone updates hoveredZone`, and `setHoveredZone can be cleared to null` fail with `TypeError: ... is not a function` or similar.

- [ ] **Step 3: Update `theaterStore.ts`**

Replace the entire file:

```ts
import { create } from 'zustand'
import type { Section } from '@/lib/theater/cameraShots'

interface TheaterStore {
  activeSection: Section
  activeProject: string | null
  isTransitioning: boolean
  hoveredZone: Section | null
  setSection: (s: Section) => void
  setProject: (id: string | null) => void
  setTransitioning: (v: boolean) => void
  setHoveredZone: (zone: Section | null) => void
}

export const useTheaterStore = create<TheaterStore>((set) => ({
  activeSection: 'lobby',
  activeProject: null,
  isTransitioning: false,
  hoveredZone: null,
  setSection: (activeSection) => set({ activeSection }),
  setProject: (activeProject) => set({ activeProject }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  setHoveredZone: (hoveredZone) => set({ hoveredZone }),
}))
```

- [ ] **Step 4: Run all store tests**

```bash
npx vitest run src/__tests__/theaterStore.test.ts
```
Expected: all 8 tests pass.

- [ ] **Step 5: Run full test suite to check nothing broke**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/store/theaterStore.ts src/__tests__/theaterStore.test.ts
git commit -m "feat: add hoveredZone to theater store"
```

---

## Task 3: Wire `hoveredZone` Into 3D Interactive Components

All four interactive components already have hover/click logic. We're adding `setHoveredZone` calls alongside the existing pointer handlers.

**Files:**
- Modify: `src/components/theater/Seats.tsx`
- Modify: `src/components/theater/ProjectionBooth.tsx`
- Modify: `src/components/theater/BoxOffice.tsx`
- Modify: `src/components/theater/PosterFrames.tsx`

- [ ] **Step 1: Update `Seats.tsx`**

Add `setHoveredZone` to the store destructure (after `isTransitioning`):

```ts
const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
```

Update the invisible click target's pointer handlers (the `<mesh>` at the bottom of the component, lines 124-132):

```tsx
<mesh
  position={[HIGHLIGHT_X, 1.6, HIGHLIGHT_Z]}
  onPointerEnter={() => {
    if (!isTransitioning) {
      setHovered(true)
      setHoveredZone('about')
      document.body.style.cursor = 'pointer'
    }
  }}
  onPointerLeave={() => {
    setHovered(false)
    setHoveredZone(null)
    document.body.style.cursor = 'default'
  }}
  onClick={() => { if (!isTransitioning) setSection('about') }}
>
  <boxGeometry args={[CUSHION_W + 0.4, 1.4, CUSHION_D + 0.4]} />
  <meshBasicMaterial transparent opacity={0} depthWrite={false} />
</mesh>
```

- [ ] **Step 2: Update `ProjectionBooth.tsx`**

Add `setHoveredZone` to store destructure after `isTransitioning`:

```ts
const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
```

Update the `handlers` object:

```ts
const handlers = {
  onPointerEnter: () => {
    if (!isTransitioning) {
      setHovered(true)
      setHoveredZone('skills')
      document.body.style.cursor = 'pointer'
    }
  },
  onPointerLeave: () => {
    setHovered(false)
    setHoveredZone(null)
    document.body.style.cursor = 'default'
  },
  onClick: () => { if (!isTransitioning) setSection('skills') },
}
```

- [ ] **Step 3: Update `BoxOffice.tsx`**

Add `setHoveredZone` to store destructure after `isTransitioning`:

```ts
const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
```

Update the sign mesh's pointer handlers:

```tsx
onPointerEnter={() => {
  if (!isTransitioning) {
    setHovered(true)
    setHoveredZone('contact')
    document.body.style.cursor = 'pointer'
  }
}}
onPointerLeave={() => {
  setHovered(false)
  setHoveredZone(null)
  document.body.style.cursor = 'default'
}}
onClick={() => { if (!isTransitioning) setSection('contact') }}
```

- [ ] **Step 4: Update `PosterFrames.tsx`**

In the `PosterFrame` component, add `setHoveredZone` to store destructure (after `isTransitioning`):

```ts
const setHoveredZone = useTheaterStore(s => s.setHoveredZone)
```

Update the poster face mesh's `onPointerEnter` and `onPointerLeave` (lines 69-78):

```tsx
onPointerEnter={() => {
  if (!isTransitioning) {
    setHovered(true)
    setHoveredZone('projects')
    document.body.style.cursor = 'pointer'
  }
}}
onPointerLeave={() => {
  setHovered(false)
  setHoveredZone(null)
  document.body.style.cursor = 'default'
}}
```

- [ ] **Step 5: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass (no logic tests for these components, but existing tests must not break).

- [ ] **Step 6: Commit**

```bash
git add src/components/theater/Seats.tsx src/components/theater/ProjectionBooth.tsx src/components/theater/BoxOffice.tsx src/components/theater/PosterFrames.tsx
git commit -m "feat: broadcast hoveredZone from all interactive 3D objects"
```

---

## Task 4: Upgrade `CustomCursor` for Zone Labels

When `hoveredZone` is set, the cursor ring expands to 64px and shows a label (ABOUT, SKILLS, FILMS, CONTACT).

**Files:**
- Modify: `src/components/ui/CustomCursor.tsx`

- [ ] **Step 1: Replace `CustomCursor.tsx` with the upgraded version**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'

const ZONE_LABELS: Partial<Record<string, string>> = {
  about:    'ABOUT',
  skills:   'SKILLS',
  projects: 'FILMS',
  contact:  'CONTACT',
}

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const hoveredZone = useTheaterStore(s => s.hoveredZone)

  // Mouse tracking + DOM interactive detection
  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) {
      dot.style.display  = 'none'
      ring.style.display = 'none'
      return
    }

    const moveDot   = gsap.quickTo(dot,  'x', { duration: 0.1, ease: 'power3' })
    const moveDotY  = gsap.quickTo(dot,  'y', { duration: 0.1, ease: 'power3' })
    const moveRing  = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })

    const onMove = (e: MouseEvent) => {
      moveDot(e.clientX);  moveDotY(e.clientY)
      moveRing(e.clientX); moveRingY(e.clientY)
    }

    const onDomEnter = () => {
      gsap.to(dot,  { scale: 0, duration: 0.2 })
      gsap.to(ring, { scale: 2.2, borderColor: '#4f8ef7', backgroundColor: 'rgba(79,142,247,0.08)', duration: 0.3 })
    }

    const onDomLeave = () => {
      gsap.to(dot,  { scale: 1, duration: 0.2 })
      gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'transparent', duration: 0.3 })
    }

    const onClick = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
    }

    let domHovered = false
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      const isInteractive = target.closest('button, a, [data-cursor-hover], input, textarea, [role="button"]')
      if (isInteractive && !domHovered) { domHovered = true;  onDomEnter() }
      else if (!isInteractive && domHovered) { domHovered = false; onDomLeave() }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('click', onClick)
    document.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      document.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  // React to 3D zone hover
  useEffect(() => {
    const ring  = ringRef.current
    const label = labelRef.current
    if (!ring || !label) return

    if (hoveredZone) {
      label.textContent = ZONE_LABELS[hoveredZone] ?? ''
      gsap.to(ring,  { width: 64, height: 64, duration: 0.25, ease: 'power2.out' })
      gsap.to(label, { opacity: 1, duration: 0.15, delay: 0.15 })
    } else {
      gsap.to(ring,  { width: 36, height: 36, duration: 0.2, ease: 'power2.in' })
      gsap.to(label, { opacity: 0, duration: 0.1 })
    }
  }, [hoveredZone])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6,
          backgroundColor: '#ffffff', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 36, height: 36,
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'transparent',
          willChange: 'transform',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 7, letterSpacing: '0.12em',
            color: '#fff', opacity: 0,
            whiteSpace: 'nowrap', pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CustomCursor.tsx
git commit -m "feat: expand cursor ring with zone label on 3D hover"
```

---

## Task 5: Add Per-Section Background Tints to Screen

When the user navigates to a section, the screen's atmospheric CanvasTexture updates to a section-specific tint.

**Files:**
- Modify: `src/components/theater/Screen.tsx`

- [ ] **Step 1: Update `Screen.tsx`**

Add the `Section` import and `SECTION_BACKGROUNDS` map, then thread `activeSection` through `buildScreenTexture` and the `useEffect`.

Replace the top of the file (imports + `buildScreenTexture` default state only — the project title card block is unchanged):

```tsx
'use client'

import { useRef, useEffect } from 'react'
import { Mesh, CanvasTexture } from 'three'
import { useTheaterStore } from '@/store/theaterStore'
import { PROJECTS } from '@/lib/theater/projectData'
import type { Section } from '@/lib/theater/cameraShots'
```

Add the `SECTION_BACKGROUNDS` constant after the imports:

```ts
const SECTION_BACKGROUNDS: Record<Section, { inner: string; outer: string }> = {
  lobby:    { inner: '#120d08', outer: '#040305' },
  about:    { inner: '#08101a', outer: '#030408' },
  skills:   { inner: '#0e0a18', outer: '#050407' },
  projects: { inner: '#1a1208', outer: '#050407' },
  contact:  { inner: '#081410', outer: '#030505' },
}
```

Change the `buildScreenTexture` signature to accept `activeSection`:

```ts
function buildScreenTexture(activeProject: string | null, activeSection: Section = 'lobby'): CanvasTexture {
```

Inside `buildScreenTexture`, in the `else` branch (default title card), replace the hardcoded background gradient:

```ts
// was:
const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.8)
bg.addColorStop(0, '#120d08')
bg.addColorStop(1, '#040305')

// becomes:
const tint = SECTION_BACKGROUNDS[activeSection]
const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.8)
bg.addColorStop(0, tint.inner)
bg.addColorStop(1, tint.outer)
```

In the `Screen` component, subscribe to `activeSection` and thread it through:

```tsx
export default function Screen() {
  const meshRef = useRef<Mesh>(null)
  const activeProject = useTheaterStore(s => s.activeProject)
  const activeSection = useTheaterStore(s => s.activeSection)

  useEffect(() => {
    if (typeof window === 'undefined' || !meshRef.current) return
    const mat = meshRef.current.material as any
    if (mat.map) mat.map.dispose()
    const tex = buildScreenTexture(activeProject, activeSection)
    mat.map = tex
    mat.emissiveMap = tex
    mat.needsUpdate = true
  }, [activeProject, activeSection])
  // ... rest unchanged
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/theater/Screen.tsx
git commit -m "feat: per-section atmospheric tint on cinema screen"
```

---

## Task 6: Create `ScreenPanel.tsx`

New component that mounts the panel content directly on the cinema screen using `<Html transform>` from `@react-three/drei`.

**Files:**
- Create: `src/components/theater/ScreenPanel.tsx`

- [ ] **Step 1: Create `src/components/theater/ScreenPanel.tsx`**

```tsx
'use client'

import { useEffect, Suspense } from 'react'
import { Html } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheaterStore } from '@/store/theaterStore'
import AboutPanel from '@/components/panels/AboutPanel'
import SkillsPanel from '@/components/panels/SkillsPanel'
import ProjectPanel from '@/components/panels/ProjectPanel'
import ContactPanel from '@/components/panels/ContactPanel'

const PANEL_MAP: Record<string, React.ComponentType> = {
  about:    AboutPanel,
  skills:   SkillsPanel,
  projects: ProjectPanel,
  contact:  ContactPanel,
}

// Screen mesh sits at [0, 5.5, -15.8]. We place Html 0.2 units in front.
const SCREEN_POS: [number, number, number] = [0, 5.5, -15.6]

// distanceFactor controls apparent size relative to camera distance.
// Start at 10 — tune up if content appears too small, down if too large.
// At projects shot (camera z=-2, screen z=-15.8, distance≈13.8): scale ≈ 10/13.8 = 0.72
// At lobby shot (camera z=10, distance≈25.8): scale ≈ 10/25.8 = 0.39
const DISTANCE_FACTOR = 10

export default function ScreenPanel() {
  const activeSection  = useTheaterStore(s => s.activeSection)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const setSection     = useTheaterStore(s => s.setSection)

  const Panel = activeSection !== 'lobby' ? PANEL_MAP[activeSection] : null

  // Escape key returns to lobby
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSection !== 'lobby') setSection('lobby')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeSection, setSection])

  return (
    <Html
      transform
      position={SCREEN_POS}
      distanceFactor={DISTANCE_FACTOR}
      // Disable pointer events when lobby (no panel) or during camera transition
      style={{
        width: 860,
        pointerEvents: (Panel && !isTransitioning) ? 'auto' : 'none',
      }}
    >
      <AnimatePresence mode="wait">
        {Panel && !isTransitioning && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 860,
              maxHeight: 460,
              overflowY: 'auto',
              padding: '28px 36px',
              boxSizing: 'border-box',
              borderTop: '1px solid rgba(200,146,42,0.35)',
              borderBottom: '1px solid rgba(200,146,42,0.35)',
              color: '#fff',
              scrollbarWidth: 'thin',
              scrollbarColor: '#ffd27c rgba(0,0,0,0)',
            }}
          >
            <Suspense fallback={null}>
              <Panel />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  )
}
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/theater/ScreenPanel.tsx
git commit -m "feat: create ScreenPanel — Html transform overlay on cinema screen"
```

---

## Task 7: Update `FilmReelNav` Toggle Behavior

Clicking an already-active non-lobby section returns the user to lobby (closes the panel).

**Files:**
- Modify: `src/components/ui/FilmReelNav.tsx`

- [ ] **Step 1: Update the button `onClick` handler in `FilmReelNav.tsx`**

Find the button's `onClick` (currently line ~78):

```tsx
// Before:
onClick={() => { if (!isTransitioning) setSection(s.id) }}

// After:
onClick={() => {
  if (isTransitioning) return
  if (s.id === activeSection && s.id !== 'lobby') {
    setSection('lobby')
  } else {
    setSection(s.id)
  }
}}
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/FilmReelNav.tsx
git commit -m "feat: clicking active nav section returns to lobby"
```

---

## Task 8: Wire ScreenPanel Into TheaterApp and Remove PanelShell

**Files:**
- Modify: `src/components/theater/TheaterApp.tsx`
- Delete: `src/components/panels/PanelShell.tsx`

- [ ] **Step 1: Update `TheaterApp.tsx`**

Replace the entire file:

```tsx
'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import TheaterScene from './TheaterScene'
import ScreenPanel from './ScreenPanel'
import LoadingScreen from '@/components/LoadingScreen'
import FilmReelNav from '@/components/ui/FilmReelNav'
import CustomCursor from '@/components/ui/CustomCursor'

function WebGLFallback() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#08060a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
      fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff',
    }}>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
        WebGL2 is not available in this browser.
      </p>
      <a href="mailto:ggtempestt@gmail.com" style={{ color: '#ffd27c', fontSize: 13 }}>
        ggtempestt@gmail.com
      </a>
    </div>
  )
}

function detectWebGL2(): boolean {
  if (typeof window === 'undefined') return true
  const canvas = document.createElement('canvas')
  return !!canvas.getContext('webgl2')
}

export default function TheaterApp() {
  if (!detectWebGL2()) return <WebGLFallback />

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#08060a' }}>
      {/* Three.js canvas — ScreenPanel lives inside here as Html transform */}
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        frameloop="always"
        camera={{ fov: 55, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <TheaterScene />
        </Suspense>
        <ScreenPanel />
      </Canvas>

      {/* DOM overlay — nav only */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
        <FilmReelNav />
      </div>

      <LoadingScreen />
      <CustomCursor />

      <div
        aria-live="polite"
        aria-atomic="true"
        id="theater-announcer"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Delete `PanelShell.tsx`**

```bash
git rm src/components/panels/PanelShell.tsx
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 4: Start the dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Loading screen appears and dismisses
- Lobby shows the theater scene — no panel visible
- Clicking "About" in the nav bar: camera flies to front-row angle, panel content appears on the screen
- Clicking "Skills": camera moves to projectionist angle, SkillsPanel content on screen
- Clicking "Films": camera centers on screen close-up, ProjectPanel on screen
- Clicking "Contact": camera moves to right-side angle, ContactPanel on screen
- Pressing Escape closes the panel and returns to lobby
- Clicking the active nav item again also returns to lobby
- `distanceFactor` — if content is too small at any shot, increase from 10 to 12 or 14 in `ScreenPanel.tsx` and reload. If too large at the projects close-up, decrease to 8.

- [ ] **Step 5: Commit**

```bash
git add src/components/theater/TheaterApp.tsx
git commit -m "feat: wire ScreenPanel into canvas, remove PanelShell"
```

---

## Task 9: Adapt Panel Content for Screen Proportions

**Files:**
- Modify: `src/components/panels/AboutPanel.tsx`
- Modify: `src/components/panels/ProjectPanel.tsx`

- [ ] **Step 1: Update `AboutPanel.tsx` — tighten sizes**

Change the hero row grid column and image size. Find and update:

```tsx
// Before — line ~53:
<div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 24, marginBottom: 28 }}>

// After:
<div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 20, marginBottom: 22 }}>
```

```tsx
// Before — Image sizes prop and fill container:
<div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.08)' }}>
  <Image
    src="/harvy-profile.jpg"
    alt="Harvy H. Monte de Ramos"
    fill
    style={{ objectFit: 'cover' }}
    sizes="110px"
    priority
  />
</div>

// After:
<div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.08)' }}>
  <Image
    src="/harvy-profile.jpg"
    alt="Harvy H. Monte de Ramos"
    fill
    style={{ objectFit: 'cover' }}
    sizes="80px"
    priority
  />
</div>
```

```tsx
// Before — name heading ~line 65:
<h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 22, fontWeight: 600, lineHeight: 1.1, marginBottom: 10 }}>

// After:
<h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 18, fontWeight: 600, lineHeight: 1.1, marginBottom: 8 }}>
```

```tsx
// Before — bio paragraph ~line 68:
<p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12.5, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>

// After:
<p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>
```

- [ ] **Step 2: Update `ProjectPanel.tsx` — add accent bar and year to list view**

In the list view (when `!project`), replace the project button grid:

```tsx
// Before:
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
  {PROJECTS.map(p => (
    <button
      key={p.id}
      onClick={() => setProject(p.id)}
      style={{ padding: '14px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, background: 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left' }}
    >
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: p.featured ? '#ffd27c' : '#9b8bc0', marginBottom: 4 }}>{p.genreTag}</div>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 14, fontWeight: 600, color: '#fff' }}>{p.title}</div>
    </button>
  ))}
</div>

// After:
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
  {PROJECTS.map(p => (
    <button
      key={p.id}
      onClick={() => setProject(p.id)}
      style={{
        padding: '14px 16px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderLeft: `3px solid ${p.featured ? '#ffd27c' : '#b07cff'}`,
        borderRadius: 10,
        background: 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      <div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: p.featured ? '#ffd27c' : '#9b8bc0', marginBottom: 4 }}>{p.genreTag}</div>
        <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 14, fontWeight: 600, color: '#fff' }}>{p.title}</div>
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginTop: 2 }}>{p.year}</div>
    </button>
  ))}
</div>
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 4: Visually verify panels in the running app**

With `npm run dev` still running at `http://localhost:3000`:
- Navigate to "About" — check that profile photo is 80px, heading is smaller, content fits cleanly in the screen area without overflow
- Navigate to "Films" — check that project cards show the left accent bar and year in the top-right
- Navigate to "Skills" and "Contact" — check that content fits comfortably

Note: `SkillsPanel` and `ContactPanel` require no changes — their content is already compact enough to fit the screen proportions without modification.

- [ ] **Step 5: Commit**

```bash
git add src/components/panels/AboutPanel.tsx src/components/panels/ProjectPanel.tsx
git commit -m "feat: tighten panel sizes and add project card accent bars"
```

---

## Completion Checklist

Run the full test suite one final time:

```bash
npx vitest run
```
Expected: all tests pass.

Verify in the running dev server:
- [ ] All 5 camera shots move toward the screen
- [ ] Hovering seats/booth/posters/box-office expands the cursor ring and shows a label
- [ ] Clicking any 3D interactive object navigates to the correct section (same as the nav bar)
- [ ] Panel content appears on the cinema screen in 3D space
- [ ] Section-specific background tints change on the screen mesh
- [ ] Escape key or re-clicking active nav item returns to lobby
- [ ] No floating modal overlay remains
