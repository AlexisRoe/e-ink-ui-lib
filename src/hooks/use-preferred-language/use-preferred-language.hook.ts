import { useSyncExternalStore } from "react";

function usePreferredLanguageSubscribe(callback: () => void): () => void {
  window.addEventListener("languagechange", callback);
  return () => window.removeEventListener("languagechange", callback);
}

function getPreferredLanguageSnapshot(): string {
  return navigator.language;
}

function getPreferredLanguageServerSnapshot(): never {
  throw new Error("usePreferredLanguage is a client-only hook");
}

/**
 * Tracks the user's preferred browser language (`navigator.language`),
 * updating when the user changes their browser/OS language settings.
 *
 * @returns The current preferred language, e.g. `"en-US"`.
 *
 * @example
 * ```tsx
 * const language = usePreferredLanguage();
 * ```
 */
export function usePreferredLanguage(): string {
  return useSyncExternalStore(
    usePreferredLanguageSubscribe,
    getPreferredLanguageSnapshot,
    getPreferredLanguageServerSnapshot,
  );
}
