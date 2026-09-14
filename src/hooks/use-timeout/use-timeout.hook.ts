import { useEffect, useRef } from "react";

/**
 * Runs `callback` once after `delay` milliseconds, cancelling it whenever
 * `delay` is `null`. The latest `callback` is always used without resetting
 * the timeout.
 *
 * @param callback - Function invoked once the timeout elapses.
 * @param delay - Delay in milliseconds, or `null` to cancel.
 *
 * @example
 * ```tsx
 * useTimeout(() => setVisible(false), 3000);
 * ```
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);
}
