import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import { dispatchStorageEvent } from "../../utils/storage.utils";

function setSessionStorageItem<T>(key: string, value: T): void {
  const stringifiedValue = JSON.stringify(value);
  window.sessionStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
}

function removeSessionStorageItem(key: string): void {
  window.sessionStorage.removeItem(key);
  dispatchStorageEvent(key, null);
}

function getSessionStorageItem(key: string): string | null {
  return window.sessionStorage.getItem(key);
}

function useSessionStorageSubscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionStorageServerSnapshot(): never {
  throw new Error("useSessionStorage is a client-only hook");
}

/**
 * Persists state to `sessionStorage`, keeping all hook instances in the same
 * tab in sync via the `storage` event.
 *
 * @param key - The `sessionStorage` key to read from and write to.
 * @param initialValue - Value used to seed storage when `key` is not yet set.
 * @returns A `[value, setValue]` tuple, mirroring `useState`.
 *
 * @example
 * ```tsx
 * const [draft, setDraft] = useSessionStorage("draft", "");
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  initialValue?: T,
): [T, Dispatch<SetStateAction<T>>] {
  const getSnapshot = () => getSessionStorageItem(key);

  const store = useSyncExternalStore(
    useSessionStorageSubscribe,
    getSnapshot,
    getSessionStorageServerSnapshot,
  );

  const setState: Dispatch<SetStateAction<T>> = useCallback(
    (v) => {
      try {
        const nextState =
          typeof v === "function"
            ? (v as (prevState: T) => T)(store ? (JSON.parse(store) as T) : (initialValue as T))
            : v;

        if (nextState === undefined || nextState === null) {
          removeSessionStorageItem(key);
        } else {
          setSessionStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store, initialValue],
  );

  useEffect(() => {
    if (getSessionStorageItem(key) === null && typeof initialValue !== "undefined") {
      setSessionStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? (JSON.parse(store) as T) : (initialValue as T), setState];
}
