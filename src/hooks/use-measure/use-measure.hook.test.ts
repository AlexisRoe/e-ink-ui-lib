import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMeasure } from "./use-measure.hook";

type ObserverCallback = (entries: ResizeObserverEntry[]) => void;

class FakeResizeObserver {
  callback: ObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(callback: ObserverCallback) {
    this.callback = callback;
  }
}

describe("useMeasure", () => {
  let instances: FakeResizeObserver[] = [];

  beforeEach(() => {
    instances = [];
    vi.stubGlobal(
      "ResizeObserver",
      class extends FakeResizeObserver {
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

  it("starts with null dimensions", () => {
    const { result } = renderHook(() => useMeasure<HTMLDivElement>());
    expect(result.current[1]).toEqual({ width: null, height: null });
  });

  it("observes the attached node and updates dimensions", () => {
    const { result } = renderHook(() => useMeasure<HTMLDivElement>());
    const node = document.createElement("div");

    act(() => {
      result.current[0](node);
    });

    expect(instances).toHaveLength(1);
    expect(instances[0]?.observe).toHaveBeenCalledWith(node);

    const fakeEntry = {
      borderBoxSize: [{ inlineSize: 100, blockSize: 50 }],
    } as unknown as ResizeObserverEntry;

    act(() => {
      instances[0]?.callback([fakeEntry]);
    });

    expect(result.current[1]).toEqual({ width: 100, height: 50 });
  });

  it("disconnects the previous observer when the ref changes", () => {
    const { result } = renderHook(() => useMeasure<HTMLDivElement>());
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
