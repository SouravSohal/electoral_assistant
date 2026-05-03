import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

import { Hero } from "@/features/home/components/Hero";
import { Stats } from "@/features/home/components/Stats";
import { Features } from "@/features/home/components/Features";
import { TimelinePreview } from "@/features/home/components/TimelinePreview";

export default function Home() { 
  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--color-brand-saffron)] selection:text-[var(--color-brand-navy)]">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <TimelinePreview />
      </main>

      <Footer />
    </div>
  ); 
}
