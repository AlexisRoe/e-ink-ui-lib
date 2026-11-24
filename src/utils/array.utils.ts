/** Random number source returning a value in `[0, 1)`; defaults to `Math.random` where accepted. */
export type Rng = () => number;

/**
 * Moves the element at `from` by `delta` positions and returns a new array.
 * Returns an unchanged copy when the target position is out of range.
 *
 * @example
 * ```ts
 * move(["a", "b", "c"], 0, 1); // ["b", "a", "c"]
 * ```
 */
export function move<T>(items: readonly T[], from: number, delta: number): T[] {
  const to = from + delta;
  if (from < 0 || from >= items.length || to < 0 || to >= items.length) return [...items];
  const copy = [...items];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved as T);
  return copy;
}

/**
 * Fisher–Yates shuffle returning a new array.
 *
 * @param rng - Random source; pass a seeded function for reproducible results.
 */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

/**
 * Deterministic reorder that never returns the input order for two or more
 * items: odd-indexed items reversed, followed by the even-indexed ones. Handy
 * for ordering exercises that must not start out solved, without randomness.
 *
 * @example
 * ```ts
 * scramble(["a", "b", "c", "d"]); // ["d", "b", "a", "c"]
 * ```
 */
export function scramble<T>(items: readonly T[]): T[] {
  if (items.length < 2) return [...items];
  const odd = items.filter((_, i) => i % 2 === 1);
  const even = items.filter((_, i) => i % 2 === 0);
  return [...odd.reverse(), ...even];
}
