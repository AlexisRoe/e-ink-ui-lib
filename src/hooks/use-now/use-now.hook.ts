import { useState } from "react";
import { useInterval } from "../use-interval/use-interval.hook";

/**
 * Current time in epoch milliseconds, refreshed every `intervalMs`.
 *
 * @param intervalMs - Refresh interval in milliseconds, or `null` to pause updates.
 * @returns `Date.now()` as of the last tick.
 *
 * @example
 * ```tsx
 * const now = useNow(60_000);
 * const expired = now > deadline;
 * ```
 */
export function useNow(intervalMs: number | null): number {
  const [now, setNow] = useState(() => Date.now());
  useInterval(() => setNow(Date.now()), intervalMs);
  return now;
}
