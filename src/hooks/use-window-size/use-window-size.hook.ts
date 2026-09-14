import { useLayoutEffect, useState } from "react";

/**
 * The window's inner dimensions. Both fields are `null` until the first
 * measurement (immediately on mount).
 */
export interface WindowSize {
  width: number | null;
  height: number | null;
}

/**
 * Tracks the window's inner width and height, updating on resize.
 *
 * @returns The current `{ width, height }` of the window.
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 * ```
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({ width: null, height: null });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}
