import { useCallback, useState } from "react";

/**
 * Manages a boolean toggle value, with the setter accepting either a new
 * explicit value or no argument to flip the current one.
 *
 * @param initialValue - The initial boolean value. Defaults to `false`.
 * @returns A `[value, toggle]` tuple.
 *
 * @example
 * ```tsx
 * const [isOpen, toggleOpen] = useToggle();
 * toggleOpen(); // flips the value
 * toggleOpen(true); // sets it explicitly
 * ```
 */
export function useToggle(initialValue?: boolean): [boolean, (value?: boolean) => void] {
  const [on, setOn] = useState(() =>
    typeof initialValue === "boolean" ? initialValue : Boolean(initialValue),
  );

  const handleToggle = useCallback((value?: boolean) => {
    if (typeof value === "boolean") return setOn(value);
    return setOn((v) => !v);
  }, []);

  return [on, handleToggle];
}
