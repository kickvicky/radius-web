import { useEffect, useState } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}

// Evaluate support once — outside the component so it's never recalculated.
// `typeof navigator` guard keeps this SSR-safe (Next.js server renders too).
const isSupported =
  typeof navigator !== "undefined" && !!navigator.geolocation;

export function useGeolocation(): GeolocationState {
  // Derive the initial state synchronously so the effect never needs to call
  // setState in its own synchronous body (which would cause cascading renders).
  const [state, setState] = useState<GeolocationState>(() => ({
    lat: null,
    lng: null,
    loading: isSupported,  // false immediately when not supported
    error: isSupported ? null : "Geolocation is not supported by this browser.",
  }));

  useEffect(() => {
    // Nothing to do — initial state already reflects "not supported".
    if (!isSupported) return;

    // setState is only ever called inside async callbacks here, which is safe.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState({ lat: null, lng: null, loading: false, error: err.message });
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
    );
  }, []);

  return state;
}
