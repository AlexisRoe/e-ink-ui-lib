import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./use-copy-to-clipboard.hook";

describe("useCopyToClipboard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with a null copied value", () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current[0]).toBeNull();
  });

  it("copies text using the Clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current[1]("hello");
    });

    expect(writeText).toHaveBeenCalledWith("hello");
    await waitFor(() => expect(result.current[0]).toBe("hello"));
  });

  it("falls back to document.execCommand when Clipboard API is unavailable", async () => {
    Object.assign(navigator, { clipboard: undefined });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.assign(document, { execCommand });

    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current[1]("fallback");
    });

    expect(execCommand).toHaveBeenCalledWith("copy");
    await waitFor(() => expect(result.current[0]).toBe("fallback"));
  });
});
