---
type: component
title: "Link"
description: "Anchor styled for the e-ink theme, with external-link, visited, mono, and disabled states."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/link/link.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Link

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a native `<a>` styled with an underline matching the e-ink theme.
- `external` opens the link in a new tab with `rel="noopener noreferrer"` and shows an external-link icon before the text.
- `alreadyClicked` renders the link in dark grey to indicate it has been visited.
- `mono` (only effective combined with `alreadyClicked`) renders the visited link in black with a dashed underline instead of grey/solid.
- `disabled` strikes through the link text and makes it non-interactive: `href` is dropped, `tabIndex` is `-1`, `aria-disabled` is set, and clicks are prevented.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-link`, element `.eink-link__icon`, modifiers `.eink-link--clicked`, `.eink-link--mono`, `.eink-link--disabled`.
- Imports its own stylesheet via `import "./link.component.css"`.
- Uses the shared `Icon` component with the curated `"external-link"` icon name.

---

## Primary Use Cases
- In-app navigation links and outbound links to external resources within body text or lists.
- Indicating previously visited links (e.g. in a reading history or article list) via `alreadyClicked`, with `mono` as an alternative visited style for higher-contrast/dashed presentation.
- Rendering a link as visibly unavailable (e.g. a feature not yet accessible) via `disabled` without removing it from the layout.

---

## Limits & Restrictions
- `target` and `rel` are omitted from the accepted anchor attributes — they are always computed internally based on `external`/`disabled` and cannot be overridden directly.
- `mono` has no visible effect unless `alreadyClicked` is also `true`.
- When `disabled`, `href` is stripped and `onClick` is replaced with a handler that calls `preventDefault()`, so the passed-in `onClick` will not fire.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined beyond the global theme tokens (`--eink-size-4`, `--eink-color-primary`, `--eink-color-grey-40`, `--eink-color-disabled`).

---

## Related Concepts
- `src/components/icons/` — provides the external-link icon shown when `external` is set.
