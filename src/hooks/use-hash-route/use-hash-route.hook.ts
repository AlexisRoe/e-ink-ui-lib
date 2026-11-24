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
  /** Scrolls the window and the scrolled `<main>` containers (e.g. `Page.Body`) to the top, see {@link scrollToTop}. Defaults to `true`. */
  scrollToTop?: boolean;
}

/**
 * Scrolls the window and every scroll container around the page content back
 * to the top. The containers are found from `<main>` upwards, including
 * `<main>` itself, because `Page.Body` is a `<main>` that scrolls on its own.
 *
 * @example
 * ```tsx
 * <Button onClick={scrollToTop}>Back to top</Button>
 * ```
 */
export function scrollToTop(): void {
  window.scrollTo?.(0, 0);
  for (const main of document.querySelectorAll("main")) {
    for (let element: Element | null = main; element; element = element.parentElement) {
      if (element.scrollTop > 0) element.scrollTop = 0;
    }
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
