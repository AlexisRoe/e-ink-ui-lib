import { useEffect, useState } from "react";

/** State returned by {@link useFetch}. */
export type FetchState<T> = {
  /** The parsed response body, or `undefined` until the request resolves. */
  data: T | undefined;
  /** The error thrown by the request, if any. */
  error: Error | undefined;
  /** `true` while the request is in flight. */
  loading: boolean;
};

/**
 * Fetches JSON from `url` and tracks its loading/data/error state. The
 * in-flight request is aborted on unmount or whenever `url` changes.
 *
 * @param url - URL to fetch, or `null`/`undefined` to skip fetching.
 * @param options - Native `fetch` options.
 * @returns The current `{ data, error, loading }` state.
 *
 * @example
 * ```tsx
 * const { data, error, loading } = useFetch<User[]>("/api/users");
 * ```
 */
export function useFetch<T = unknown>(
  url: string | null | undefined,
  options?: RequestInit,
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    error: undefined,
    loading: true,
  });

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    setState((previous) => ({ ...previous, loading: true }));

    fetch(url, { ...options, signal: controller.signal })
      .then((response) => response.json() as Promise<T>)
      .then((data) => {
        setState({ data, error: undefined, loading: false });
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setState({
          data: undefined,
          error: error instanceof Error ? error : new Error(String(error)),
          loading: false,
        });
      });

    return () => controller.abort();
  }, [url, options]);

  return state;
}
