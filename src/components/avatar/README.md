---
type: component
title: "Avatar"
description: "Square avatar showing either a user's initials on a solid background or a user's photo, with an optional notification badge."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/avatar/avatar.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Avatar

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `Avatar` renders a square badge with a user's initials (derived from the first letter of up to the first two words of `userName`) on a solid background.
- `Avatar.Profile` (`AvatarProfile`) renders a user's photo (`src`), falling back to a user icon on a solid background when no `src` is provided.
- Three sizes: `sm`, `md`, `xl` (defaults to `md`).
- Optional `notification` prop renders a small badge on the top-right corner.
- `AvatarProfile` supports a `mono` flag that renders the photo in grayscale with boosted contrast, for e-ink-friendly rendering of photographic content.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base BEM classes with any caller-supplied `className`.
- BEM classes prefixed `eink-`: block `.eink-avatar`, elements `.eink-avatar__initials`, `.eink-avatar__fallback-icon`, `.eink-avatar__notification`, `.eink-avatar__image`, modifiers `.eink-avatar--sm|md|xl`, `.eink-avatar--initials|fallback|image`.
- Imports its own stylesheet via `import "./avatar.component.css"`.
- Uses the shared `Icon` component (`src/components/icons/icon.tsx`) with the curated `"user"` icon name for the photo fallback.
- `AvatarProfile` is attached to `Avatar` as `Avatar.Profile` for compound-component usage.

---

## Primary Use Cases
- Showing a signed-in user's identity in a header/nav bar via initials when no photo is available.
- Displaying a user's profile photo in lists, cards, or settings screens via `Avatar.Profile`.
- Indicating unread notifications/alerts tied to a user via the `notification` badge.
- Rendering photos in strict black-and-white via `mono` for e-ink screens with limited grayscale fidelity.

---

## Limits & Restrictions
- `userName` is required on both `Avatar` and `AvatarProfile` (used for initials or as `alt`/accessible label text).
- `children` is explicitly omitted from both prop types — content cannot be passed as children, only via the documented props.
- `AvatarProfile` shows either the image (`src`) or the fallback icon, never both.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined; sizes, colors, and borders are all consumed from the global theme tokens (`--eink-size-*`, `--eink-color-primary`, `--eink-color-secondary`, `--eink-border-medium`, `--eink-border-width-medium`).
- Notable modifier classes: `.eink-avatar--sm|md|xl` (size), `.eink-avatar--initials|fallback|image` (content mode), `.eink-avatar__image--mono` (grayscale/high-contrast filter).

---

## Related Concepts
- `src/components/icons/` — the `Icon` component used for the photo fallback.
