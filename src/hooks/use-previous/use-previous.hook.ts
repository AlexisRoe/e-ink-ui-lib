import { useState } from "react";

/**
 * Returns the previous render's value of `value`, or `null` before it has
 * changed for the first time.
 *
 * @param value - The value to track.
 * @returns The previous value, or `null`.
 *
 * @example
 * ```tsx
 * const previousCount = usePrevious(count);
 * ```
 */
export function usePrevious<T>(value: T): T | null {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState<T | null>(null);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}
