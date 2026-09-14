import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePageLeave } from "./use-page-leave.hook";

describe("usePageLeave", () => {
  it("invokes the callback when the mouse leaves without a related target", () => {
    const onPageLeave = vi.fn();
    renderHook(() => usePageLeave(onPageLeave));

    act(() => {
      document.dispatchEvent(new MouseEvent("mouseleave", { relatedTarget: null }));
    });

    expect(onPageLeave).toHaveBeenCalledTimes(1);
  });

  it("does not invoke the callback when moving between elements within the page", () => {
    const onPageLeave = vi.fn();
    const other = document.createElement("div");

    renderHook(() => usePageLeave(onPageLeave));

    act(() => {
      document.dispatchEvent(new MouseEvent("mouseleave", { relatedTarget: other }));
    });

    expect(onPageLeave).not.toHaveBeenCalled();
  });

  it("removes the listener on unmount", () => {
    const onPageLeave = vi.fn();
    const { unmount } = renderHook(() => usePageLeave(onPageLeave));

    unmount();

    act(() => {
      document.dispatchEvent(new MouseEvent("mouseleave", { relatedTarget: null }));
    });

    expect(onPageLeave).not.toHaveBeenCalled();
  });
});
