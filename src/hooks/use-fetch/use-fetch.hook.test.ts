import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFetch } from "./use-fetch.hook";

describe("useFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts in a loading state", () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;

    const { result } = renderHook(() => useFetch<{ id: number }>("/api/thing"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it("returns parsed data on success", async () => {
    const payload = { id: 1 };
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(payload),
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useFetch<{ id: number }>("/api/thing"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBeUndefined();
  });

  it("returns an error when the request fails", async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error("network error")) as unknown as typeof fetch;

    const { result } = renderHook(() => useFetch("/api/thing"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeUndefined();
  });

  it("does not fetch when url is null", () => {
    globalThis.fetch = vi.fn() as unknown as typeof fetch;

    renderHook(() => useFetch(null));

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("aborts the in-flight request on unmount", () => {
    const abort = vi.fn();
    const originalAbortController = globalThis.AbortController;
    globalThis.AbortController = vi.fn(function MockAbortController(this: {
      abort: typeof abort;
      signal: AbortSignal;
    }) {
      this.abort = abort;
      this.signal = {} as AbortSignal;
    }) as unknown as typeof AbortController;

    globalThis.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;

    const { unmount } = renderHook(() => useFetch("/api/thing"));
    unmount();

    expect(abort).toHaveBeenCalledTimes(1);
    globalThis.AbortController = originalAbortController;
  });
});
