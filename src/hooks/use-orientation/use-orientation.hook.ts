import { useLayoutEffect, useState } from "react";

/** Current screen orientation angle and type. */
export interface OrientationState {
  /** Rotation angle in degrees. */
  angle: number;
  /** Orientation type, e.g. `"landscape-primary"`, or `"UNKNOWN"` as a fallback. */
  type: string;
}

/**
 * Tracks the device's screen orientation, preferring the `screen.orientation`
 * API and falling back to the deprecated `orientationchange` event/
 * `window.orientation` where the modern API is unavailable.
 *
 * @returns The current {@link OrientationState}.
 *
 * @example
 * ```tsx
 * const { angle, type } = useOrientation();
 * ```
 */
export function useOrientation(): OrientationState {
  const [orientation, setOrientation] = useState<OrientationState>({
    angle: 0,
    type: "landscape-primary",
  });

  useLayoutEffect(() => {
    const handleChange = () => {
      const { angle, type } = window.screen.orientation;
      setOrientation({ angle, type });
    };

    const handleOrientationChange = () => {
      const legacyAngle = (window as Window & { orientation?: number }).orientation ?? 0;
      setOrientation({ type: "UNKNOWN", angle: legacyAngle });
    };

    if (window.screen?.orientation) {
      handleChange();
      window.screen.orientation.addEventListener("change", handleChange);
    } else {
      handleOrientationChange();
      window.addEventListener("orientationchange", handleOrientationChange);
    }

    return () => {
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener("change", handleChange);
      } else {
        window.removeEventListener("orientationchange", handleOrientationChange);
      }
    };
  }, []);

  return orientation;
}
