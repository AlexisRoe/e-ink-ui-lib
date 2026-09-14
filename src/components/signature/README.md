---
type: component
title: "Signature"
description: "A full-width canvas signature pad that captures hand-drawn strokes via the Pointer Events API and exposes them as standalone SVG markup."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/signature/signature.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Signature

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a labeled (`Label.Form`) `<canvas>` pad that captures freehand strokes via the standard Pointer Events API (`onPointerDown`/`onPointerMove`/`onPointerUp`/`onPointerCancel`), so mouse, touch, and stylus/pen input all work without extra wiring
- Keeps strokes as vector point data internally and converts them to standalone SVG `<path>` markup (via the local `strokesToSvg` helper) — never rasterizes or persists the signature itself
- Reports the captured SVG string through `onChange` (or the bound `<Form>` field via `name`) whenever a stroke finishes, and `null` once cleared
- `defaultValue` pre-renders a previously captured SVG signature onto the pad on mount (e.g. for a review screen); the user can still draw over or clear it
- `required` blocks the enclosing `<Form>` from submitting while the pad is empty, by setting a "Signature is required" form error
- `height` controls the pad's pixel height (default `128`, i.e. `--eink-size-128`)
- Optional `placeholder` hint text shown above the sign line while the pad is empty
- `disabled` disables drawing and the Clear button
- Includes a "Clear" button (`Button.Outlined`) to reset the pad
- Accessible: canvas has `role="img"`, a dynamic `aria-label` reflecting captured/empty state, `aria-describedby` pointing to a visually-hidden hint ("Draw with a pen, stylus, or your finger to sign."), and is keyboard-focusable (`tabIndex`) unless disabled
- Canvas is sized for device pixel ratio (`devicePixelRatio`) for crisp strokes on high-density displays

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging
- BEM classes prefixed `eink-`: `.eink-signature`, `.eink-signature__pad`, `.eink-signature__canvas`, `.eink-signature__clear`, etc.
- Imports its own `signature.component.css`
- Reuses `Label.Form`/`Label` (`src/components/label/`) and `Button.Outlined` (`src/components/button/`) rather than custom label/button markup
- Reads/writes form state and errors through `FormContext` (`src/components/form/form.context`) when `name` is provided
- A `biome-ignore lint/correctness/useExhaustiveDependencies` comment documents that the mount effect intentionally pre-renders `defaultValue` only once

---

## Primary Use Cases
- Capturing a signature for delivery confirmation, consent forms, or document sign-off on an e-ink tablet
- Review screens that need to display a previously captured signature (via `defaultValue`) and allow re-signing

---

## Limits & Restrictions
- `SignatureProps` omits the native `onChange` and `children` HTML attributes (`children` is repurposed as the label, `onChange` as the SVG-string callback)
- The component itself never uploads or persists the captured signature — callers must handle storage
- Signature output is vector SVG path markup, not a raster image; consumers expecting a bitmap must convert it themselves
- Drawing relies on the Pointer Events API and `touch-action: none` on the canvas, so it is inherently client-side/browser-only

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes global tokens only (`--eink-size-*`, `--eink-border-medium`, `--eink-color-*`, `--eink-font-size-default`)
- `.eink-signature__pad::after` draws a fixed "sign here" baseline line using `--eink-color-primary` / `--eink-color-grey-70` (disabled)

---

## Related Concepts
- `src/components/label/` — provides `Label.Form` and `Label` used for the field label and placeholder hint
- `src/components/button/` — provides `Button.Outlined` used for the Clear action
- `src/components/form/` — provides the `FormContext` used for form-bound usage and required-field validation via `name`
