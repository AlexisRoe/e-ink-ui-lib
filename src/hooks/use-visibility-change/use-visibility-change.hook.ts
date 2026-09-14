import { useSyncExternalStore } from "react";

function useVisibilityChangeSubscribe(callback: () => void): () => void {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function getVisibilityChangeSnapshot(): DocumentVisibilityState {
  return document.visibilityState;
}

function getVisibilityChangeServerSnapshot(): never {
  throw new Error("useVisibilityChange is a client-only hook");
}

/**
 * Tracks whether the document is currently visible to the user, based on
 * the Page Visibility API.
 *
 * @returns `true` when `document.visibilityState` is `"visible"`.
 *
 * @example
 * ```tsx
 * const isVisible = useVisibilityChange();
 * ```
 */
export function useVisibilityChange(): boolean {
  const visibilityState = useSyncExternalStore(
    useVisibilityChangeSubscribe,
    getVisibilityChangeSnapshot,
    getVisibilityChangeServerSnapshot,
  );

  return visibilityState === "visible";
}
