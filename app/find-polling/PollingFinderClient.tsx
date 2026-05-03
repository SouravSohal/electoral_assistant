"use client";

import { useState } from "react";
import { AddressSearch } from "@/features/polling/components/AddressSearch";
import { PollingMap } from "@/features/polling/components/PollingMap";
import { useCivicData } from "@/features/polling/hooks/useCivicData";
import { MapPin, Info, ArrowRight, ExternalLink, Bot, Star, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MAJOR_POLLING_HUBS } from "@/lib/polling-data";

interface PollingFinderClientProps {
  mapsApiKey: string;
}

export default function PollingFinderClient({ mapsApiKey }: PollingFinderClientProps) {
  const { data, loading, error, fetchCivicData } = useCivicData();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (address: string) => {
    setHasSearched(true);
    fetchCivicData(address);
  };

  // Map the MAJOR_POLLING_HUBS to PollingLocation format for the map
  const featuredLocations = MAJOR_POLLING_HUBS.map(hub => ({
    address: {
      locationName: hub.name,
      line1: hub.address,
      city: hub.city,
      state: hub.state,
      zip: "",
    },
    pollingHours: "7:00 AM - 6:00 PM"
  }));

  const locations = data?.pollingLocations || (hasSearched ? [] : featuredLocations);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
      {/* Map Side - Appears first on mobile for immediate context */}
      <div className="lg:col-span-7 order-1 lg:order-2">
        <div className="md:sticky md:top-24">
          <div className="glass-panel p-1.5 md:p-2 animate-[fade-in-up_0.8s_ease-out] overflow-hidden h-[300px] md:h-auto">
            <PollingMap locations={locations} apiKey={mapsApiKey} />
          </div>
          
          <div className="mt-4 p-4 rounded-xl bg-[hsla(215,85%,55%,0.05)] border border-[hsla(215,85%,55%,0.1)] flex items-start gap-3">
            <Info size={16} className="text-[var(--color-brand-blue)] mt-0.5 shrink-0" />
            <p className="text-[11px] md:text-xs text-[var(--color-brand-gray-300)] leading-relaxed">
              <strong>Pro Tip:</strong> Carrying your Voter Information Slip (VIS) is recommended, 
              but any of the 12 ECI photo IDs are valid.
            </p>
          </div>
        </div>
      </div>

      {/* Search and List Side */}
      <div className="lg:col-span-5 space-y-6 md:space-y-8 order-2 lg:order-1">
        <section className="glass-panel p-5 md:p-6 animate-[fade-in-up_0.6s_ease-out]">
          <h2 className="text-lg md:text-xl font-bold mb-5 md:mb-6 flex items-center gap-2">
            <SearchIcon size={18} className="text-[var(--color-brand-blue)]" />
            Search Address
          </h2>
          <AddressSearch onSearch={handleSearch} isLoading={loading} />
        </section>

        {!loading && (
          <section className="space-y-5 md:space-y-6 animate-[fade-in-up_0.3s_ease-out]">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                {!hasSearched && <Star size={16} className="text-[var(--color-brand-saffron)] fill-[var(--color-brand-saffron)]" />}
                {locations.length > 0 
                  ? (hasSearched ? `Results (${locations.length})` : "Election Hubs") 
                  : "No Results Found"}
              </h2>
            </div>

            {locations.length > 0 ? (
              <div className="space-y-4">
                {locations.map((loc, i) => (
                  <div key={i} className="glass-panel p-6 border border-[hsla(210,20%,98%,0.05)] hover:border-[hsla(215,85%,55%,0.3)] transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-[hsla(215,85%,55%,0.1)] flex items-center justify-center text-[var(--color-brand-blue)]">
                        <MapPin size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[var(--color-brand-blue)] transition-colors">
                          {loc.address.locationName || "Polling Station"}
                        </h3>
                        <p className="text-sm text-[var(--color-brand-gray-300)] mb-4">
                          {loc.address.line1}, {loc.address.city}, {loc.address.state} {loc.address.zip}
                        </p>
                        
                        {loc.pollingHours && (
                          <div className="flex items-center gap-2 text-xs text-[var(--color-brand-gray-500)] mb-4">
                            <Info size={14} />
                            <span>Hours: {loc.pollingHours}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                          <Link 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${loc.address.line1}, ${loc.address.city}`)}`}
                            target="_blank"
                            className="text-xs font-bold text-[var(--color-brand-blue)] flex items-center gap-1 hover:underline"
                          >
                            Get Directions
                            <ExternalLink size={12} />
                          </Link>
                          <Link 
                            href={`/assistant?q=Tell me about the area near ${loc.address.locationName || loc.address.line1}`}
                            className="text-xs font-bold text-[var(--color-brand-saffron)] flex items-center gap-1 hover:underline"
                          >
                            Ask AI about this booth
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[hsla(28,92%,58%,0.1)] flex items-center justify-center mx-auto text-[var(--color-brand-saffron)]">
                  <Bot size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">No Polling Data Found</h3>
                  <p className="text-[var(--color-brand-gray-300)] text-sm mb-6">
                    Our local database might not have the most recent data for this specific area. 
                    Please use the official Election Commission of India portal for the most accurate booth lookup.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link 
                      href="https://voters.eci.gov.in/home/booth-search"
                      target="_blank"
                      className="btn-primary py-3 w-full flex items-center justify-center gap-2"
                    >
                      Search ECI Official Portal
                      <ExternalLink size={16} />
                    </Link>
                    <Link 
                      href="/assistant?q=How can I find my polling booth in India if the online search fails?"
                      className="btn-ghost py-3 w-full"
                    >
                      Ask AI for help
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Placeholder removed in favor of Featured Hubs */}
      </div>

    </div>
  );
}

function SearchIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
