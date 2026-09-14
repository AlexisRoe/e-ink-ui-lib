---
type: component
title: "Icon"
description: "A curated registry of Tabler icons rendered through a single, name-based Icon component."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/icons/icon.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Icon

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `icons.ts` defines a curated `iconRegistry` mapping a fixed set of names (e.g. `search`, `home`, `check`, `plus`, `minus`, `star`, `trash`, `upload`, `download`, `calendar`, chevrons/arrows, alert/status icons, etc.) to `@tabler/icons-react` components.
- `Icon` (`icon.tsx`) is the single public entry point: it looks up a component from `iconRegistry` by the required `name` prop and renders it, forwarding all other Tabler icon props (e.g. `size`, `color`, `aria-hidden`, `className`).
- `IconName` is derived as `keyof typeof iconRegistry`, so only registered names are valid at the type level.
- `iconNames` exports the full list of available names for iteration (e.g. for a Storybook icon gallery).
- `TablerIconComponent`/`TablerIconProps` types are derived from the registry itself, keeping prop typing in sync with whichever Tabler icon components are registered.
- Re-exports the underlying Tabler icon components backing the registry.

---

## Code Conventions
- Icons live in `src/components/icons/` per CLAUDE.md: `icon.tsx` (the component) + `icons.ts` (the registry), built on `@tabler/icons-react`.
- Only icon names exported via `iconRegistry`/`IconName` should be used elsewhere in the library, keeping the icon set curated rather than allowing arbitrary Tabler icons to be imported ad hoc.
- `Icon` itself renders no wrapping markup and defines no CSS — it is a thin lookup-and-render component with no `.component.css` file.

---

## Primary Use Cases
- Any component needing a consistent, curated icon (buttons, checkboxes, accordions, file upload, breadcrumbs, etc.) references an icon by name via `<Icon name="..." />` instead of importing a Tabler icon directly.
- Enumerating all available icons (via `iconNames`) for documentation or a Storybook icon-picker story.

---

## Limits & Restrictions
- Only names present in `iconRegistry` can be passed to `name` — this is enforced by the `IconName` type, so consumers cannot render arbitrary Tabler icons through `Icon` without first adding them to the registry.
- No component-specific restrictions beyond standard theme token usage; icon color/size are controlled via standard SVG/Tabler props rather than dedicated CSS classes.

---

## Related Concepts
- Used throughout the library, including `../accordion/accordion.component.tsx` (`plus`/`minus`), `../breadcrumbs/breadcrumbs.component.tsx` (`home`), `../checkbox/checkbox.component.tsx` (`check`), and `../file-upload/file-upload.component.tsx` (`upload`).
