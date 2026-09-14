import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGeolocation } from "./use-geolocation.hook";

type SuccessCallback = (position: GeolocationPosition) => void;
type ErrorCallback = (error: GeolocationPositionError) => void;

describe("useGeolocation", () => {
  let getCurrentPosition: ReturnType<typeof vi.fn>;
  let watchPosition: ReturnType<typeof vi.fn>;
  let clearWatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getCurrentPosition = vi.fn();
    watchPosition = vi.fn(() => 1);
    clearWatch = vi.fn();

    Object.defineProperty(navigator, "geolocation", {
      value: { getCurrentPosition, watchPosition, clearWatch },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in a loading state", () => {
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("updates state when a position is received", async () => {
    const { result } = renderHook(() => useGeolocation());

    const position = {
      coords: {
        latitude: 1,
        longitude: 2,
        altitude: 3,
        accuracy: 4,
        altitudeAccuracy: 5,
        heading: 6,
        speed: 7,
      },
      timestamp: 12345,
    } as GeolocationPosition;

    act(() => {
      (getCurrentPosition.mock.calls[0][0] as SuccessCallback)(position);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.latitude).toBe(1);
    expect(result.current.longitude).toBe(2);
    expect(result.current.timestamp).toBe(12345);
    expect(result.current.error).toBeNull();
  });

  it("updates state when an error is received", async () => {
    const { result } = renderHook(() => useGeolocation());

    const error = { code: 1, message: "denied" } as GeolocationPositionError;

    act(() => {
      (getCurrentPosition.mock.calls[0][1] as ErrorCallback)(error);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toEqual(error);
  });

  it("clears the watch on unmount", () => {
    const { unmount } = renderHook(() => useGeolocation());
    unmount();
    expect(clearWatch).toHaveBeenCalledWith(1);
  });
});
