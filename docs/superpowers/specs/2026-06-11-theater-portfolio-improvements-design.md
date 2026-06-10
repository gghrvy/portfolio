# Theater Portfolio — Visual & UX Improvements
**Date:** 2026-06-11
**Status:** Approved

---

## Overview

Elevate the existing 3D cinema theater portfolio from a decorative 3D background with floating modal panels into a fully immersive theater experience. The cinema screen becomes the content surface, every major 3D object in the scene becomes an interactive navigation shortcut, and all camera shots are unified around the screen as the focal point.

Inspired by bruno-simon.com's principle that the 3D world IS the navigation — not a backdrop for conventional UI.

---

## Section 1 — Camera Shot Redesign

All five section shots are reworked so every camera position faces the screen. Each shot still occupies a distinct physical zone of the theater so the room feels like a space you're moving through.

| Section | Shot Description | Position | Target |
|---|---|---|---|
| `lobby` | Wide establishing shot from the back, full theater visible | `[0, 5.5, 10]` | `[0, 5.5, -15]` |
| `about` | Front-row intimacy — close, low, looking up at the screen | `[0, 2.8, 3]` | `[0, 5.5, -15]` |
| `skills` | Projectionist's angle — elevated, left-side diagonal | `[-6, 8, 10]` | `[0, 5.5, -15]` |
| `projects` | Dead center, closest — screen fills the view | `[0, 5.5, -2]` | `[0, 5.5, -15]` |
| `contact` | Right-side box office angle — asymmetric, slightly off-center | `[5, 3.5, 7]` | `[0, 5.5, -15]` |

**File affected:** `src/lib/theater/cameraShots.ts`

---

## Section 2 — Screen as Panel

### Removal
- `src/components/panels/PanelShell.tsx` is removed entirely.
- The `<PanelShell />` mount in `TheaterApp.tsx` is removed.
- The `×` close button disappears with it. Closing is handled by `Escape` key or clicking the active nav item again.

### New component: `ScreenPanel`
A new component `src/components/theater/ScreenPanel.tsx` renders inside the Three.js scene using `@react-three/drei`'s `<Html transform>`.

**Positioning:**
- Mounted at world position `[0, 5.5, -15.6]` — 0.2 units in front of the screen mesh (which sits at z = -15.8)
- `distanceFactor={10}` on `<Html>` keeps content legible across all shot distances — this value will need runtime tuning; start at 10 and adjust until text is comfortably readable at the closest shot (`projects` at z = -2) without being oversized at the furthest (`lobby` at z = 10)
- Base pixel size: `860px × 460px`
- Do **not** use the `occlude` prop — the screen is at the far end of the theater and geometry between the camera and screen (seats, booth) would incorrectly hide the content

**Layering:**
- The screen mesh's existing `CanvasTexture` remains as the atmospheric background (grain, vignette, letterbox bars, section-tinted radial gradient)
- The `<Html>` overlay renders actual DOM panel content on top — crisp text at all zoom levels
- When `activeSection === 'lobby'` the Html is hidden (`display: none`); the default title card shows
- On section change: Framer Motion `opacity` + `scale` transition (`0, 0.96 → 1, 1`, 220ms ease-out)

**Styling constraints:**
- Container background: fully transparent — atmosphere comes from the screen mesh texture below
- Top and bottom: 1px gold (`#c8922a`) letterbox rules matching the existing CanvasTexture style
- Scrollable vertically with a custom scrollbar (2px wide, dark track, gold `#ffd27c` thumb)
- Padding: `32px 40px`

**Closing behavior:**
- `Escape` key → `setSection('lobby')`
- Clicking the currently active nav item → `setSection('lobby')`
- No explicit close button

**CanvasTexture background per section:**
| Section | Tint |
|---|---|
| `lobby` | Warm gold radial: `#120d08` → `#040305` |
| `about` | Blue-cool: `#08101a` → `#030408` |
| `skills` | Purple: `#0e0a18` → `#050407` |
| `projects` | Gold (existing featured style): `#1a1208` → `#050407` |
| `contact` | Green-dark: `#081410` → `#030505` |

---

## Section 3 — 3D Object Interactions

The film reel nav bar stays as the primary navigation. Object clicks are a shortcut layer.

### Interactive objects

| Component | Mesh description | Maps to section | Hover color |
|---|---|---|---|
| `Seats.tsx` | Front row seat meshes | `about` | `#60a5fa` (blue) |
| `ProjectionBooth.tsx` | Booth body + window | `skills` | `#b07cff` (purple) |
| `PosterFrames.tsx` | Individual poster frame meshes | `projects` | `#ffd27c` (gold) |
| `BoxOffice.tsx` | Counter surface mesh | `contact` | `#4ade80` (green) |

### Per-object behavior
- `onPointerOver`: tween `emissiveIntensity` `0 → 0.4` on the mesh material (GSAP or `useSpring`), set `document.body.style.cursor = 'pointer'`
- `onPointerOut`: tween `emissiveIntensity` back to `0`, reset cursor
- `onPointerUp`: call `useTheaterStore.setSection(mappedSection)` — same effect as clicking the nav bar
- Seat hover: nearest seat also scales up subtly (`scale 1 → 1.04`)
- Poster hover: hovered frame rotates slightly on Y axis (`rotateY 0 → 0.06rad`)
- Booth hover: `ProjectorBeam` intensity increases slightly

### Hover state management
- Each component manages its own hover boolean with `useState`
- No global store changes needed for hover state
- Hover is blocked during camera transitions (`isTransitioning === true`)

### Custom cursor upgrade (`CustomCursor.tsx`)
When hovering an interactive 3D object, the cursor ring:
- Expands from `20px` to `44px` diameter
- Shows a small uppercase label inside: `ABOUT`, `SKILLS`, `FILMS`, `CONTACT`
- Label fades in with a 150ms delay to avoid flicker on fast mouse passes
- A new Zustand field `hoveredZone: Section | null` drives this — set by the 3D components, read by `CustomCursor`

**Store addition to `theaterStore.ts`:**
```ts
hoveredZone: Section | null
setHoveredZone: (zone: Section | null) => void
```

---

## Section 4 — Panel Content Adaptation

The four panel components are adapted to render inside the `ScreenPanel` Html overlay.

### Shared changes across all panels
- Remove outer wrapper padding/background — the `ScreenPanel` container provides it
- Max content width: `780px`, centered
- All font sizes reduced ~10% to fit screen proportions (e.g. `AboutPanel` h2: `22px → 18px`, name photo: `110px → 80px`)
- Scrollbar matches the custom gold film-strip style

### `AboutPanel`
- Profile photo: `110px → 80px`
- Name heading: `22px → 18px`
- Bio text: `12.5px → 12px`
- Layout otherwise unchanged

### `SkillsPanel`
- Exists at `src/components/panels/SkillsPanel.tsx` — uses `TechStack` component and certifications list
- Minor size tweaks only (heading `22px → 18px`) to fit screen proportions; layout unchanged

### `ProjectPanel`
- List view: project cards gain a left-side colored accent bar (gold for featured, purple for others)
- Year displayed prominently top-right of each card
- Detail view: unchanged structurally

### `ContactPanel`
- Exists at `src/components/panels/ContactPanel.tsx` — contact form with name/email/message/submit
- No structural changes; already compact enough for the screen dimensions

### Section transitions
- On `activeSection` change: current panel content exits (`opacity 0`, 200ms), new content enters (`opacity 1`, 220ms)
- The CanvasTexture background on the screen mesh updates simultaneously to the new section tint

---

## Files Changed Summary

| File | Change |
|---|---|
| `src/lib/theater/cameraShots.ts` | Update all 5 camera shot positions/targets |
| `src/components/theater/TheaterApp.tsx` | Remove `<PanelShell />`, add `<ScreenPanel />` inside `<Canvas>` |
| `src/components/theater/ScreenPanel.tsx` | **New file** — `<Html transform>` screen overlay with Framer Motion transitions |
| `src/components/theater/Screen.tsx` | Add per-section tinted background to `buildScreenTexture` |
| `src/components/panels/PanelShell.tsx` | **Deleted** |
| `src/store/theaterStore.ts` | Add `hoveredZone` field |
| `src/components/ui/CustomCursor.tsx` | Expand + label on `hoveredZone` |
| `src/components/theater/Seats.tsx` | Add hover/click interaction |
| `src/components/theater/ProjectionBooth.tsx` | Add hover/click interaction |
| `src/components/theater/PosterFrames.tsx` | Add hover/click interaction per frame |
| `src/components/theater/BoxOffice.tsx` | Add hover/click interaction |
| `src/components/panels/AboutPanel.tsx` | Size tweaks for screen fit |
| `src/components/panels/ProjectPanel.tsx` | Card accent bar, year prominence |

---

## Out of Scope

- Sound design / ambient audio
- Mobile-specific layout (existing WebGL fallback stays)
- New content sections
- Particle effects / dust motes (deferred — can be added after this pass)
