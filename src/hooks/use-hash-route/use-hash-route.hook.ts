import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const getHash = () => window.location.hash;
const getServerHash = () => "";

/**
 * Current location hash as a route, re-rendering on `hashchange`. A minimal,
 * dependency-free router for apps that navigate with `#/path` links, for
 * example with `Navigation` items.
 *
 * @param parse - Maps the raw hash (e.g. `"#/lessons/3"`) to your own route type. Defaults to the hash without the leading `#` (`"/lessons/3"`).
 *
 * @example
 * ```tsx
 * const route = useHashRoute(); // "/lessons/3"
 * const parsed = useHashRoute((hash) => parseMyRoute(hash));
 * ```
 */
export function useHashRoute(): string;
export function useHashRoute<T>(parse: (hash: string) => T): T;
export function useHashRoute<T>(parse?: (hash: string) => T): T | string {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  return parse ? parse(hash) : hash.replace(/^#/, "");
}

/** Options accepted by {@link navigate}. */
export interface NavigateOptions {
  /** Scrolls the window and every scrolled ancestor of `<main>` (e.g. `Page.Body`) to the top. Defaults to `true`. */
  scrollToTop?: boolean;
}

function scrollToTop(): void {
  window.scrollTo?.(0, 0);
  const main = document.querySelector("main");
  for (let element = main?.parentElement; element; element = element.parentElement) {
    if (element.scrollTop > 0) element.scrollTop = 0;
  }
}

/**
 * Navigates to a hash route, optionally scrolling to the top. Pairs with
 * {@link useHashRoute}.
 *
 * @param route - Hash such as `"#/lessons/3"`, or a path such as `"/lessons/3"` (the `#` is added).
 *
 * @example
 * ```ts
 * navigate("/lessons/3");
 * ```
 */
export function navigate(
  route: string,
  { scrollToTop: scroll = true }: NavigateOptions = {},
): void {
  const hash = route.startsWith("#") ? route : `#${route}`;
  if (window.location.hash !== hash) window.location.hash = hash;
  if (scroll) scrollToTop();
}
