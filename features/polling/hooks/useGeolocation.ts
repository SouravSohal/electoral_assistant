import { useState, useCallback } from "react";

interface GeolocationState {
  coords: { latitude: number; longitude: number } | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: false,
    error: null,
  });

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation is not supported by your browser" }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        let message = "Failed to get location";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Please enable location permissions to use this feature";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information is unavailable";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out";
        }
        setState({ coords: null, loading: false, error: message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { ...state, getPosition };
}
