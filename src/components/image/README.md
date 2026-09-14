---
type: component
title: "Image"
description: "Image with an e-ink-friendly placeholder icon on a black background shown until loaded, or permanently when no src is given."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/image/image.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Image

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Fixed-size container (`width`/`height` in pixels, required) with an optional `aspectRatio` applied alongside them
- Shows a `photo-alt` placeholder icon on a black background until the `<img>` fires its `onLoad`, or permanently when `src` is an empty string
- Loads lazily via native `loading="lazy"` and `decoding="async"` attributes
- `fit` prop (`ImageFit`: `"cover" | "contain" | "fill" | "none" | "scale-down"`, defaults to `"cover"`) maps directly to CSS `object-fit`
- `withBorder` toggles a `2px` solid black border around the image frame (defaults to `true`)
- Optional `label` renders visible caption text below the image (via the `Label` component) and doubles as the accessible name; otherwise a plain `alt` is required (`ImageLabelProps` makes `label` and `alt` mutually exclusive)

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base classes with the `eink-image__frame--bordered` modifier and any consumer `className`
- BEM classes prefixed `eink-`: block `.eink-image`, elements `__frame`, `__img`, `__placeholder`, `__placeholder-icon`, `__label`; modifier `.eink-image__frame--bordered`
- Imports its own stylesheet via `import "./image.component.css"`
- Reuses shared components: `Icon` (`src/components/icons/icon.tsx`) for the placeholder, `Label` (`src/components/label/label.component.tsx`) for the optional caption

---

## Primary Use Cases
- Displaying photos/illustrations in a UI where slow or failed image loads must degrade gracefully to a clear placeholder rather than a broken-image icon or blank flash, matching e-ink's low-refresh-rate constraints
- Content lists or galleries where a labeled thumbnail with a fixed frame size is needed (e.g. `<Image src="/office.jpeg" width={320} height={200} label="Office" />`)
- Deliberately empty/placeholder image slots (`src=""`) before content is available

---

## Limits & Restrictions
- `width` and `height` are required
- Exactly one of `label` or `alt` must be provided — enforced as a compile-time error by `ImageLabelProps`
- `fit` is restricted to the `ImageFit` union mirroring CSS `object-fit` values
- An empty `src` string always renders the placeholder, regardless of load state

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-primary`, `--eink-color-secondary`, `--eink-border-medium`, `--eink-size-*`)
- The `img` element's opacity/`transition: opacity 0.2s ease-in-out` fade-in on load is the one non-token, component-specific style detail

---

## Related Concepts
- `src/components/icons/icon.tsx` — renders the placeholder icon
- `src/components/label/label.component.tsx` — renders the optional caption below the image
