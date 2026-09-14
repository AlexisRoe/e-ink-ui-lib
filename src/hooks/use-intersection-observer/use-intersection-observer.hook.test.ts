import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIntersectionObserver } from "./use-intersection-observer.hook";

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

class FakeIntersectionObserver {
  callback: ObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(callback: ObserverCallback) {
    this.callback = callback;
  }
}

describe("useIntersectionObserver", () => {
  let instances: FakeIntersectionObserver[] = [];

  beforeEach(() => {
    instances = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class extends FakeIntersectionObserver {
        constructor(callback: ObserverCallback) {
          super(callback);
          instances.push(this);
        }
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts with a null entry", () => {
    const { result } = renderHook(() => useIntersectionObserver());
    expect(result.current[1]).toBeNull();
  });

  it("observes the attached node and updates the entry", () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    expect(instances).toHaveLength(1);
    expect(instances[0]?.observe).toHaveBeenCalledWith(node);

    const fakeEntry = { isIntersecting: true } as IntersectionObserverEntry;
    act(() => {
      instances[0]?.callback([fakeEntry]);
    });

    expect(result.current[1]).toBe(fakeEntry);
  });

  it("disconnects the previous observer when the ref changes", () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const nodeA = document.createElement("div");
    const nodeB = document.createElement("div");

    act(() => {
      result.current[0](nodeA);
    });
    const firstObserver = instances[0];

    act(() => {
      result.current[0](nodeB);
    });

    expect(firstObserver?.disconnect).toHaveBeenCalled();
    expect(instances).toHaveLength(2);
  });
});
