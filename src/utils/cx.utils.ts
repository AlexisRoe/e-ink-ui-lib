/**
 * Joins an optional base class name with any number of conditional class
 * names, each paired with its own boolean.
 *
 * @param base - Class name that is always applied, or `undefined` to omit a base.
 * @param conditions - `[className, condition]` tuples; `className` is included only when `condition` is `true`.
 * @returns The resulting class name string, with falsy parts removed.
 *
 * @example
 * ```tsx
 * cx("eink-button", ["eink-button--pressed", isPressed])
 * ```
 */
export function cx(
  base: string | undefined,
  ...conditions: Array<[className: string, condition: boolean]>
): string {
  return [base, ...conditions.map(([className, condition]) => (condition ? className : null))]
    .filter(Boolean)
    .join(" ");
}
