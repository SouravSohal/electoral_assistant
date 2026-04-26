import { Sparkles, ExternalLink } from "lucide-react";

export function AIBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[hsla(215,85%,55%,0.1)] border border-[hsla(215,85%,55%,0.2)] mb-2 w-fit">
      <Sparkles size={12} className="text-[var(--color-brand-blue)]" />
      <span className="text-[11px] font-semibold tracking-wide uppercase text-[var(--color-brand-blue)]">
        AI-Generated — 
      </span>
      <a 
        href="https://voters.eci.gov.in/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="focus-ring text-[11px] font-semibold tracking-wide uppercase text-[var(--color-brand-muted)] hover:text-white transition-colors inline-flex items-center gap-1"
      >
        Verify with ECI
        <ExternalLink size={10} />
      </a>
    </div>
  );
}
