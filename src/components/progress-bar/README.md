---
type: component
title: "ProgressBar"
description: "Bordered, full-width progress bar with solid, diagonal-stripe, unlabeled, and discrete-step variants for e-ink displays."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/progress-bar/progress-bar.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# ProgressBar

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `ProgressBar`: bordered, full-width bar filled solid black up to `value` percent (clamped to `0`-`100`), with an optional `label` shown below as `"label · value%"`
- `ProgressBar.Naked`: same track, but never renders a label (its props type omits `label` entirely)
- `ProgressBar.Diagonal`: same as `ProgressBar` but filled with a diagonal-stripe `PatternOverlay` instead of a solid fill
- `ProgressBar.Stepper`: discrete, evenly-sized step segments instead of a continuous fill, driven by `steps` (total count) and `currentStep` (filled count, clamped to `0..steps`); optional `label` renders as `"label · currentStep / steps"` (shows `"-"` when `currentStep` is 0)
- All variants render `role="progressbar"` with `aria-valuenow`/`aria-valuemin`/`aria-valuemax` for accessibility

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for all conditional class merging across every variant
- BEM classes prefixed `eink-`: block `.eink-progress-bar`, elements `__track`, `__fill`, `__label`; modifier `.eink-progress-bar__fill--diagonal`; the stepper variant reuses the block but has its own elements `.eink-progress-bar-stepper__track`, `__step`, modifier `--filled`
- Imports its own stylesheet via `import "./progress-bar.component.css"`
- Reuses shared components: `Label` (`src/components/label/label.component.tsx`) for the caption text, `PatternOverlay` (`src/components/pattern-overlay/pattern-overlay.component.tsx`) for the diagonal fill
- Internal `Track` and `BaseProgressBar` helper components are shared by `ProgressBar`, `ProgressBar.Naked`, and `ProgressBar.Diagonal` rather than duplicating markup
- Uses a `biome-ignore lint/suspicious/noArrayIndexKey` comment for stepper segment keys, since steps are a fixed-length, position-only sequence
- Exposes `Naked`, `Diagonal`, and `Stepper` as static properties on `ProgressBar`

---

## Primary Use Cases
- Showing continuous progress (uploads, downloads, sync operations) with a solid or diagonal-stripe fill and an optional percentage label
- Multi-step flows (onboarding, wizards, multi-page forms) via `ProgressBar.Stepper`, showing which discrete step the user is on
- Minimal/unlabeled progress indicators embedded in tighter layouts via `ProgressBar.Naked`

---

## Limits & Restrictions
- `value` is required and always clamped to `0`-`100`; out-of-range inputs are silently clamped rather than causing an error
- `ProgressBar.Naked`'s type omits `label` entirely — passing one is a compile-time error
- `ProgressBar.Stepper`'s `currentStep` is clamped to `0..steps`; `steps` and `currentStep` are both required

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-primary`, `--eink-color-secondary`, `--eink-border-medium`, `--eink-size-*`)
- Notable classes: `.eink-progress-bar__fill--diagonal` (transparent background so the `PatternOverlay` shows through), `.eink-progress-bar-stepper__track` (CSS grid with `grid-auto-flow: column` for evenly-sized step segments)

---

## Related Concepts
- `src/components/pattern-overlay/pattern-overlay.component.tsx` — renders the diagonal-stripe fill used by `ProgressBar.Diagonal`
- `src/components/label/label.component.tsx` — renders the optional caption text below the bar
