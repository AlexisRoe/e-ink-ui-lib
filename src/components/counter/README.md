---
type: component
title: "Counter"
description: "A bordered, labeled box with an optional numeric count or dot badge overlapping its top-right corner."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/counter/counter.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Counter

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a bordered box with a `label`, and an optional badge overlapping the top-right corner: either a numeric `count` or a small `dot`.
- `count` values above 99 are displayed as `"99+"` (via the `formatCount` helper).
- Three sizes: `sm`, `md`, `xl` (defaults to `md`), each with its own padding, label font size, and badge dimensions defined in CSS.
- `count` and `dot` are mutually exclusive at the type level — the `CounterProps` union makes passing both a TypeScript error.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging, combining the base/size class (`eink-counter eink-counter--${size}`) with any consumer-supplied `className`.
- BEM classes prefixed `eink-`: `.eink-counter`, `.eink-counter__label`, `.eink-counter__badge`, `.eink-counter__badge--dot`, plus size modifiers `.eink-counter--sm`/`--md`/`--xl`.
- Imports its own `counter.component.css` directly.
- Purely presentational — no internal state or context.

---

## Primary Use Cases
- Notification/inbox indicators showing an unread count (e.g. "Inbox" with a badge count).
- Lightweight status dots indicating unread/new items without an exact number.
- Labeled badges of varying prominence via the `sm`/`md`/`xl` size scale.

---

## Limits & Restrictions
- `count` and `dot` cannot both be provided — enforced by the `CounterProps` discriminated union (`{ count?: number; dot?: never } | { dot?: boolean; count?: never }`), a compile-time restriction, not a runtime check.
- `label` is required and is always plain text content (`string`), not arbitrary `ReactNode`.
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- Badge positioning uses `position: absolute; top: 0; right: 0; transform: translate(50%, -50%)` to overlap the top-right corner of the box — not a token, but a fixed layout technique specific to this component's `.eink-counter__badge`.
- Size modifier classes (`.eink-counter--sm`, `.eink-counter--md`, `.eink-counter--xl`) and `.eink-counter__badge--dot` are defined purely in this component's CSS file to scale label font size, padding, and badge/dot dimensions using the standard `--eink-size-*` tokens.

---

## Related Concepts
- `../price/README.md` — another compact data-display component using similar bordered/badge conventions.
