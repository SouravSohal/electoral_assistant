import { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { BallotPreview } from "@/components/ballot/BallotPreview";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Ballot Preview | CivicGuide India",
  description: "Experience the layout of an Indian Electronic Voting Machine (EVM). Practice voting and learn about the VVPAT system.",
};

export default function BallotPage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--color-brand-saffron)] selection:text-[var(--color-brand-navy)] bg-[var(--color-brand-navy)]">
      <Navbar />

      <main className="flex-1 pt-[120px] pb-20 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-brand-blue)] opacity-[0.05] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-brand-saffron)] opacity-[0.03] blur-[100px] pointer-events-none" />

        <div className="container-max px-4 relative z-10">
          <header className="max-w-3xl mx-auto text-center mb-16 animate-[fade-in-up_0.5s_ease-out]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsla(215,85%,55%,0.1)] border border-[hsla(215,85%,55%,0.2)] mb-6">
              <Sparkles size={14} className="text-[var(--color-brand-blue)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-blue)]">
                Educational Preview
              </span>
            </div>
            <h1 className="text-display md:text-5xl font-black mb-4 tracking-tight">
              Know Your <span className="text-[var(--color-brand-blue)]">Ballot Unit</span>
            </h1>
            <p className="text-lg text-[var(--color-brand-gray-300)] leading-relaxed">
              Familiarize yourself with the voting process. Indian elections use Electronic Voting Machines (EVM) 
              paired with VVPAT printers for maximum security and transparency.
            </p>
          </header>

          <BallotPreview />
        </div>
      </main>

      <Footer />
    </div>
  );
}
