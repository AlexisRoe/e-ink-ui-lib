/** Decides whether a media query string matches in {@link stubMatchMedia}. */
export type MatchMediaMatcher = (query: string) => boolean;

/**
 * Installs a `window.matchMedia` stub for tests; jsdom does not implement it
 * and components such as `Page` and `ThemeProvider` consumers read it.
 *
 * @param matcher - Decides which queries match. By default none do.
 *
 * @example
 * ```ts
 * stubMatchMedia((query) => query.includes("max-width: 767px"));
 * ```
 */
export function stubMatchMedia(matcher: MatchMediaMatcher = () => false): void {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: matcher(query),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    }),
  });
}
