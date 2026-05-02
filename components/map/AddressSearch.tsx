"use client";

import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { cn } from "@/lib/utils";

interface AddressSearchProps {
  onSearch: (address: string) => void;
  isLoading: boolean;
}

export function AddressSearch({ onSearch, isLoading }: AddressSearchProps) {
  const [address, setAddress] = useState("");
  const { getPosition, coords, loading: geoLoading, error: geoError } = useGeolocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address);
    }
  };

  const handleUseMyLocation = () => {
    getPosition();
    // In a full implementation, we would reverse geocode coords here.
    // For now, we'll prompt the user or handle the coords in the map.
    if (geoError) alert(geoError);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-brand-gray-500)] group-focus-within:text-[var(--color-brand-blue)] transition-colors">
          <Search size={20} />
        </div>
        
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address..."
          className="input-base pl-12 pr-32 py-4 w-full h-14 text-lg"
          disabled={isLoading}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={geoLoading || isLoading}
            className="p-2 text-[var(--color-brand-gray-500)] hover:text-[var(--color-brand-blue)] hover:bg-[hsla(215,85%,55%,0.1)] rounded-xl transition-all"
            title="Use my current location"
          >
            {geoLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <MapPin size={20} />
            )}
          </button>
          
          <button
            type="submit"
            disabled={isLoading || !address.trim()}
            className="btn-primary py-2 px-6 text-sm h-10 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {geoError && (
        <p className="text-xs text-red-400 pl-2 animate-shake">
          {geoError}
        </p>
      )}
      
      <p className="text-xs text-[var(--color-brand-gray-500)] pl-2">
        Example: "Connaught Place, New Delhi" or "Bandra, Mumbai"
      </p>
    </div>
  );
}
