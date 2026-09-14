import { useEffect, useRef, useState } from "react";

/**
 * Returns a throttled copy of `value` that updates at most once per
 * `interval` milliseconds.
 *
 * @param value - The value to throttle.
 * @param interval - The minimum time in milliseconds between updates. Defaults to `500`.
 * @returns The throttled value.
 *
 * @example
 * ```tsx
 * const throttledScrollY = useThrottle(scrollY, 200);
 * ```
 */
export function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => window.clearTimeout(id);
    }
  }, [value, interval]);

  return throttledValue;
}
