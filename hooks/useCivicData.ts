import { useState, useCallback } from "react";

export interface PollingLocation {
  address: {
    locationName: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  pollingHours?: string;
  notes?: string;
  sources?: { name: string; official: boolean }[];
}

export interface CivicData {
  normalizedInput?: any;
  pollingLocations?: PollingLocation[];
  contests?: any[];
  state?: any[];
}

export function useCivicData() {
  const [data, setData] = useState<CivicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCivicData = useCallback(async (address: string) => {
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/civic?address=${encodeURIComponent(address)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch data");
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchCivicData };
}
