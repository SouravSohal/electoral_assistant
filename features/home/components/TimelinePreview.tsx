import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ELECTION_TIMELINE_STAGES } from "@/lib/constants";

export function TimelinePreview() {
  // Take only the first 4 stages for the preview
  const previewStages = ELECTION_TIMELINE_STAGES.slice(0, 4);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container-max relative z-10 px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-headline mb-4 text-white leading-tight">
            Understand the <span className="text-[var(--color-brand-blue)]">Election Process.</span>
          </h2>
          <p className="text-sm md:text-lg lg:text-subheadline text-[var(--color-brand-muted)] leading-relaxed">
            A step-by-step breakdown of how Indian elections unfold, from the first announcement to the final results.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="max-w-3xl mx-auto mt-8 md:mt-16">
          {/* Continuous Left Line Track */}
          <div className="relative border-l-2 border-[hsla(210,20%,98%,0.08)] ml-2 md:ml-6 space-y-8 md:space-y-10 pb-4">
            
            {previewStages.map((stage, index) => (
              <div key={stage.id} className="relative pl-8 md:pl-12 group">
                
                {/* Track Node Indicator */}
                <div className="absolute -left-[17px] md:-left-[17px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-brand-navy)] border-2 border-[hsla(210,20%,98%,0.2)] group-hover:border-[var(--color-brand-saffron)] transition-colors duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsla(210,20%,98%,0.2)] group-hover:bg-[var(--color-brand-saffron)] group-hover:shadow-[0_0_12px_var(--color-brand-saffron)] transition-all duration-300" />
                </div>

                {/* Content Card */}
                <div className="glass-panel p-5 md:p-8 rounded-2xl border border-[hsla(210,20%,98%,0.05)] hover:border-[hsla(210,20%,98%,0.15)] hover:bg-[hsla(210,20%,98%,0.03)] transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] md:text-xs font-bold text-[var(--color-brand-saffron)] uppercase tracking-widest">
                          Stage {stage.step}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-semibold text-white tracking-tight">
                        {stage.title}
                      </h3>
                    </div>
                    
                    <span className="shrink-0 inline-flex items-center text-sm font-medium text-[var(--color-brand-blue)] bg-[hsla(215,85%,55%,0.1)] border border-[hsla(215,85%,55%,0.2)] px-3 py-1 rounded-full whitespace-nowrap">
                      {stage.duration}
                    </span>
                  </div>
                  
                  <p className="text-base text-[var(--color-brand-muted)] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link 
            href="/timeline" 
            className="focus-ring inline-flex items-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-transparent border border-[hsla(210,20%,98%,0.15)] rounded-full transition-all hover:bg-[hsla(210,20%,98%,0.05)] hover:border-[hsla(210,20%,98%,0.3)]"
          >
            <CheckCircle2 size={18} className="text-[var(--color-brand-green)]" />
            View Complete 8-Stage Timeline
            <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
