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
      // 1. Search Local Master Dataset
      const localResponse = await fetch("/data/polling-stations.json");
      const localStations: any[] = await localResponse.json();
      
      const searchTerm = address.toLowerCase();
      const filteredLocal = localStations
        .filter(station => 
          station.name.toLowerCase().includes(searchTerm) ||
          station.city.toLowerCase().includes(searchTerm) ||
          station.state.toLowerCase().includes(searchTerm) ||
          station.address.toLowerCase().includes(searchTerm)
        )
        .map(station => ({
          address: {
            locationName: station.name,
            line1: station.address,
            city: station.city,
            state: station.state,
            zip: "",
          }
        }));

      // 2. Fetch from Civic API Proxy
      const apiResponse = await fetch(`/api/civic?address=${encodeURIComponent(address)}`);
      const apiResult = await apiResponse.json();

      let combinedLocations = [...filteredLocal];

      if (apiResponse.ok && apiResult.pollingLocations) {
        // Merge and deduplicate by name/address
        const existingNames = new Set(filteredLocal.map(l => l.address.locationName.toLowerCase()));
        const newLocations = apiResult.pollingLocations.filter(
          (l: any) => !existingNames.has(l.address.locationName?.toLowerCase())
        );
        combinedLocations = [...combinedLocations, ...newLocations];
      }

      setData({
        ...apiResult,
        pollingLocations: combinedLocations
      });

    } catch (err) {
      console.error("Search Error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchCivicData };
}
