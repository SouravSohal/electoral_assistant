import Link from "next/link";
import { ArrowRight, MapPin, BotMessageSquare } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen md:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center pt-28 md:pt-[120px] pb-12 overflow-hidden">
      {/* Background Ambience (Soft, non-intimidating) */}
      <div 
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--color-brand-blue)] opacity-10 blur-[100px] pointer-events-none"
      />
      <div 
        className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-[var(--color-brand-saffron)] opacity-[0.08] blur-[100px] pointer-events-none"
      />

      <div className="container-max relative z-10 text-center animate-[fade-in-up_0.8s_ease-out_forwards] flex flex-col items-center px-4">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[hsla(210,20%,98%,0.1)] bg-[hsla(222,55%,15%,0.4)] backdrop-blur-sm mb-6">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand-saffron)]"></span>
          <span className="text-[10px] md:text-xs font-medium tracking-wide text-[var(--color-brand-muted)]">
            Powered by ECI Official Guidelines
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-display mb-5 tracking-tight font-display font-bold leading-[1.1]">
          <span className="text-white">Understand your elections.</span>
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-[var(--color-brand-saffron)] to-[#fcd34d] -webkit-background-clip-text text-transparent bg-clip-text">
            Shape India&apos;s future.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-sm md:text-lg lg:text-subheadline max-w-2xl mx-auto mb-10 text-[var(--color-brand-muted)] leading-relaxed">
          Your clear, unbiased guide to the Indian democratic process. Learn how to register, find your polling booth, and understand how your vote makes an impact.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full max-w-sm sm:max-w-none">
          <Link 
            href="/assistant" 
            className="focus-ring flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[var(--color-brand-blue)] rounded-full transition-all hover:bg-[hsla(215,85%,60%,1)] shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <BotMessageSquare size={20} />
            Ask AI Assistant
            <ArrowRight size={18} />
          </Link>
          <Link 
            href="/find-polling" 
            className="focus-ring flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[hsla(210,20%,98%,0.05)] border border-[hsla(210,20%,98%,0.15)] rounded-full transition-all hover:bg-[hsla(210,20%,98%,0.1)] active:scale-[0.98]"
          >
            <MapPin size={20} />
            Find Polling Booth
          </Link>
        </div>

        {/* Trusted By / Quick Info Banner to fill space professionally */}
        <div className="w-full max-w-3xl mx-auto mt-4 p-5 rounded-3xl glass-panel border border-[hsla(210,20%,98%,0.05)] bg-[hsla(210,20%,98%,0.02)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:divide-x divide-[hsla(210,20%,98%,0.1)] text-center sm:text-left">
            <div className="px-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-muted)] mb-1">Coverage</p>
              <p className="text-sm font-medium text-white">All 543 Constituencies</p>
            </div>
            <div className="px-4 border-t border-[hsla(210,20%,98%,0.05)] pt-4 sm:border-t-0 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-muted)] mb-1">Languages</p>
              <p className="text-sm font-medium text-white">English, Hindi & Regional</p>
            </div>
            <div className="px-4 border-t border-[hsla(210,20%,98%,0.05)] pt-4 sm:border-t-0 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-muted)] mb-1">Accuracy</p>
              <p className="text-sm font-medium text-[var(--color-brand-saffron)]">ECI Data Sync</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
