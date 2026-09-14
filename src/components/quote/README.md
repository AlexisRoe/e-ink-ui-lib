---
type: component
title: "Quote"
description: "Semantic blockquote with a thick left border, optional citation, and a plain black-and-white 'mono' mode."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/quote/quote.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Quote

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a semantic `<blockquote>` with the quoted text wrapped in a `<p className="eink-quote__text">`
- Optional `cite` prop renders a `<cite>` element below the text as `— {cite}`, styled as a small, muted, italic label
- `mono` (default `false`) switches from a light grey background to a plain black-and-white presentation, also changing the citation's color to full contrast
- Left border accent (`border-left`) using a thick border token

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-quote` class, the conditional `eink-quote--mono` modifier, and an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-quote`, `.eink-quote--mono`, `.eink-quote__text`, `.eink-quote__cite`
- Imports its own `quote.component.css` directly
- All colors, spacing, and borders reference design tokens (`--eink-color-*`, `--eink-size-*`, `--eink-border-thick`, `--eink-font-family-secondary`, `--eink-font-size-default`) rather than hardcoded literals
- Extends `BlockquoteHTMLAttributes<HTMLElement>` so all native blockquote attributes are passed through
- JSDoc on `QuoteProps` and `Quote`, including an `@example`

---

## Primary Use Cases
- Highlighting a quoted passage of text with an optional attributed source (author/work)
- `mono` mode for contexts needing pure black-and-white contrast instead of the default light grey background, useful on e-ink displays where grey fills refresh/render less crisply than solid black/white

---

## Limits & Restrictions
- No required props beyond the implicit need for `children` to have visible content; `cite` is optional and only rendered when provided
- Only one boolean visual mode (`mono`) is offered; there is no equivalent of Pill's multiple border-style variants

---

## Related Concepts
- [Text](../text/text.component.tsx) — general-purpose typographic component for non-quoted body copy
