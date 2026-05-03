import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { HOW_TO_VOTE_STEPS, HOW_TO_VOTE_STEPS_METADATA } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How to Vote Guide | CivicGuide India",
  description: "A step-by-step guide for Indian citizens on how to register, verify, and cast their vote in the 2026 elections.",
};

export default function HowToVotePage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--color-brand-saffron)] selection:text-[var(--color-brand-navy)] bg-[var(--color-brand-navy)]">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-[120px] pb-12 md:pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden mb-10 md:mb-16 py-10 md:py-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] md:h-[400px] bg-[var(--color-brand-blue)] opacity-[0.05] blur-[120px] pointer-events-none" />
          
          <div className="container-max px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsla(28,92%,58%,0.1)] border border-[hsla(28,92%,58%,0.2)] mb-5 md:mb-6 animate-[fade-in-up_0.5s_ease-out]">
              <Sparkles size={12} className="text-[var(--color-brand-saffron)] md:size-14" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-[var(--color-brand-saffron)]">
                {HOW_TO_VOTE_STEPS_METADATA.tagline}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-display font-black mb-4 md:mb-6 tracking-tight animate-[fade-in-up_0.6s_ease-out] leading-tight">
              {HOW_TO_VOTE_STEPS_METADATA.title}
            </h1>
            <p className="text-sm md:text-xl text-[var(--color-brand-gray-300)] max-w-2xl mx-auto leading-relaxed animate-[fade-in-up_0.7s_ease-out]">
              {HOW_TO_VOTE_STEPS_METADATA.subtitle}
            </p>
          </div>
        </div>

        {/* Steps Section */}
        <div className="container-max px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {HOW_TO_VOTE_STEPS.map((step, index) => (
              <section 
                key={step.id}
                className="group animate-[fade-in-up_0.3s_ease-out] fill-mode-backwards"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="glass-panel overflow-hidden border border-[hsla(210,20%,98%,0.05)] hover:border-[hsla(215,85%,55%,0.3)] transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    {/* Step Number & Icon Column */}
                    <div className="md:w-48 bg-[hsla(215,85%,55%,0.03)] border-b md:border-b-0 md:border-r border-[hsla(210,20%,98%,0.05)] p-6 md:p-8 flex flex-row md:flex-col items-center justify-center text-center gap-5 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--color-brand-navy)] border border-[hsla(215,85%,55%,0.2)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <DynamicIcon name={step.icon} className="text-[var(--color-brand-blue)] md:size-24" size={20} />
                      </div>
                      <div className="space-y-0.5 md:space-y-1 text-left md:text-center">
                        <span className="text-[10px] md:text-xs font-bold text-[var(--color-brand-blue)] uppercase tracking-widest block">Step</span>
                        <div className="text-3xl md:text-4xl font-black text-white leading-none">{step.step}</div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 p-6 md:p-10">
                      <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{step.title}</h2>
                          <span className="text-xs md:text-sm font-medium text-[var(--color-brand-saffron)] opacity-80" lang="hi">
                            {step.titleHi}
                          </span>
                        </div>
                        <p className="text-sm md:text-base text-[var(--color-brand-gray-300)] leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      <div className="space-y-3 md:space-y-4 mb-8">
                        {step.content.map((item, i) => (
                          <div key={i} className="flex gap-3 md:gap-4 group/item">
                            <div className="shrink-0 mt-1.5 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[var(--color-brand-blue)] group-hover/item:scale-150 transition-transform" />
                            <p className="text-[13px] md:text-[15px] text-[var(--color-brand-gray-300)] leading-relaxed">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 border-t border-[hsla(210,20%,98%,0.05)]">
                        <Link 
                          href={step.officialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary py-3 px-6 flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/10"
                        >
                          Official Portal
                          <ExternalLink size={14} />
                        </Link>
                        
                        <Link 
                          href={`/assistant?q=${encodeURIComponent(step.aiPrompt)}`}
                          className="btn-ghost py-3 px-6 flex items-center justify-center gap-2 text-sm font-bold hover:bg-[hsla(215,85%,55%,0.05)]"
                        >
                          Ask AI Assistant
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="container-max px-4 mt-24">
          <div className="glass-panel p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-brand-blue)] to-transparent opacity-50" />
            
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Ready to exercise your right?</h2>
            <p className="text-lg text-[var(--color-brand-gray-300)] mb-10 max-w-xl mx-auto leading-relaxed">
              Democracy works best when everyone participates. If you have more questions, our AI Assistant is here to help 24/7.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/assistant" className="btn-gold py-4 px-10 text-lg font-bold">
                Talk to AI Assistant
              </Link>
              <Link href="/find-polling" className="btn-ghost py-4 px-10 text-lg font-bold">
                Find My Booth
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
