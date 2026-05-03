import Link from "next/link";
import { Vote, Heart, ExternalLink } from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[var(--color-brand-navy)] border-t border-[hsla(210,20%,98%,0.05)] pt-16 pb-8">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Brand & Disclaimer Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 focus-ring w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-brand-blue)]">
                <Vote size={18} className="text-white" />
              </div>
              <span className="font-display font-semibold text-xl text-white tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            
            <p className="text-sm text-[var(--color-brand-muted)] leading-relaxed max-w-sm mb-6">
              An independent, AI-powered initiative designed to simplify the Indian electoral process. Helping citizens understand their rights, procedures, and timelines.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsla(28,100%,55%,0.1)] border border-[hsla(28,100%,55%,0.2)]">
              <span className="text-xs font-semibold text-[var(--color-brand-saffron)]">⚠️ DISCLAIMER</span>
              <span className="text-xs text-[var(--color-brand-muted)]">Not affiliated with the Election Commission of India.</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold tracking-wider uppercase text-xs mb-6">Platform</h4>
            <ul className="space-y-4">
              {NAV_ITEMS.map((item) => {
                if ("children" in item) {
                  return item.children.map((child) => (
                    <li key={child.id}>
                      <Link 
                        href={child.href} 
                        className="focus-ring text-sm text-[var(--color-brand-muted)] hover:text-white transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ));
                }
                return (
                  <li key={item.id}>
                    <Link 
                      href={item.href} 
                      className="focus-ring text-sm text-[var(--color-brand-muted)] hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Official Resources Column */}
          <div>
            <h4 className="text-white font-bold tracking-wider uppercase text-xs mb-6">Official Resources</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://voters.eci.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="focus-ring group flex items-center text-sm text-[var(--color-brand-muted)] hover:text-[var(--color-brand-green)] transition-colors"
                >
                  ECI Voter Portal
                  <ExternalLink size={14} className="ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://results.eci.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="focus-ring group flex items-center text-sm text-[var(--color-brand-muted)] hover:text-[var(--color-brand-green)] transition-colors"
                >
                  Election Results
                  <ExternalLink size={14} className="ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[hsla(210,20%,98%,0.05)]">
          <p className="text-xs text-[var(--color-brand-muted)] mb-4 md:mb-0">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="flex items-center text-xs text-[var(--color-brand-muted)]">
            Built with <Heart size={12} className="mx-1.5 text-[var(--color-brand-saffron)]" /> for Indian Democracy
          </p>
        </div>
      </div>
    </footer>
  );
}
