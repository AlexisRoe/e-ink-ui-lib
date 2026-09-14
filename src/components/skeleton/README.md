---
type: component
title: "Skeleton"
description: "A loading placeholder rendered as a bordered box filled with diagonal strokes, in rectangle, round, or square shapes."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/skeleton/skeleton.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Skeleton

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a 2px solid bordered box filled with diagonal strokes (via the shared `PatternOverlay` component) as a placeholder for content that hasn't loaded yet.
- Three variants: `"rectangle"` (default, fixed height, full width), `"round"` (circular, fixed height with `aspect-ratio: 1/1` and `border-radius: 50%`), and `"square"` (fixed height with `aspect-ratio: 1/1`).
- Always renders at 100% of its parent's width (for `rectangle`) or a fixed height with an auto/aspect-ratio-derived width (for `round`/`square`); consumers size it further via `style` or `className`.
- Exposes `role="status"` and `aria-label="Loading"` for accessibility.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging, combining the base/variant class (`eink-skeleton eink-skeleton--${variant}`) with any consumer-supplied `className`.
- BEM classes prefixed `eink-`: `.eink-skeleton` with `--rectangle`/`--round`/`--square` modifiers.
- Imports its own `skeleton.component.css` directly.
- Reuses the shared `PatternOverlay` component (`../pattern-overlay/pattern-overlay.component`) for the diagonal-stroke fill instead of a one-off SVG.

---

## Primary Use Cases
- Placeholder for text lines, avatars, or content blocks while data is loading, as shown in the `Paragraph`, `AvatarWithLines`, and `AvatarWithBlock` stories.
- Any layout where a bordered, stroked block should stand in for content not yet available on an e-ink screen (avoiding animated shimmer effects that don't suit e-ink refresh characteristics).

---

## Limits & Restrictions
- Has no built-in sizing beyond its variant defaults (`--eink-size-16` height for `rectangle`, `--eink-size-48` for `round`/`square`) — actual dimensions to match real content must be supplied via `style` or `className`.
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- Variant modifier classes (`.eink-skeleton--rectangle`, `.eink-skeleton--round`, `.eink-skeleton--square`) define this component's default height and shape (`aspect-ratio`, `border-radius`) and are specific to this component.

---

## Related Concepts
- `../pattern-overlay/pattern-overlay.component.tsx` — shared diagonal-stripe SVG component reused for the skeleton's fill pattern.
- `../last-updated/README.md` — another component reusing `PatternOverlay` for a diagonal-stripe indicator.
