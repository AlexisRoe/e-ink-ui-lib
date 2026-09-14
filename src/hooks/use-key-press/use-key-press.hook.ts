import { useEffect, useState } from "react";

/**
 * Tracks whether a given keyboard key is currently pressed, listening on
 * `window` for `keydown`/`keyup` events.
 *
 * @param targetKey - The `KeyboardEvent.key` value to track (e.g. `"Escape"`).
 * @returns `true` while `targetKey` is held down, `false` otherwise.
 *
 * @example
 * ```tsx
 * const isEscapePressed = useKeyPress("Escape");
 * ```
 */
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) setKeyPressed(true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === targetKey) setKeyPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [targetKey]);

  return keyPressed;
}
