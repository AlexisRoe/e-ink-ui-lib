import { useCallback, useRef, useState } from "react";

/**
 * Dimensions reported by {@link useMeasure}. Both fields are `null` until the
 * observed element has been measured at least once.
 */
export interface Measurement {
  width: number | null;
  height: number | null;
}

/**
 * Measures an element's border-box size using `ResizeObserver`, exposing a
 * ref callback to attach and the latest dimensions.
 *
 * @returns A tuple of `[ref, dimensions]` where `ref` must be attached to the measured element.
 *
 * @example
 * ```tsx
 * const [ref, { width, height }] = useMeasure<HTMLDivElement>();
 * return <div ref={ref}>{width}x{height}</div>;
 * ```
 */
export function useMeasure<T extends Element>(): [(node: T | null) => void, Measurement] {
  const [dimensions, setDimensions] = useState<Measurement>({ width: null, height: null });
  const previousObserver = useRef<ResizeObserver | null>(null);

  const customRef = useCallback((node: T | null) => {
    if (previousObserver.current) {
      previousObserver.current.disconnect();
      previousObserver.current = null;
    }

    if (node?.nodeType === Node.ELEMENT_NODE) {
      const observer = new ResizeObserver(([entry]) => {
        if (entry?.borderBoxSize) {
          const borderBoxSize = Array.isArray(entry.borderBoxSize)
            ? entry.borderBoxSize[0]
            : entry.borderBoxSize;

          if (borderBoxSize) {
            const { inlineSize: width, blockSize: height } = borderBoxSize;
            setDimensions({ width, height });
          }
        }
      });

      observer.observe(node);
      previousObserver.current = observer;
    }
  }, []);

  return [customRef, dimensions];
}
