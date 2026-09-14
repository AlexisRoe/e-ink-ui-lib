import { useCallback, useLayoutEffect, useState } from "react";

/**
 * The window's current scroll position. Both fields are `null` until the
 * first measurement (immediately on mount).
 */
export interface WindowScrollPosition {
  x: number | null;
  y: number | null;
}

/**
 * Scrolls the window, accepting either a `ScrollToOptions` object or explicit
 * `x`/`y` coordinates.
 */
export type ScrollToFn = (xOrOptions: number | ScrollToOptions, y?: number) => void;

/**
 * Tracks the window's scroll position and provides a helper to scroll it.
 *
 * @returns A tuple of `[position, scrollTo]`.
 *
 * @example
 * ```tsx
 * const [{ x, y }, scrollTo] = useWindowScroll();
 * scrollTo({ top: 0, behavior: "smooth" });
 * ```
 */
export function useWindowScroll(): [WindowScrollPosition, ScrollToFn] {
  const [state, setState] = useState<WindowScrollPosition>({ x: null, y: null });

  const scrollTo = useCallback<ScrollToFn>((xOrOptions, y) => {
    if (typeof xOrOptions === "object") {
      window.scrollTo(xOrOptions);
    } else if (typeof xOrOptions === "number" && typeof y === "number") {
      window.scrollTo(xOrOptions, y);
    } else {
      throw new Error("Invalid arguments passed to scrollTo.");
    }
  }, []);

  useLayoutEffect(() => {
    const handleScroll = () => {
      setState({ x: window.scrollX, y: window.scrollY });
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return [state, scrollTo];
}
