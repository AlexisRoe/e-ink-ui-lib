import { useRef, useSyncExternalStore } from "react";
import { shallowEqual } from "../../utils/shallow-equal.utils";

/** Minimal shape of the non-standard `NetworkInformation` API. */
interface NetworkInformation extends EventTarget {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

/** Snapshot of the browser's current network connectivity. */
export interface NetworkState {
  /** Whether the browser reports being online. */
  online: boolean;
  /** Effective downlink speed in megabits per second, or `null` if unknown. */
  downlink: number | null;
  /** Maximum downlink speed in megabits per second, or `null` if unknown. */
  downlinkMax: number | null;
  /** Effective connection type, e.g. `"4g"`, or `null` if unknown. */
  effectiveType: string | null;
  /** Estimated round-trip time in milliseconds, or `null` if unknown. */
  rtt: number | null;
  /** Whether the user has requested reduced data usage, or `null` if unknown. */
  saveData: boolean | null;
  /** Underlying connection type, e.g. `"wifi"`, or `null` if unknown. */
  type: string | null;
}

function getConnection(): NetworkInformation | undefined {
  const nav = navigator as NavigatorWithConnection;
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

function useNetworkStateSubscribe(callback: () => void): () => void {
  window.addEventListener("online", callback, { passive: true });
  window.addEventListener("offline", callback, { passive: true });

  const connection = getConnection();
  connection?.addEventListener("change", callback, { passive: true } as AddEventListenerOptions);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
    connection?.removeEventListener("change", callback);
  };
}

function getNetworkStateServerSnapshot(): never {
  throw new Error("useNetworkState is a client-only hook");
}

/**
 * Tracks the browser's online status and, where supported, the underlying
 * `navigator.connection` details (downlink speed, connection type, etc).
 *
 * @returns The current {@link NetworkState}.
 *
 * @example
 * ```tsx
 * const { online, effectiveType } = useNetworkState();
 * ```
 */
export function useNetworkState(): NetworkState {
  const cache = useRef<NetworkState>({
    online: true,
    downlink: null,
    downlinkMax: null,
    effectiveType: null,
    rtt: null,
    saveData: null,
    type: null,
  });

  const getSnapshot = () => {
    const online = navigator.onLine;
    const connection = getConnection();

    const nextState: NetworkState = {
      online,
      downlink: connection?.downlink ?? null,
      downlinkMax: connection?.downlinkMax ?? null,
      effectiveType: connection?.effectiveType ?? null,
      rtt: connection?.rtt ?? null,
      saveData: connection?.saveData ?? null,
      type: connection?.type ?? null,
    };

    if (
      shallowEqual(
        cache.current as unknown as Record<string, unknown>,
        nextState as unknown as Record<string, unknown>,
      )
    ) {
      return cache.current;
    }

    cache.current = nextState;
    return nextState;
  };

  return useSyncExternalStore(useNetworkStateSubscribe, getSnapshot, getNetworkStateServerSnapshot);
}
