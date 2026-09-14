---
type: hooks
title: "Hooks"
description: "26 dependency-free React hooks (state, storage, browser/device APIs, DOM sensors, effects/timing), ported from uidotdev/usehooks for use across this library's components and consuming apps."
tags: [react, e-ink, hooks, okf-v0.2]
resource: "src/hooks/"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T20:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T20:00:00Z)
---

# Hooks

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop/return signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- **26 ported hooks** covering state, storage, browser/device APIs, DOM sensors, and effect/timing utilities — see the [uidotdev/usehooks](https://github.com/uidotdev/usehooks) credit below.
- **Dependency-free:** every hook uses only React and native browser APIs, no runtime dependencies added.
- **Public API surface:** all hooks (and their exported types) are re-exported from `src/index.ts` alongside the components.
- **Storybook `Hooks` page** (`src/hooks/hooks.mdx`) documents the same catalog for browsing outside the codebase.

---

## Code Conventions
- One folder per hook under `src/hooks/`: `use-<name>/use-<name>.hook.ts` + `use-<name>.hook.test.ts`, matching the per-component folder convention used elsewhere in this repo.
- Shared storage helpers live in `src/utils/storage.utils.ts` (used by `useLocalStorage`/`useSessionStorage`), not duplicated per hook.
- Every exported hook has a JSDoc description, with `@example` for non-trivial ones.
- Tests use `@testing-library/react`'s `renderHook`/`act` against `jsdom`, stubbing any browser API `jsdom` doesn't implement (`localStorage`, `matchMedia`, `IntersectionObserver`, `ResizeObserver`, `navigator.geolocation`, `navigator.connection`, clipboard, etc.) directly in the test file.

---

## Primary Use Cases
- **State** — bounded counters, debounced/throttled values, toggles, undo/redo, previous-value tracking, first-render detection.
- **Storage** — `useState`-like APIs backed by `localStorage`/`sessionStorage`, synced across tabs.
- **Browser / device APIs** — clipboard, geolocation, network status, screen orientation, preferred language, tab visibility, `fetch`.
- **DOM / sensors** — intersection/resize observers, body-scroll locking, window scroll/size tracking, event listeners, key presses, page-leave detection.
- **Effects / timing** — declarative `setInterval`/`setTimeout`.

---

## Limits & Restrictions
- 🚫 **Browser-only:** hooks that touch `window`/`navigator`/`document` (storage, geolocation, network, orientation, scroll, etc.) assume a browser environment and are not SSR-safe without a mount check.
- 🚫 **No new runtime dependencies:** hooks must stay implementable with React + native browser APIs only, to keep the library lightweight on low-powered e-ink hardware.
- 🚫 **Not a full port:** only the 26 hooks listed below are ported here; the upstream project has more — see [uidotdev/usehooks](https://github.com/uidotdev/usehooks) for the rest.

---

## Hook Catalog

A huge thank-you to the contributors of [uidotdev/usehooks](https://github.com/uidotdev/usehooks)
(ui.dev). The hooks below were adapted from that project so this repo didn't have to reinvent a set of
solid, well-tested React hooks from scratch. The original collection has more hooks than are ported here
— go have a look, and if you find it useful, give it a star. It's MIT licensed (Copyright (c) 2023
ui.dev), which is what makes this port possible; attribution is preserved here and in the Storybook
`Hooks` page.

### State

#### `useCounter(startingValue?, options?)`

Bounded numeric counter with increment/decrement/set/reset actions.

```tsx
const [count, { increment, decrement, reset }] = useCounter(0, { min: 0, max: 10 });
```

#### `useDebounce(value, delay)`

Returns `value`, updated only after `delay` ms of no further changes.

```tsx
const debouncedQuery = useDebounce(query, 300);
```

#### `useThrottle(value, interval?)`

Returns `value`, updated at most once per `interval` ms.

```tsx
const throttledScrollY = useThrottle(scrollY, 200);
```

#### `useToggle(initialValue?)`

Boolean state with a toggle function that also accepts an explicit value.

```tsx
const [isOpen, toggleOpen] = useToggle(false);
```

#### `useHistoryState(initialPresent)`

Undo/redo state container.

```tsx
const { state, set, undo, redo, canUndo, canRedo } = useHistoryState("");
```

#### `usePrevious(value)`

Returns the value from the previous render (`null` on the first render).

```tsx
const previousCount = usePrevious(count);
```

#### `useIsFirstRender()`

Returns `true` only on the component's first render.

```tsx
const isFirstRender = useIsFirstRender();
```

### Storage

#### `useLocalStorage(key, initialValue?)`

`useState`-like API backed by `window.localStorage`, synced across tabs via the `storage` event.

```tsx
const [name, setName] = useLocalStorage("name", "Ada");
```

#### `useSessionStorage(key, initialValue?)`

Same as `useLocalStorage` but backed by `window.sessionStorage`.

```tsx
const [draft, setDraft] = useSessionStorage("draft", "");
```

### Browser / device APIs

#### `useCopyToClipboard()`

Copies text to the clipboard (`navigator.clipboard`, with a legacy `execCommand` fallback).

```tsx
const [copiedText, copyToClipboard] = useCopyToClipboard();
```

#### `useGeolocation(options?)`

Tracks the device's geolocation via `navigator.geolocation`.

```tsx
const { latitude, longitude, loading, error } = useGeolocation();
```

#### `useNetworkState()`

Tracks online/offline status and connection info (`navigator.onLine` + the Network Information API).

```tsx
const { online, effectiveType } = useNetworkState();
```

#### `useOrientation()`

Tracks screen orientation angle and type.

```tsx
const { angle, type } = useOrientation();
```

#### `usePreferredLanguage()`

Tracks `navigator.language`, updating on `languagechange`.

```tsx
const language = usePreferredLanguage();
```

#### `useVisibilityChange()`

Returns `true` while the document is visible (tab focused/foregrounded).

```tsx
const isVisible = useVisibilityChange();
```

#### `useFetch<T>(url, options?)`

Fetches JSON from `url`, aborting in-flight requests on unmount or `url` change.

```tsx
const { data, error, loading } = useFetch<User[]>("/api/users");
```

### DOM / sensors

#### `useIntersectionObserver<T>(options?)`

Ref callback + `IntersectionObserverEntry` for the observed element.

```tsx
const [ref, entry] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.5 });
```

#### `useMeasure<T>()`

Ref callback + live `{ width, height }` via `ResizeObserver`.

```tsx
const [ref, { width, height }] = useMeasure<HTMLDivElement>();
```

#### `useLockBodyScroll()`

Locks `document.body` scrolling for the lifetime of the calling component (e.g. while a modal is open).

```tsx
useLockBodyScroll();
```

#### `useWindowScroll()`

Tracks `window.scrollX`/`scrollY` and exposes a typed `scrollTo`.

```tsx
const [{ x, y }, scrollTo] = useWindowScroll();
```

#### `useWindowSize()`

Tracks `window.innerWidth`/`innerHeight`.

```tsx
const { width, height } = useWindowSize();
```

#### `useEventListener(eventName, handler, element?, options?)`

Attaches an event listener to `window`, `document`, or a ref'd element, with automatic cleanup.

```tsx
useEventListener("keydown", (e) => console.log(e.key));
```

#### `useKeyPress(targetKey)`

Returns `true` while `targetKey` is held down.

```tsx
const isEscapePressed = useKeyPress("Escape");
```

#### `usePageLeave(onPageLeave)`

Calls `onPageLeave` when the mouse leaves the browser viewport.

```tsx
usePageLeave(() => console.log("bye!"));
```

### Effects / timing

#### `useInterval(callback, delay)`

Declarative `setInterval`; pass `delay: null` to pause.

```tsx
useInterval(() => setTick((t) => t + 1), 1000);
```

#### `useTimeout(callback, delay)`

Declarative `setTimeout`; pass `delay: null` to cancel.

```tsx
useTimeout(() => setVisible(false), 3000);
```

---

## Related Concepts
- [uidotdev/usehooks](https://github.com/uidotdev/usehooks) — the upstream source of these hooks; has more hooks than are ported here.
- `src/hooks/hooks.mdx` — the same catalog rendered as a Storybook documentation page.
- `src/utils/storage.utils.ts` — shared `dispatchStorageEvent` helper used by the storage hooks.
- `src/About.mdx` — mentions the `Hooks` sidebar section.
