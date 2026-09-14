---
type: component
title: "Modal"
description: "A centered dialog portaled into a ModalProvider-managed container, with fixed title/body/close/footer slots laid out via CSS grid."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/modal/modal.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Modal

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `ModalProvider` creates a single container `<div data-eink-modal-root>` appended to `document.body` and shares it via context; every open `Modal` in the tree portals into this same container so multiple modals stack correctly.
- `Modal` renders nothing (`null`) when `open` is `false`, or when used without an ancestor `ModalProvider` — no state is kept stale between openings.
- Laid out with CSS grid into fixed `title` / `close` / `body` / `footer` areas, so `Modal.Close`, `Modal.CloseButton`, and `Modal.ActionButton` always render in their designated slot regardless of where they appear among `children`.
- `Modal.Close` is a naked icon ("X") button on the title row; `Modal.CloseButton` (outlined) and `Modal.ActionButton` (filled) render in the footer, in that order, only if present among children.
- `size` (`"sm" | "md" | "xl"`, default `"md"`) controls max-width; `overlay` (`"white" | "black" | "transparent" | "semi-transparent"`, default `"semi-transparent"`) controls the backdrop color.
- Clicking the overlay (outside the dialog) or any of the close controls calls `onClosed`; clicking `Modal.ActionButton` calls `onAccept`. Existing `onClick` handlers on those child buttons are preserved and chained via `cloneElement`.
- Clicking the overlay itself (not the dialog) triggers close, checked via `event.target === event.currentTarget`.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging on `Modal`, `Modal.Close`, `Modal.CloseButton`, and `Modal.ActionButton`.
- BEM classes prefixed `eink-`: `.eink-modal-overlay` with `--white`/`--black`/`--transparent`/`--semi-transparent` modifiers, `.eink-modal` with `--sm`/`--md`/`--xl` size modifiers, `.eink-modal__title`, `.eink-modal__close`, `.eink-modal__body`, `.eink-modal__footer`, `.eink-modal__close-button`, `.eink-modal__action-button`.
- Imports its own `modal.component.css` directly.
- Built on the shared `Button` component (`Button.IconNaked`, `Button.Outlined`, and default `Button` for the action button) from `../button/button.component`.
- Uses `createPortal` from `react-dom` together with `useModalContainer()` from `./modal.provider`.
- `Modal.Close`, `Modal.CloseButton`, and `Modal.ActionButton` are attached as static properties on `Modal`.

---

## Primary Use Cases
- Confirmation dialogs (e.g. "Delete item" with Cancel/Delete actions), as shown in its own JSDoc example.
- Any centered, page-blocking dialog that needs consistent title/body/footer placement regardless of the order children are authored in.
- Apps needing multiple stacked modals, since all `Modal`s share one `ModalProvider` container and stack by mount order.

---

## Limits & Restrictions
- Requires an ancestor `ModalProvider` — a `Modal` rendered without one renders nothing at all, silently.
- `Modal` renders nothing internally while `open` is `false`; it does not keep its body mounted/hidden, so any internal state inside its children resets each time it's reopened.
- `Modal.Close`, `Modal.CloseButton`, and `Modal.ActionButton` must be found among `Modal`'s direct children (via `Children.toArray` + type check) to be wired up and slotted — they're stripped from the regular `body` content and re-inserted into their grid areas.
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- `.eink-modal` uses `grid-template-areas: "title close" / "body body" / "footer footer"` to enforce the fixed slot layout described above — specific to this component.
- Overlay background modifiers (`--white`, `--black`, `--transparent`, `--semi-transparent`) map to dedicated tokens `var(--eink-color-overlay-white)`, `var(--eink-color-overlay-black)`, `var(--eink-color-overlay-transparent)`, `var(--eink-color-overlay-semi-transparent)`.
- Size modifiers (`--sm`, `--md`, `--xl`) map to `var(--eink-size-320)`, `var(--eink-size-480)`, `var(--eink-size-720)` max-widths.
- Uses `var(--eink-z-index-modal)` to stack above other page content.

---

## Related Concepts
- `../button/button.component.tsx` — provides `Button`, `Button.Outlined`, and `Button.IconNaked` used for the modal's close/action controls.
