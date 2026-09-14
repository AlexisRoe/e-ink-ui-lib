---
type: component
title: "{{ComponentName}}"
description: "{{One-sentence summary of component capability, E-Ink refresh strategy, and core role.}}"
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/{{ComponentName}}/index.tsx"
version: "1.0.0"
created_by: "user:{{creator_id}}" (2026-09-14T10:00:00Z)
reviewed_by: "agent:{{reviewer_id}}" (2026-09-14T12:00:00Z)
---

# {{ComponentName}}

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- **Waveform Mode Coupling:** Explicit hardware update mode binding (`DU` / Direct Update for interactive speed, `GC16` for high-contrast text rendering).
- **Ghosting Mitigation:** Automatic or triggerable flash-refresh cycles to clear residual electronic ink particles.
- **EPD-Optimized Layout:** Pixel-aligned layout rendering avoiding sub-pixel font anti-aliasing blur.

---

## Code Conventions
- **Render Queuing:** Must wrap async state changes in `useEInkTransition()` to prevent rapid, overlapping display updates.
- **Static DOM Structure:** Avoid dynamic DOM node insertion during active waveform cycles; pre-render layout bounds to prevent partial update clipping.
- **Input Debouncing:** Hardware input handlers (touch/stylus/key) must enforce a minimum 100ms debounce window to sync with panel draw rate.

---

## Primary Use Cases
- **[Primary Scenario]:** Ideal for high-density, static text viewing where zero power draw during idle periods is required.
- **[Interactive Scenario]:** Tactical low-latency inputs (e.g., form entry, pagination) requiring `A2` fast-monochrome mode.

---

## Limits & Restrictions
- 🚫 **No CSS Transitions / Animations:** CSS `transition` and `animation` properties must be set to `none`. E-Ink panels cannot render 60fps frame interpolation without extreme ghosting.
- 🚫 **No Alpha Transparency:** Sub-pixel alpha blending (`rgba()` or `opacity: 0.x`) is prohibited. Colors must resolve to absolute 1-bit black/white or discrete 4/16-level grayscale tokens.
- 🚫 **Update Frequency Cap:** Hard limit of max X updates per second. Rapid state mutations will be dropped by the display controller queue.

---

## Component-Specific CSS & Tokens
*(Include ONLY if this component requires dedicated hardware display tokens)*

| CSS Custom Property    | Permitted Values                           | Purpose & E-Ink Hardware Impact                                      |
| :--------------------- | :----------------------------------------- | :------------------------------------------------------------------- |
| `--eink-waveform-mode` | `du` \| `gc16` \| `a2` \| `gl16`           | Sets hardware EPD update profile for component subtree.              |
| `--eink-refresh-flash` | `never` \| `on-mount` \| `every-5-renders` | Controls full-screen inverted flash frequency to eliminate ghosting. |

---

## Related Concepts
- [/tokens/waveforms.md](/tokens/waveforms.md) — Detailed waveform timing and latency reference
- [/architecture/refresh-queue.md](/architecture/refresh-queue.md) — Display refresh pipeline and frame buffer queue
- [/components/eink-provider.md](/components/eink-provider.md) — E-Ink Context Provider configuration