---
type: component
title: "Slider"
description: "Discrete-step value picker rendering a native input[type=range] invisibly over a custom segmented track that fills solid black up to the current value, without thumb animation."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/slider/slider.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Slider

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Layers a fully transparent native `<input type="range">` (real slider semantics, keyboard support, click/tap-to-jump) over a custom track built from individual segments that fill solid black up to the current value, like a segmented progress bar
- No thumb animation: clicking/tapping or using the keyboard snaps the value straight to the nearest `step`, matching the theme's globally disabled transitions
- Required `min`/`max`, optional `step` (defaults to `1`); segment count is derived as `max(1, round((max - min) / step))`
- `orientation` (`SliderOrientation`: `"horizontal" | "vertical"`, defaults to `"horizontal"`) lays the track left-to-right or bottom-to-top (`writing-mode: vertical-lr; direction: rtl` on the input for vertical dragging)
- Can bind to an enclosing `<Form>` via `name` (reads/writes through `FormContext`), or be used as a controlled component via `value`/`onChange`
- `required` renders a `*` after the label and sets the native `required` attribute (does not hook into `<Form>` validation on its own)
- `disabled` state greys out the label, track border, and filled segments

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the orientation-based root class, the `eink-slider__segment--filled` modifier, and any consumer `className`
- BEM classes prefixed `eink-`: block `.eink-slider`, elements `__required`, `__control`, `__label`, `__input`, `__track`, `__segment`; modifiers `.eink-slider--horizontal`/`--vertical`, `.eink-slider__segment--filled`
- Imports its own stylesheet via `import "./slider.component.css"`
- Reuses the shared `Label.Form` component (`src/components/label/label.component.tsx`) for the field label
- Integrates with the library's form system via `FormContext` from `src/components/form/form.context.ts`
- Uses a `biome-ignore lint/suspicious/noArrayIndexKey` comment for segment keys, since segments are a fixed-length, position-only sequence

---

## Primary Use Cases
- Numeric settings with a bounded, discrete range where visual "fill level" feedback matters — e.g. brightness, volume, font size
- Form fields bound to a `<Form>` via `name`, storing a numeric value
- Vertical sliders (e.g. volume controls) via `orientation="vertical"`

---

## Limits & Restrictions
- `min`, `max`, and `children` (the label) are required
- When `name` is set and a `<Form>` ancestor exists, `value`/`onChange` are ignored — the form context is the source of truth
- `required` only affects the label asterisk and the native HTML `required` attribute; it does not perform or trigger form-level validation itself
- `min`, `max`, `step`, `value`, `defaultValue` are omitted from the passthrough native input props (`InputHTMLAttributes`) since the component manages them itself

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-*`, `--eink-border-medium`, `--eink-size-*`, `--eink-font-size-default`)
- Notable structural detail: the native `<input>` is fully transparent (`opacity: 0`) and absolutely positioned over the visible `.eink-slider__track`, which is `pointer-events: none` and purely decorative/`aria-hidden`

---

## Related Concepts
- `src/components/form/form.context.ts` — provides the `FormContext` this component binds to via `name`
- `src/components/label/label.component.tsx` — renders the field label via `Label.Form`
- `src/components/progress-bar/progress-bar.component.tsx` — shares the segmented-fill visual idiom used by `ProgressBar.Stepper`
