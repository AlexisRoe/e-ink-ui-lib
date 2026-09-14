---
type: component
title: "ThemeProvider"
description: "Root provider that loads the e-ink design-token stylesheet and exposes theme context (themeApplied, a cx helper) to descendants via useTheme()."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/theme/theme.provider.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# ThemeProvider

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Imports `theme.css` (the design-token stylesheet: `--eink-size-*`, `--eink-color-*`, `--eink-z-index-*`, `--eink-border-*` custom properties, plus `@font-face` declarations for "JetBrains Mono" and "Inter"), applying the base e-ink theme wherever it's mounted.
- Exposes a React context (`ThemeContext`) with `themeApplied: true` and a `cx` class-name helper, both accessible via `useTheme()`.
- The `cx` value exposed through context has the same signature/behavior as the shared `cx()` utility from `src/utils/cx.utils.ts` (in fact it's a direct re-export), letting consumers merge base + conditional classes based on theme state.
- `useTheme()` throws an explicit error ("useTheme must be used within a ThemeProvider") when called outside a `ThemeProvider`, rather than silently returning a default/null value.

---

## Code Conventions
- Uses the shared `cx()` utility from `src/utils/cx.utils.ts` internally, and exposes that exact function as `ThemeContextValue.cx`.
- Has no accompanying `.component.css` (theming lives in `theme.css`, imported directly by this provider); per CLAUDE.md, `theme.css` is also imported globally in `.storybook/preview.tsx` so stories render styled without needing `ThemeProvider` ancestry.
- File is named `theme.provider.tsx` rather than `theme.component.tsx`, reflecting that it's a context provider rather than a rendering component with its own markup — it renders only `ThemeContext.Provider` wrapping `children`, no DOM element of its own.

---

## Primary Use Cases
- Wrapping an application's root once to load the e-ink design tokens and font faces globally.
- Components/consumers that want to confirm the theme is active (`themeApplied`) or use the shared `cx` helper without importing the utility module directly.

---

## Limits & Restrictions
- `useTheme()` must be called from a component rendered inside `ThemeProvider`; calling it elsewhere throws at runtime rather than failing silently.
- `ThemeProvider` itself renders no visible DOM wrapper — it's a pure context/side-effect (stylesheet import) provider, not a layout component.
- No component-specific restrictions beyond standard theme token usage — this component *is* the source of those tokens.

---

## Component-Specific CSS & Tokens
- `theme.css` defines the entire token set consumed by every other component in this library: sizing (`--eink-size-2` through `--eink-size-720`), color (`--eink-color-primary`/`secondary`/`background`/`disabled`, a `--eink-color-grey-10` through `-90` scale, overlay colors), z-index (`--eink-z-index-modal`, `--eink-z-index-notification`), and font-face declarations for "JetBrains Mono" and "Inter" (loaded from `src/assets/`).
- Per CLAUDE.md, new one-off values should be added as tokens here rather than hardcoded in individual component CSS files.

---

## Related Concepts
- Every other component in `src/components/` depends on the tokens defined in `theme.css` and imported by this provider.
- `../../utils/cx.utils.ts` — the shared className-merge helper re-exposed through `useTheme().cx`.
