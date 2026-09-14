---
type: component
title: "Log"
description: "A full-width list of timestamped log entries, each with a severity badge, optional source, description, and acknowledgement indicator."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/log/log.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Log

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Compound component: `Log` (list container) and `Log.Item` (single entry)
- `Log` accepts an optional `title` rendered above the entries, and `withBorder` (default `true`) to wrap entries in a `2px` solid border
- `Log.Item` requires a `state` (`"info" | "warning" | "error" | "critical"`) shown as both a colored left-edge marker and a glyph badge (`i`, `!`, `x`, `‼` respectively), a `timeStamp` (`Date`) formatted via `formatLogTimestamp` from `src/utils/log.utils.ts` as `hh:mm:ss:ms`, an optional `source`, a required description (`children`), and an optional `ack` flag rendering an "ACK" box on the right
- The `critical` state marker uses the shared `PatternOverlay` component (`src/components/pattern-overlay/`) to render a diagonal-stripe pattern instead of a flat fill
- Entries are laid out in a CSS grid with fixed columns for the badge, time, source, description, and ack indicator

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for all conditional className merging
- BEM classes prefixed `eink-`: `.eink-log`, `.eink-log__title`, `.eink-log__entries`, `.eink-log-item`, `.eink-log-item__badge`, `.eink-log-item__marker`, etc.
- Imports its own `log.component.css`
- Reuses `PatternOverlay` rather than reimplementing the diagonal-stripe pattern locally
- Delegates timestamp formatting to the shared `formatLogTimestamp` utility instead of formatting dates inline
- Accessible severity markers: both the `LogMarker` span and the `PatternOverlay` critical marker carry `role="img"` and an `aria-label` matching the state

---

## Primary Use Cases
- Equipment/industrial event logs showing severity-tagged events with sources (e.g. machine cell IDs) and timestamps
- Audit trails or activity feeds needing an acknowledgement ("ACK") indicator per entry
- Any fullwidth, timestamped, severity-classified list of discrete events

---

## Limits & Restrictions
- `Log.Item` requires `state`, `timeStamp`, and `children` (description) — there is no default state or timestamp
- `source` is optional; when omitted, its grid column is simply left empty rather than collapsing the layout
- `LogProps` omits the native `title` HTML attribute (`Omit<HTMLAttributes<HTMLDivElement>, "title">`) since `title` is repurposed as the rendered heading rather than a tooltip string

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; `log.component.css` uses global tokens only (`--eink-size-*`, `--eink-border-medium`, `--eink-border-thin`, `--eink-color-*`, `--eink-font-family-main`)
- Notable BEM modifiers: `.eink-log__entries--bordered`, `.eink-log-item__marker--info` / `--warning` / `--error`, `.eink-log-item__badge--critical`

---

## Related Concepts
- `src/components/pattern-overlay/` — provides the diagonal-stripe overlay used for the `critical` severity marker
