# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

`e-ink-ui-lib` is a React component library purpose-built for e-ink screens and tablets. Components and tokens must respect e-ink display constraints (contrast, refresh behavior) rather than assuming a normal LCD/OLED screen.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — typecheck (`tsconfig.build.json`) then build the library with Vite
- `npm test` / `npm run test:watch` — run Vitest once / in watch mode
- `npx vitest run path/to/file.test.tsx` — run a single test file
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` / `npm run lint:fix` — Biome check / check with autofix
- `npm run format` — Biome format
- `npm run storybook` — Storybook dev server on port 6006
- `npm run build-storybook` — static Storybook build

Always run `typecheck`, `test`, and `lint` before considering a change done.

## Folder structure

- `src/components/<component-name>/` — one folder per component, folder and file names lowercase (dash-separated if multi-word)
- `src/utils/` — framework-agnostic helper functions, not part of the public API unless explicitly re-exported
- `src/tokens/` — design token documentation (Storybook `.mdx` pages)
- `src/index.ts` — the public API surface; only export what consumers should use

## File naming convention

Per component folder, e.g. `src/components/button/`:
- `button.component.tsx` / `button.component.css` — implementation and styles
- `button.test.tsx` — Vitest tests
- `button.stories.tsx` — Storybook stories

Utility files use `<name>.utils.ts` and live in `src/utils/`, each with a co-located `<name>.utils.test.ts`.

## Architecture notes

- `theme.provider.tsx` (`src/components/theme/`) exposes `ThemeProvider`/`useTheme` and imports `theme.css` (the design tokens: `--eink-size-*`, `--eink-color-*`, `--eink-border-*`, font-faces). `theme.css` is also imported globally in `.storybook/preview.tsx` so stories render styled without needing `ThemeProvider` ancestry.
- `cx` (`src/utils/cx.utils.ts`) is the shared className-merge helper: `cx(base, [className, condition], ...)`. Every component that conditionally merges classes must use this — never reimplement `.filter(Boolean).join(" ")` locally.
- Icons live in `src/components/icons/` (`icon.tsx` component + `icons.ts` registry built on `@tabler/icons-react`); only exported icon names should be used to keep the icon set curated.

## Documentation

- Every exported component/prop uses JSDoc (`/** ... */`) with a short description; non-trivial components include an `@example`.
- Every component has a `.stories.tsx` with a `title` under `Components/<Group>/<Name>` (groups: Actions, Data Display, Layout, Typography), `tags: ["autodocs"]`, and `argTypes` for controllable props — Storybook autodocs is the primary rendered documentation, JSDoc is the primary in-editor documentation.
- `src/About.mdx` and `src/tokens/*.mdx` are hand-written Storybook doc pages (project overview, design tokens) rather than autodocs.

## CSS conventions

- BEM-style classes prefixed `eink-`: block `.eink-button`, element `.eink-button__icon`, modifier `.eink-button--filled`. Never use raw/generic class names.
- Never hardcode sizes, colors, or borders — use the design tokens from `theme.css` (`var(--eink-size-*)`, `var(--eink-color-*)`, `var(--eink-border-*)`). Add a new token there instead of a one-off literal.
- One `<component>.component.css` per component, imported directly by its `.component.tsx` (`import "./button.component.css"`).

## Storybook conventions

- Sidebar is sorted alphabetically (`storySort: { method: "alphabetical" }` in `.storybook/preview.tsx`); story titles' group prefixes control the logical subgrouping.
- The "What's New" and "Guide" onboarding tabs are disabled (`.storybook/main.ts`: `core.disableWhatsNewNotifications`, `features.menuOnboardingChecklist`/`sidebarOnboardingChecklist`) — do not re-enable them.
- `theme.css` must stay imported in `.storybook/preview.tsx`; without it no component has access to its design tokens in Storybook.
