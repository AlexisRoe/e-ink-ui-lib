import { useCallback, useRef, useState } from "react";

/**
 * Observes an element's intersection with its root (or the viewport) using
 * `IntersectionObserver`, exposing a ref callback to attach and the latest entry.
 *
 * @param options - Standard `IntersectionObserverInit` options (`threshold`, `root`, `rootMargin`).
 * @returns A tuple of `[ref, entry]` where `ref` must be attached to the observed element.
 *
 * @example
 * ```tsx
 * const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
 * return <div ref={ref}>{entry?.isIntersecting ? "Visible" : "Hidden"}</div>;
 * ```
 */
export function useIntersectionObserver<T extends Element>(
  options: IntersectionObserverInit = {},
): [(node: T | null) => void, IntersectionObserverEntry | null] {
  const { threshold = 1, root = null, rootMargin = "0px" } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const previousObserver = useRef<IntersectionObserver | null>(null);

  const customRef = useCallback(
    (node: T | null) => {
      if (previousObserver.current) {
        previousObserver.current.disconnect();
        previousObserver.current = null;
      }

      if (node?.nodeType === Node.ELEMENT_NODE) {
        const observer = new IntersectionObserver(
          ([observedEntry]) => {
            setEntry(observedEntry ?? null);
          },
          { threshold, root, rootMargin },
        );

        observer.observe(node);
        previousObserver.current = observer;
      }
    },
    [threshold, root, rootMargin],
  );

  return [customRef, entry];
}
