---
type: component
title: "Alert"
description: "Full-width banner for surfacing status messages, with a left-hand bar indicating info, warning, or error variants."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/alert/alert.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Alert

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Three variants (`AlertVariant`): `"info"` (white bar), `"warning"` (bar with a diagonal-line `PatternOverlay`), and `"error"` (solid black bar) — defaults to `"info"`
- Required `title`, optional `description` shown below it
- Optional leading icon (`icon` prop, any `IconName`) rendered next to the title; when present, the description is indented to align under the title text
- Sets `role="alert"` for the `"error"` variant and `role="status"` for `"info"`/`"warning"`, for assistive-technology announcement semantics
- Accepts a `className` prop for consumer-supplied extra classes

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-alert` class with an optional consumer `className`, and to conditionally apply `eink-alert__description--with-icon`
- BEM classes prefixed `eink-`: block `.eink-alert`, elements `.eink-alert__bar`, `.eink-alert__content`, `.eink-alert__title-row`, `.eink-alert__icon`, `.eink-alert__title`, `.eink-alert__description`; modifiers `.eink-alert__bar--error` and `.eink-alert__description--with-icon`
- Imports its own stylesheet via `import "./alert.component.css"`
- Renders the shared `Icon` component (`src/components/icons/icon.tsx`) and the shared `PatternOverlay` component (`src/components/pattern-overlay/pattern-overlay.component.tsx`) rather than reimplementing icon or stripe-pattern rendering
- Sets `data-eink-component="alert"` on the root element

---

## Primary Use Cases
- Surfacing status/feedback messages such as sync failures, low battery, or available updates
- Distinguishing severity at a glance via the left-hand bar (info/warning/error) without relying purely on color, since the warning variant uses a diagonal-stripe pattern to remain legible on grayscale e-ink displays
- Pairing a title with optional supporting description text and an optional icon for quick scanning

---

## Limits & Restrictions
- `title` is required; `description` and `icon` are optional
- `variant` is restricted to the `AlertVariant` union (`"info" | "warning" | "error"`) — no other values are valid
- The description's icon-aligned indent (`eink-alert__description--with-icon`) only applies when an `icon` is also supplied

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined; `alert.component.css` consumes only global theme tokens (`--eink-color-secondary`, `--eink-color-primary`, `--eink-color-grey-40`, `--eink-border-medium`, `--eink-border-thin`, `--eink-size-*`)
- Modifier classes: `.eink-alert__bar--error` (solid black bar background) and `.eink-alert__description--with-icon` (indents description to align with title when an icon is present)

---

## Related Concepts
- `src/components/icons/icon.tsx` — renders the optional leading icon
- `src/components/pattern-overlay/pattern-overlay.component.tsx` — renders the diagonal-stripe pattern used by the `"warning"` variant's bar
