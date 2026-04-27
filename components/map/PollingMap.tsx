"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { PollingLocation } from "@/hooks/useCivicData";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";

interface MapProps {
  locations: PollingLocation[];
  apiKey: string;
}

const render = (status: Status) => {
  if (status === Status.LOADING) return (
    <div className="w-full h-[400px] md:h-[600px] glass-panel flex flex-col items-center justify-center gap-4">
      <Loader2 size={40} className="text-[var(--color-brand-blue)] animate-spin" />
      <p className="text-[var(--color-brand-gray-500)] animate-pulse">Loading Map...</p>
    </div>
  );
  if (status === Status.FAILURE) return (
    <div className="w-full h-[400px] md:h-[600px] glass-panel flex flex-col items-center justify-center gap-4 text-center p-8">
      <AlertCircle size={40} className="text-red-400" />
      <h3 className="text-lg font-bold">Map Error</h3>
      <p className="text-[var(--color-brand-gray-500)] max-w-xs">
        Failed to load Google Maps. Please check your API key or connection.
      </p>
    </div>
  );
  return null;
};

function MapComponent({ locations }: { locations: PollingLocation[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const markers = useRef<google.maps.Marker[]>([]);
  const geocoder = useMemo(() => new window.google.maps.Geocoder(), []);

  // Default center: India (approx)
  const center = { lat: 20.5937, lng: 78.9629 };
  const zoom = 5;

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: mapStyles,
        disableDefaultUI: false,
        zoomControl: true,
      }));
    }
  }, [ref, map]);

  useEffect(() => {
    if (map && locations) {
      // Clear existing markers
      markers.current.forEach(m => m.setMap(null));
      markers.current = [];

      if (locations.length === 0) {
        map.setCenter(center);
        map.setZoom(zoom);
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      let markersAdded = 0;

      locations.forEach((loc, index) => {
        const addressStr = `${loc.address.line1 || ""}, ${loc.address.city || ""}, ${loc.address.state || ""} ${loc.address.zip || ""}`.trim();
        const searchAddr = loc.address.locationName || addressStr;

        geocoder.geocode({ address: searchAddr }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const position = results[0].geometry.location;
            
            const marker = new google.maps.Marker({
              position,
              map,
              title: loc.address.locationName,
              animation: google.maps.Animation.DROP,
              label: {
                text: (index + 1).toString(),
                color: "white",
                fontWeight: "bold"
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#3b82f6",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
                scale: 12,
              }
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="color: #1a233b; padding: 8px;">
                  <h4 style="margin: 0 0 4px 0; font-weight: bold;">${loc.address.locationName || "Polling Station"}</h4>
                  <p style="margin: 0; font-size: 12px; color: #64748b;">${addressStr}</p>
                </div>
              `
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });

            markers.current.push(marker);
            bounds.extend(position);
            markersAdded++;

            if (markersAdded === locations.length) {
              map.fitBounds(bounds);
              // Don't zoom in too much if there's only one marker
              if (locations.length === 1) {
                map.setZoom(15);
              }
            }
          }
        });
      });
    }
  }, [map, locations, geocoder]);

  return (
    <div ref={ref} className="w-full h-full rounded-2xl overflow-hidden grayscale-[0.2] contrast-[1.1]" />
  );
}

export function PollingMap({ locations, apiKey }: MapProps) {
  if (!apiKey) {
    return (
      <div className="w-full h-[400px] md:h-[600px] glass-panel flex flex-col items-center justify-center gap-4 text-center p-8">
        <AlertCircle size={40} className="text-[var(--color-brand-saffron)]" />
        <h3 className="text-lg font-bold">Maps API Key Missing</h3>
        <p className="text-[var(--color-brand-gray-500)] max-w-xs mb-4">
          Please add your <code>GOOGLE_MAPS_API_KEY</code> to <code>.env.local</code> to see the interactive map.
        </p>
        <div className="p-4 rounded-xl bg-[hsla(28,92%,58%,0.05)] border border-[hsla(28,92%,58%,0.2)] text-left w-full max-w-sm">
          <p className="text-sm font-medium text-[var(--color-brand-saffron)] mb-2">Polling Places Found ({locations.length}):</p>
          <ul className="space-y-2">
            {locations.map((loc, i) => (
              <li key={i} className="text-xs text-[var(--color-brand-gray-300)] flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] mt-1 shrink-0" />
                <span>{loc.address.locationName || loc.address.line1}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] md:h-[600px] relative">
      <Wrapper apiKey={apiKey} render={render} libraries={["places"]}>
        <MapComponent locations={locations} />
      </Wrapper>
    </div>
  );
}

// Dark Mode Map Styles
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a233b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a233b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7486a4" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4d8e1" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4d8e1" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#132142" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2d3855" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a3e" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3b4a6b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2937" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3f4f6" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2d333c" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d4d8e1" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0d1b3e" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];
