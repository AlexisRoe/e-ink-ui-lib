import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDownload } from "./use-download.hook";

describe("useDownload", () => {
  it("returns a stable download function that triggers a file download", () => {
    URL.createObjectURL = vi.fn(() => "blob:x");
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const { result, rerender } = renderHook(() => useDownload());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);

    result.current("hello", "hello.txt");
    expect(click).toHaveBeenCalledTimes(1);
    click.mockRestore();
  });
});
