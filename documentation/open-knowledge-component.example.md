---
type: component
title: "EInkReaderView"
description: "High-contrast paginated document viewer component tailored for E-Ink displays with hardware GC16 waveform locking and flash-clearing pagination."
tags: [react, e-ink, ui-component, reader, okf-v0.2]
resource: "src/components/EInkReaderView/index.tsx"
version: "1.2.0"
created_by: "agent:claude-3-7-sonnet" (2026-09-14T09:30:00Z)
reviewed_by: "user:alexis-roehrling" (2026-09-14T11:15:00Z)
---

# EInkReaderView

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- **GC16 Waveform Lock:** Enforces 16-level grayscale display mode (`GC16`) during idle reading to maximize text sharpness and contrast.
- **Flash-on-Page-Turn:** Triggers a full-panel inverted flash (black-to-white refresh cycle) every $N$ page turns to eliminate electronic ink particle retention (ghosting).
- **Sub-pixel Alignment & Anti-Aliasing Bypass:** Forces font rendering engine to use crisp 1-bit glyph bitmaps, avoiding blurry gray fringe artifacts on low-DPI EPD screens.
- **Zero Idle Power:** Mounts fully static DOM subtree upon render completion, enabling display controller sleep during active reading.

---

## Code Conventions
- **Asynchronous Page Transitioning:** Page flips must wrap state changes inside `useEInkTransition({ mode: 'A2' })` during active swipe/key press, then settle to `GC16` post-render.
- **Unmounting Sub-Elements:** Hidden page elements must be completely unmounted from the React render tree (`{active && <Page />}`) rather than hidden via `display: none` or opacity, preventing hardware frame-buffer overhead.
- **Key Navigation Throttling:** Hardware page-next / page-prev button listeners must be throttled to a minimum **250ms interval** to prevent display controller buffer saturation.

---

## Primary Use Cases
- **Long-Form E-Book / Document Viewer:** Primary container for multi-page text content requiring high legibility under direct sunlight.
- **Static Form & Document Inspector:** Viewing multi-page technical reports, schematics, or contracts on handheld EPD devices.

---

## Limits & Restrictions
- 🚫 **No Continuous Scrolling:** Viewport scrolling (touch pan or scrollbars) is strictly prohibited. E-Ink panels suffer extreme motion blur and ghosting during smooth scrolling; use discrete pagination only.
- 🚫 **No CSS Transitions / Animations:** CSS properties like `transition: transform 0.3s` must be disabled. Page flips must occur as instant step updates.
- 🚫 **No Semi-Transparent Overlays:** Modal overlays placed on top of `EInkReaderView` cannot use `rgba()` alpha backgrounds. Modals must use solid white backgrounds with a solid 2px black border.
- 🚫 **Max 4 Page Flips / Second:** Rapid sequential page skips are rate-limited to 4Hz by the underlying controller queue.

---

## Component-Specific CSS & Tokens

| CSS Custom Property            | Permitted Values                           | Purpose & E-Ink Hardware Impact                                                                                |
| :----------------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `--eink-reader-waveform`       | `gc16` \| `gl16`                           | Sets hardware reading profile (`gc16` for maximum sharpness, `gl16` for faster page turns with mild ghosting). |
| `--eink-reader-flash-interval` | `1` \| `3` \| `5` \| `10`                  | Frequency of full-screen inverted flash updates on page turns (default: `5`).                                  |
| `--eink-font-contrast-mode`    | `high-contrast-1bit` \| `grayscale-smooth` | Toggles glyph bitmap antialiasing behavior.                                                                    |

---

## Related Concepts
- [/tokens/waveforms.md](/tokens/waveforms.md) — Waveform timing specifications (GC16 vs A2 vs DU)
- [/architecture/ghosting-mitigation.md](/architecture/ghosting-mitigation.md) — Electronic ink physical refresh dynamics
- [/components/eink-pagination-controls.md](/components/eink-pagination-controls.md) — Hardware button bindings for page navigation