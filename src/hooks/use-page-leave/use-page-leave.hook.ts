import { useEffect } from "react";

/**
 * Invokes `onPageLeave` when the mouse leaves the viewport (as opposed to
 * moving between elements within the page).
 *
 * @param onPageLeave - Called when the cursor leaves the browser viewport.
 *
 * @example
 * ```tsx
 * usePageLeave(() => setShowExitPrompt(true));
 * ```
 */
export function usePageLeave(onPageLeave: () => void): void {
  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) onPageLeave();
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [onPageLeave]);
}
