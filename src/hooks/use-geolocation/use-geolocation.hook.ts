import { useEffect, useRef, useState } from "react";

/** Current geolocation state as reported by the browser's Geolocation API. */
export interface GeolocationState {
  /** `true` until the first position (or error) has been received. */
  loading: boolean;
  /** Accuracy of the latitude/longitude in meters, or `null` if unknown. */
  accuracy: number | null;
  /** Altitude in meters above sea level, or `null` if unavailable. */
  altitude: number | null;
  /** Accuracy of the altitude in meters, or `null` if unavailable. */
  altitudeAccuracy: number | null;
  /** Heading in degrees clockwise from true north, or `null` if unavailable. */
  heading: number | null;
  /** Latitude in decimal degrees, or `null` before the first reading. */
  latitude: number | null;
  /** Longitude in decimal degrees, or `null` before the first reading. */
  longitude: number | null;
  /** Speed in meters per second, or `null` if unavailable. */
  speed: number | null;
  /** Timestamp (ms since epoch) of the last reading, or `null` before the first one. */
  timestamp: number | null;
  /** The last `GeolocationPositionError`, or `null` if none occurred. */
  error: GeolocationPositionError | null;
}

/**
 * Tracks the device's current geolocation, updating as the browser reports
 * new positions via `watchPosition`.
 *
 * @param options - Standard `PositionOptions` passed to the Geolocation API.
 * @returns The current {@link GeolocationState}.
 *
 * @example
 * ```tsx
 * const { loading, latitude, longitude, error } = useGeolocation();
 * ```
 */
export function useGeolocation(options: PositionOptions = {}): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
  });

  const optionsRef = useRef(options);

  useEffect(() => {
    const onEvent = ({ coords, timestamp }: GeolocationPosition) => {
      setState({
        loading: false,
        timestamp,
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
        error: null,
      });
    };

    const onEventError = (error: GeolocationPositionError) => {
      setState((s) => ({ ...s, loading: false, error }));
    };

    navigator.geolocation.getCurrentPosition(onEvent, onEventError, optionsRef.current);
    const watchId = navigator.geolocation.watchPosition(onEvent, onEventError, optionsRef.current);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
