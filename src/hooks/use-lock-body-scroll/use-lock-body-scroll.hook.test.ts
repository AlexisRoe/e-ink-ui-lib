import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLockBodyScroll } from "./use-lock-body-scroll.hook";

describe("useLockBodyScroll", () => {
  it("sets the body overflow to hidden while mounted", () => {
    const { unmount } = renderHook(() => useLockBodyScroll());
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
  });

  it("restores the original overflow value on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = renderHook(() => useLockBodyScroll());
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});
