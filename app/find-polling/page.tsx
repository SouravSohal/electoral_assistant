import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import PollingFinderClient from "./PollingFinderClient";

export const metadata: Metadata = {
  title: "Find Polling Booth | CivicGuide India",
  description: "Locate your polling booth for the 2026 Indian elections. Enter your address to find your designated voting station, booth number, and directions.",
};

export default function PollingFinderPage() {
  // Pass the server-side API key to the client component
  // Note: For client-side Google Maps, the key is usually exposed, but we keep it
  // in a server env variable to prevent it from being in the JS bundle until this page is hit.
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || "";

  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--color-brand-saffron)] selection:text-[var(--color-brand-navy)] bg-[var(--color-brand-navy)]">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-[120px] pb-12 md:pb-20">
        <div className="container-max px-4">
          <header className="max-w-3xl mb-10 md:mb-12 animate-[fade-in-up_0.5s_ease-out]">
            <h1 className="text-3xl md:text-4xl lg:text-display font-black mb-4 tracking-tight leading-tight">
              Find Your <span className="text-[var(--color-brand-blue)]">Polling Booth</span>
            </h1>
            <p className="text-sm md:text-lg text-[var(--color-brand-gray-300)] leading-relaxed">
              Enter your address or use your current location to find your designated polling station. 
              Always verify your final booth on your Voter Information Slip (VIS).
            </p>
          </header>

          <PollingFinderClient mapsApiKey={mapsApiKey} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
