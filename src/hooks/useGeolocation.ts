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

// ─── Privacy: Grid Offset ─────────────────────────────────────────────────────
// Adds a small random noise to a coordinate and rounds to 4 decimal places.
//
// Why noise?   Prevents reverse-engineering the exact spot when a user posts
//              multiple times from the same location (e.g. home or office).
// Why 0.001?   1° latitude ≈ 111 km  →  0.001° ≈ 111 m  →  ±0.0005° ≈ ±55 m
//              That's enough to obscure the precise address while still keeping
//              the post within the correct neighbourhood / block.
// Why 4 dp?    4 decimal places ≈ 11 m resolution — tight enough for
//              "nearby" queries, loose enough for privacy.
function addNoise(coord: number): number {
  const noise = (Math.random() - 0.5) * 0.001; // random shift ≈ ±55 m
  return parseFloat((coord + noise).toFixed(4));
}

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
          lat: addNoise(position.coords.latitude),
          lng: addNoise(position.coords.longitude),
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
