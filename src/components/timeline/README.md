---
type: component
title: "Timeline"
description: "Vertical timeline of items, each showing a time, a done/pending/todo state marker, a title, and a description, connected by a continuous line."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/timeline/timeline.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Timeline

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `Timeline.Item` renders a `time`, a state marker, a bold `title`, and an optional description (`children`), connected to its neighbors by an unbroken vertical line.
- Three states per item, communicated without color: `"done"` (filled square), `"pending"` (diagonally hatched square via `PatternOverlay`), and `"todo"` (empty square).
- The connecting line and bottom margin are automatically omitted after the last `Timeline.Item` (via `:last-child` CSS rules), so no manual "is this the last item" prop is needed.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-timeline`, item block `.eink-timeline-item`, elements `.eink-timeline-item__time`, `.eink-timeline-item__marker`, `.eink-timeline-item__box`, `.eink-timeline-item__line`, `.eink-timeline-item__content`, `.eink-timeline-item__title`, `.eink-timeline-item__description`, modifier `.eink-timeline-item__box--done`.
- Imports its own stylesheet via `import "./timeline.component.css"`.
- Reuses `PatternOverlay` (with `overlay={false}` and custom `rectProps`) for the "pending" state marker instead of a bespoke SVG.
- `TimelineItem` is attached to `Timeline` as `Timeline.Item` for compound-component usage.

---

## Primary Use Cases
- Displaying a chronological log of events or steps (e.g. a daily schedule, an order's fulfillment history, an audit trail) with clear done/pending/todo status.
- Any vertical step-by-step progress display where color cannot be relied on to distinguish states.

---

## Limits & Restrictions
- `TimelineItemProps` omits the native `title` HTML attribute in favor of its own typed `title: ReactNode` prop.
- `time`, `title`, and `state` are all required on every `Timeline.Item`.
- The "last item" styling (no connecting line, no bottom margin) is purely CSS `:last-child`-based, so it depends on `Timeline.Item`s being direct children of `Timeline` in DOM order.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined beyond global theme tokens (`--eink-size-*`, `--eink-border-medium`, `--eink-border-width-medium`, `--eink-color-primary`, `--eink-color-background`, `--eink-color-grey-30`).

---

## Related Concepts
- `src/components/pattern-overlay/` — provides the diagonal-hatch marker for the "pending" state.
