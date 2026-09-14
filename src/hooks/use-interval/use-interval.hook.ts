import { useEffect, useRef } from "react";

/**
 * Runs `callback` on a repeating interval, pausing whenever `delay` is `null`.
 * The latest `callback` is always used without resetting the interval.
 *
 * @param callback - Function invoked on every tick.
 * @param delay - Interval duration in milliseconds, or `null` to pause.
 *
 * @example
 * ```tsx
 * useInterval(() => setCount((c) => c + 1), isRunning ? 1000 : null);
 * ```
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}
