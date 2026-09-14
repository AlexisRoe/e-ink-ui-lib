/**
 * Shallowly compares two plain records: same key count and `===` per value.
 * Used to detect whether form data has changed from its initial values
 * without paying for a deep comparison.
 *
 * @example
 * ```ts
 * shallowEqual({ name: "Ada" }, { name: "Ada" }); // true
 * shallowEqual({ name: "Ada" }, { name: "Grace" }); // false
 * ```
 */
export function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  if (a === b) return true;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every((key) => Object.is(a[key], b[key]));
}
