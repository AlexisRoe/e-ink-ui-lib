import { useCallback, useState } from "react";

/** Options constraining the range of a `useCounter` value. */
export interface UseCounterOptions {
  /** Minimum allowed value (inclusive). */
  min?: number;
  /** Maximum allowed value (inclusive). */
  max?: number;
}

/** The actions returned alongside the current count from `useCounter`. */
export interface CustomCounterActions {
  /** Increments the count by 1, clamped to `max`. */
  increment: () => void;
  /** Decrements the count by 1, clamped to `min`. */
  decrement: () => void;
  /** Sets the count to a specific value, clamped to `min`/`max`. */
  set: (nextCount: number) => void;
  /** Resets the count back to the initial starting value. */
  reset: () => void;
}

/**
 * Manages a numeric counter with optional `min`/`max` bounds.
 *
 * @param startingValue - The initial count. Defaults to `0`.
 * @param options - Optional `min`/`max` bounds for the count.
 * @returns A `[count, actions]` tuple.
 *
 * @example
 * ```tsx
 * const [count, { increment, decrement, set, reset }] = useCounter(0, { min: 0, max: 10 });
 * ```
 */
export function useCounter(
  startingValue = 0,
  options: UseCounterOptions = {},
): [number, CustomCounterActions] {
  const { min, max } = options;

  if (typeof min === "number" && startingValue < min) {
    throw new Error(`Your starting value of ${startingValue} is less than your min of ${min}.`);
  }
  if (typeof max === "number" && startingValue > max) {
    throw new Error(`Your starting value of ${startingValue} is greater than your max of ${max}.`);
  }

  const [count, setCount] = useState(startingValue);

  const increment = useCallback(() => {
    setCount((c) => {
      const n = c + 1;
      if (typeof max === "number" && n > max) return c;
      return n;
    });
  }, [max]);

  const decrement = useCallback(() => {
    setCount((c) => {
      const n = c - 1;
      if (typeof min === "number" && n < min) return c;
      return n;
    });
  }, [min]);

  const set = useCallback(
    (nextCount: number) => {
      setCount((c) => {
        if (typeof max === "number" && nextCount > max) return c;
        if (typeof min === "number" && nextCount < min) return c;
        return nextCount;
      });
    },
    [max, min],
  );

  const reset = useCallback(() => {
    setCount(startingValue);
  }, [startingValue]);

  return [count, { increment, decrement, set, reset }];
}
