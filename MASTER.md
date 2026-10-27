# MASTER — Signal Trace design system

The single source of truth for the portfolio's visual and motion language. Code tokens live in [src/styles/tokens.css](src/styles/tokens.css); every color, size, duration and easing in the codebase must come from there.

## Theses

**Visual.** Dark technical precision. The page is a carbon ground with hairline-bordered panels and a single amber signal accent. Green appears only for live or available state. Clash Grotesk display type is set large and tight, IBM Plex Sans is the body, and IBM Plex Mono handles labels, data and indices. Spacing is dense inside components and airy between sections, on a 4px base. Components are sharp-edged, bordered rather than filled, and flat; elevation comes from borders and from an amber glow reserved for active nodes.

**Interaction.** Fast and dry. UI transitions run 120–240ms and reveals stay at or under 600ms. Hover turns the border amber, nudges the arrow 3px and draws link underlines with scaleX from the left. Only primary CTAs are magnetic. On scroll, a single margin trace fills with progress, section nodes light on arrival, and each section has its own reveal: masked lines, graph draw, chip cascade, or timeline fill.

**Forbidden:** bounce or elastic easing, parallax drift, one fade-up for everything, blur-in, purple/blue gradients, glass cards, emoji, scale(0), and animating anything other than `transform`/`opacity`. The one exception is SVG `stroke-dashoffset` for graph draws.

## Color
| Token | Hex | Use | Contrast on bg |
|---|---|---|---|
| `--c-bg` | `#0C0E0D` | page ground | — |
| `--c-panel` | `#141716` | raised panels, plates | — |
| `--c-panel-2` | `#1B1F1D` | hover fill, chips | — |
| `--c-line` | `#262B29` | hairlines | non-text |
| `--c-line-strong` | `#3A413D` | rules that need presence | non-text |
| `--c-text` | `#E7E9E2` | primary text | 15.8:1 |
| `--c-muted` | `#8E958F` | secondary text | 6.3:1 |
| `--c-faint` | `#6B726C` | decorative / non-text only | 3.9:1 |
| `--c-signal` | `#F0A33A` | the single accent: indices, active state, focus | 9.2:1 |
| `--c-live` | `#5CCF9F` | live/available state only | 10.0:1 |
| `--c-plate-light` | `#E4E6DF` | backdrop for light-UI screenshots | — |

Text on amber uses `--c-bg` (9.2:1).

## Type
- Display: **Clash Grotesk** (variable 200–700, self-hosted, FFL licence in `src/fonts/FFL.txt`). Weight 500–600, tracking −0.03em, line-height 0.92–1.05.
- Body: **IBM Plex Sans** 400/500/600, line-height 1.6.
- Mono: **IBM Plex Mono** 400/500, uppercase labels at +0.06em tracking.
- Fluid scale from 360px to 1440px: `--step--2` 11px fixed (mono labels) … `--step-6` 48→120px (hero name).

## Space, radii, borders
- Space: `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96 · `--s-10` 144 (px).
- Radii: `--r-0` 0, `--r-1` 2px (chips, buttons), `--r-full` 999px (status dots).
- Shadows: none. The only glow is `--glow-signal`, for active nodes.

## Motion
| Token | Value | Rule |
|---|---|---|
| `--ease-signal` | `cubic-bezier(.2,0,0,1)` | entering, hover-in |
| `--ease-route` | `cubic-bezier(.65,0,.35,1)` | moving between states |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | leaving (0.75× the enter duration) |
| `--d-instant` | 90ms | press feedback |
| `--d-fast` | 160ms | hover, focus |
| `--d-base` | 240ms | tabs, menus, swaps |
| `--d-slow` | 420ms | lightbox, layout moves |
| `--d-reveal` | 600ms | one-time section reveals |
| `--stagger` | 40ms | list cascades |

Rules:
1. Enter uses ease-signal and exit uses ease-exit at a shorter duration with opacity first. Scroll-linked animation is linear.
2. Frequent interactions are short and small. Hover never moves anything more than 3px.
3. Every section owns one reveal type, and none of them repeats.
4. Under `prefers-reduced-motion: reduce`, all durations collapse, canvases render one static frame, smooth scroll is off and the content is fully visible.
5. Canvas and WebGL pause when off-screen or when the tab is hidden.

## Components
- **Button / primary:** amber fill, carbon text, `--r-1`, 48px tall, magnetic.
- **Button / ghost:** 1px `--c-line-strong` border that turns amber on hover.
- **Link:** text plus an underline pseudo-element with scaleX 0→1 from the left on hover and focus.
- **Chip:** mono `--step--2`, 1px line border, `--c-panel-2` fill.
- **Node label:** mono `[NN] / label`, with an amber index.
- **Focus:** 2px `--c-signal` outline at 3px offset on every interactive element.
- **States:** default, hover, focus-visible, active (translateY 1px) and disabled (opacity .45, no pointer).
