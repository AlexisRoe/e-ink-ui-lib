---
type: component
title: "RichText"
description: "Renders text with **bold** markers as Highlight marks, never as HTML."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/rich-text/rich-text.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-11-24T00:00:00Z)
---

# RichText

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `**text**` becomes a `Highlight` (`<mark>`); everything else is rendered as plain text
- `parseRichText` is exported for custom renderers and tests
- `mono` switches the emphasis to the wave underline of `Highlight`

---

## Code Conventions
- Renders React text nodes only, never HTML strings; no `dangerouslySetInnerHTML`, so it is safe under a strict CSP and for untrusted text
- One wrapping `<span>` keeps the content in one inline flow inside flex containers (list items, alerts)

---

## Primary Use Cases
- Content strings from data files with light emphasis
- Alert and list text where `Highlight` is needed inside a plain string

---

## Limits & Restrictions
- Only `**bold**` is supported; no nesting, links, italics or escaping
