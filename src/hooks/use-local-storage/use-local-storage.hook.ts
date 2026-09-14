import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import { dispatchStorageEvent } from "../../utils/storage.utils";

function setLocalStorageItem<T>(key: string, value: T): void {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
}

function removeLocalStorageItem(key: string): void {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
}

function getLocalStorageItem(key: string): string | null {
  return window.localStorage.getItem(key);
}

function useLocalStorageSubscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getLocalStorageServerSnapshot(): never {
  throw new Error("useLocalStorage is a client-only hook");
}

/**
 * Persists state to `localStorage`, keeping all hook instances (including
 * across tabs) in sync via the `storage` event.
 *
 * @param key - The `localStorage` key to read from and write to.
 * @param initialValue - Value used to seed storage when `key` is not yet set.
 * @returns A `[value, setValue]` tuple, mirroring `useState`.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage("theme", "light");
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
): [T, Dispatch<SetStateAction<T>>] {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot,
  );

  const setState: Dispatch<SetStateAction<T>> = useCallback(
    (v) => {
      try {
        const nextState =
          typeof v === "function"
            ? (v as (prevState: T) => T)(store ? (JSON.parse(store) as T) : (initialValue as T))
            : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store, initialValue],
  );

  useEffect(() => {
    if (getLocalStorageItem(key) === null && typeof initialValue !== "undefined") {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? (JSON.parse(store) as T) : (initialValue as T), setState];
}
