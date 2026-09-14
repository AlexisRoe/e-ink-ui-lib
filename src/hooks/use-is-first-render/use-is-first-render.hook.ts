import { useRef } from "react";

/**
 * Returns `true` only during the component's first render, `false` on every
 * subsequent render.
 *
 * @returns Whether this is the first render of the calling component.
 *
 * @example
 * ```tsx
 * const isFirstRender = useIsFirstRender();
 * ```
 */
export function useIsFirstRender(): boolean {
  const renderRef = useRef(true);

  if (renderRef.current === true) {
    renderRef.current = false;
    return true;
  }

  return renderRef.current;
}
