---
type: component
title: "Code"
description: "Inline and block code display with a light or inverted (mono) background; no syntax color coding since e-ink renders in greyscale."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/code/code.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Code

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `Code` renders an inline `<code>` snippet with a light grey background by default.
- `Code.Block` (`Block`) renders a multi-line `<pre><code>` block, preserving whitespace/indentation exactly as authored.
- Both accept a `mono` flag that swaps the light grey background for a black background with white text (inverted contrast) instead of the default light grey.
- Deliberately has no syntax color coding, since e-ink displays render in greyscale.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-code`, block-variant `.eink-code__block`, modifiers `.eink-code--mono` / `.eink-code__block--mono`.
- Imports its own stylesheet via `import "./code.component.css"`.
- `Block` is attached to `Code` as `Code.Block` for compound-component usage.

---

## Primary Use Cases
- Displaying short inline code references (commands, variable names, file paths) within body text via `Code`.
- Displaying multi-line code samples or terminal output with preserved formatting via `Code.Block`.
- Using `mono` to visually emphasize a snippet (e.g. a terminal/command block) with inverted contrast on an e-ink screen.

---

## Limits & Restrictions
- No syntax highlighting/color coding is provided or planned, by design, since e-ink screens render in greyscale.
- `Code.Block` renders `children` inside a nested `<code>`; both components accept standard HTML attributes (`HTMLAttributes<HTMLElement>` / `HTMLAttributes<HTMLPreElement>`) but no other custom props beyond `mono`.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined; styling is built entirely from global theme tokens (`--eink-font-family-main`, `--eink-font-size-default`, `--eink-size-*`, `--eink-border-thin`, `--eink-color-grey-90`, `--eink-color-primary`, `--eink-color-secondary`).

---

## Related Concepts
- None directly coupled; can be combined with typography components (e.g. `src/components/description/`) when documenting technical content.
