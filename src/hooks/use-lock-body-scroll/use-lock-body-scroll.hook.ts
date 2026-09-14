import { useLayoutEffect } from "react";

/**
 * Locks the document body's scroll for as long as the calling component is
 * mounted, restoring the previous `overflow` value on unmount.
 *
 * @example
 * ```tsx
 * function Modal() {
 *   useLockBodyScroll();
 *   return <div className="eink-modal" />;
 * }
 * ```
 */
export function useLockBodyScroll(): void {
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}
