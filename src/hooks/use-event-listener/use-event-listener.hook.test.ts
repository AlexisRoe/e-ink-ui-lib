import { act, renderHook } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { useEventListener } from "./use-event-listener.hook";

describe("useEventListener", () => {
  it("invokes the handler when the event fires on window", () => {
    const handler = vi.fn();
    renderHook(() => useEventListener("resize", handler));

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("invokes the handler when the event fires on document", () => {
    const handler = vi.fn();
    renderHook(() => useEventListener("click", handler, document));

    act(() => {
      document.dispatchEvent(new Event("click"));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("invokes the handler when the event fires on a ref'd element", () => {
    const handler = vi.fn();
    const element = document.createElement("button");
    document.body.appendChild(element);

    renderHook(() => {
      const ref = useRef<HTMLButtonElement | null>(element);
      useEventListener("click", handler, ref);
    });

    act(() => {
      element.dispatchEvent(new Event("click"));
    });

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(element);
  });

  it("always calls the latest handler without re-attaching the listener", () => {
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    const { rerender } = renderHook(({ handler }) => useEventListener("resize", handler), {
      initialProps: { handler: firstHandler },
    });

    rerender({ handler: secondHandler });

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(firstHandler).not.toHaveBeenCalled();
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });

  it("removes the listener on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEventListener("resize", handler));

    unmount();

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(handler).not.toHaveBeenCalled();
  });
});
