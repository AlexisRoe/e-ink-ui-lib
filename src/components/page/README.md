---
type: component
title: "Page"
description: "A full-page CSS grid layout composite with sticky header/footer, a foldable/collapsible side nav, and an independently scrollable body, responsive across desktop, tablet, and mobile."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/page/page.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Page

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Composite of `Page.Header` (sticky top), `Page.Nav` (foldable, left or right via `navSide`), `Page.Body` (independently scrollable `<main>`), and `Page.Footer` (sticky bottom), arranged with CSS grid.
- Nav open/closed state can be uncontrolled (`defaultNavOpen`, default `true`) or fully controlled (`navOpen` + `onNavOpenChange`), e.g. to sync with a router.
- `collapsedMode` (`"hidden"` default, or `"rail"`) controls how `Page.Nav` renders while folded on desktop/tablet: fully removed from the grid, or collapsed to a slim icon-only rail. Has no effect on mobile.
- Responsive at a mobile breakpoint of `max-width: 767px` (matched in both JS via `matchMedia` and CSS via media query): below it, `Page.Nav` is forced closed by default, and opening it becomes a full-screen overlay that traps Tab focus, closes on Escape or `Page.NavCloseButton`, locks background scroll (`document.body.style.overflow = "hidden"`), and returns focus to `Page.NavToggle` on close.
- `Page.NavToggle` (placed in the header) opens/closes the nav; folds it in/out of the grid on desktop/tablet, or opens it as a full-screen overlay on mobile.
- `Page.NavCloseButton` (placed inside `Page.Nav`) is only visually relevant on mobile, where it's the way to dismiss the full-screen nav overlay.
- `Page.Header` and `Page.Footer` each accept `withBorder` (default `true`) to render a 2px border along their inner edge.
- `Page.Nav` accepts `mono` to use a plain white background instead of the default light grey.
- Throws a runtime error (`"Page.<Component> can only be used inside a Page"`) if `Page.Nav`, `Page.NavToggle`, or `Page.NavCloseButton` are rendered outside a `Page`.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging across `Page` and all its sub-components.
- BEM classes prefixed `eink-`: `.eink-page` with `--nav-left`/`--nav-right`/`--nav-open`/`--nav-closed`/`--nav-rail` modifiers, `.eink-page__header`/`__footer` with `--border`, `.eink-page__body`, `.eink-page__nav` with `--mono`/`--open`/`--rail`, `.eink-page__nav-toggle`, `.eink-page__nav-close`.
- Imports its own `page.component.css` directly.
- Coordinates sub-components via React context (`PageContext`), with a `usePageContext(component)` hook that throws if used outside `Page`.
- Uses the shared `Button.IconNaked` from `../button/button.component` for `Page.NavToggle` (`menu` icon) and `Page.NavCloseButton` (`close` icon).
- Sets `data-eink-component="page"` on the root element.
- `Page.Header`, `Page.Footer`, `Page.Body`, `Page.Nav`, `Page.NavToggle`, `Page.NavCloseButton` are all attached as static properties on `Page`.

---

## Primary Use Cases
- Top-level application shell: header with a nav toggle and title, a side navigation menu, a scrollable main content area, and a footer.
- Dashboards that want the nav collapsed to an icon rail rather than fully hidden when folded (`collapsedMode="rail"`), noted in the stories as useful "for e-ink dashboards where a fully-hidden nav is one extra tap away too often".
- Apps needing the nav's open state synced with external state (e.g. a router) via the controlled `navOpen`/`onNavOpenChange` props.

---

## Limits & Restrictions
- `Page.Nav`, `Page.NavToggle`, and `Page.NavCloseButton` must be rendered inside a `Page` — using them standalone throws an error via `usePageContext`.
- `Page` fills the full viewport (`100vh`/`100%`), so per its own stories it must be viewed in a full browser tab/window (not a small embedded canvas) to see the breakpoint behavior correctly.
- On mobile, `collapsedMode="rail"` has no effect — the nav is always either fully hidden or a full-screen overlay there.
- When `navOpen` is controlled, `onNavOpenChange` is required to actually change state — `Page.NavToggle`/`Page.NavCloseButton` will call it, but nothing changes unless the consumer updates `navOpen` in response.

---

## Component-Specific CSS & Tokens
- Grid areas (`"header header" / "nav body" / "footer footer"`, collapsing to a single column on mobile) are defined specifically for this component's layout.
- Breakpoints are hardcoded in the CSS (mobile `<768px`, tablet `768–1023px`, desktop `>=1024px`) as documented in a comment at the top of `page.component.css`, and mirrored in JS via the `MOBILE_MEDIA_QUERY` constant (`"(max-width: 767px)"`).
- Rail width uses `var(--eink-size-64)`; nav width uses `var(--eink-size-320)`; sticky header/footer z-index uses `var(--eink-z-index-modal)`; mobile full-screen nav overlay uses `var(--eink-z-index-notification)`.
- `.eink-page__nav--rail` also hides `.eink-navigation-item__label`/`__chevron` and centers `.eink-navigation-item__trigger`, coupling this component's rail mode to `Navigation`'s item markup.

---

## Related Concepts
- `../navigation` — the navigation menu component typically placed inside `Page.Nav` (its item classes are directly referenced by `Page`'s rail-mode CSS).
- `../button/button.component.tsx` — provides `Button.IconNaked` used for the nav toggle/close controls.
- `../breadcrumbs/README.md` — another navigation-related component that could be placed in `Page.Header` or `Page.Body`.
