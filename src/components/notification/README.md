---
type: component
title: "Notification"
description: "Portal-rendered, top-center stack of toast-style notifications fired imperatively via useNotifications, with info/warning/error variants."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/notification/notification.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Notification

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `NotificationProvider` renders all fired notifications into a `document.body` portal, stacked at the top center of the page with a slight vertical offset per notification.
- Notifications are fired imperatively via the `useNotifications()` hook's `notify(title, description?, variant?)` function; calling `notify` with no ancestor `NotificationProvider` is a safe no-op.
- Three variants indicated by the left-hand bar: `"info"` (plain white/secondary bar), `"warning"` (bar with a diagonal-stripe `PatternOverlay`), and `"error"` (solid black bar). Defaults to `"info"`.
- All currently visible notifications share a single dismiss timer (`duration`, in ms): firing a new notification while others are visible resets the shared timer, so every visible notification dismisses together when it elapses.
- `NotificationItem` (the individual card) is an internal rendering detail, not part of the public API.

---

## Code Conventions
- BEM classes prefixed `eink-`: block `.eink-notification`, container `.eink-notification-container`, elements `.eink-notification__bar`, `.eink-notification__content`, `.eink-notification__title`, `.eink-notification__description`, modifier `.eink-notification__bar--error`.
- Imports its own stylesheet via `import "./notification.component.css"`.
- Reuses the shared `PatternOverlay` component for the warning variant's diagonal-stripe bar instead of a custom SVG.
- Stateful/portal logic lives in a co-located `notification.provider.tsx` (context + `createPortal`), separate from the presentational `notification.component.tsx`.
- Passes the stacking offset to CSS via an inline custom property (`--eink-notification-offset`) rather than a per-offset class.

---

## Primary Use Cases
- Firing transient confirmation/feedback toasts after user actions (e.g. "Saved", "Your changes have been saved.") from anywhere in the component tree via `useNotifications()`.
- Surfacing warnings or errors (e.g. failed network request) with a distinct visual bar, without blocking the UI.

---

## Limits & Restrictions
- Requires an ancestor `NotificationProvider` (with a required `duration` prop) for `notify` to have any visible effect; without one, `useNotifications()` returns a no-op `notify`.
- All visible notifications are dismissed together on a shared timer — there is no per-notification duration or manual dismiss button.
- Uses `min-width`/`max-width` (`var(--eink-size-320)` / `var(--eink-size-480)`) fixed at the top center of the viewport; position is not configurable.

---

## Component-Specific CSS & Tokens
- `--eink-notification-offset`: inline custom property set per notification (its stack index), consumed by `.eink-notification`'s `transform`/`z-index` to produce the stacked-offset visual effect. This is component-specific, layered on top of the global theme tokens (`--eink-size-*`, `--eink-color-*`, `--eink-border-*`, `--eink-z-index-notification`).
- Notable modifier: `.eink-notification__bar--error` (solid black bar for the error variant); the warning variant instead composes `PatternOverlay` rather than a CSS modifier.

---

## Related Concepts
- `src/components/pattern-overlay/` — provides the diagonal-stripe overlay used for the warning variant's bar.
