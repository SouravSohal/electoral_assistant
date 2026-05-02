import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ElectionTimeline } from "@/features/timeline/components/ElectionTimeline";

export const metadata = {
  title: "Election Timeline | CivicGuide India",
  description: "Explore the 8 official stages of the Indian election process, from ECI announcement and MCC to counting day and government formation.",
};

export default function TimelinePage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--color-brand-saffron)] selection:text-[var(--color-brand-navy)]">
      <Navbar />
      
      <main className="flex-1 container-max pt-[120px] pb-12 md:pb-20 relative overflow-hidden animate-fade-in-up">
        {/* Ambient background glows */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[var(--color-brand-blue)] opacity-[0.05] blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-brand-saffron)] opacity-[0.03] blur-[100px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <h1 className="text-display mb-4 text-white">
            The <span className="text-[var(--color-brand-blue)]">Election</span> Process
          </h1>
          <p className="text-subheadline text-[var(--color-brand-muted)] max-w-2xl mx-auto">
            From the moment the Election Commission announces the dates, to the day the new government is sworn in. Here is exactly how Indian elections unfold.
          </p>
        </div>

        <ElectionTimeline />
      </main>

      <Footer />
    </div>
  );
}
