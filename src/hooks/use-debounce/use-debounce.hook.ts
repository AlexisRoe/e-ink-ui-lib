import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates once `delay`
 * milliseconds have passed without `value` changing again.
 *
 * @param value - The value to debounce.
 * @param delay - The debounce delay in milliseconds.
 * @returns The debounced value.
 *
 * @example
 * ```tsx
 * const debouncedQuery = useDebounce(query, 300);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
