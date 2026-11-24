---
type: component
title: "EinkProvider"
description: "Single root provider combining ThemeProvider, NotificationProvider and ModalProvider."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/provider/provider.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-11-24T00:00:00Z)
---

# EinkProvider

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Nests `ThemeProvider` > `NotificationProvider` > `ModalProvider` in the order the library requires
- `notificationDuration` (default 5000 ms) configures the notification lifetime

---

## Code Conventions
- Pure composition, no state or markup of its own
- Used by `e-ink-ui-lib/testing` (`renderWithProviders`)

---

## Primary Use Cases
- App root wrapper replacing three hand-nested providers
- Test wrapper for components that use theme, notifications or modals

---

## Limits & Restrictions
- Individual providers remain exported for apps that need a different nesting or only some of them
