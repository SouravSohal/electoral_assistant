import { BotMessageSquare, CalendarRange, MapPin, Languages, ShieldCheck, Accessibility, Tablet } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "ai-assistant",
    title: "AI Civic Assistant",
    description: "Ask questions about voter registration, NOTA, and EVMs. Get instant, unbiased answers.",
    icon: <BotMessageSquare size={24} className="text-[var(--color-brand-blue)]" />,
    href: "/assistant"
  },
  {
    id: "polling-locator",
    title: "Polling Booth Finder",
    description: "Enter your address to instantly locate your designated polling station on an interactive map.",
    icon: <MapPin size={24} className="text-[var(--color-brand-saffron)]" />,
    href: "/find-polling"
  },
  {
    id: "election-timeline",
    title: "Election Timeline",
    description: "Follow the 8 official stages of the Indian election process, from ECI announcement to results.",
    icon: <CalendarRange size={24} className="text-[var(--color-brand-green)]" />,
    href: "/timeline"
  },
  {
    id: "evm-preview",
    title: "EVM & VVPAT Preview",
    description: "Practice voting on a digital mockup of the Indian EVM to familiarize yourself with the process.",
    icon: <Tablet size={24} className="text-[var(--color-brand-blue)]" />,
    href: "/ballot"
  },
  {
    id: "multilingual",
    title: "Multilingual Support",
    description: "Access the entire platform in English, Hindi, Tamil, Telugu, Bengali, and Marathi natively.",
    icon: <Languages size={24} className="text-[#a855f7]" />
  },
  {
    id: "accessibility",
    title: "WCAG 2.1 Accessible",
    description: "Fully navigable via keyboard and screen readers, ensuring every citizen can participate easily.",
    icon: <Accessibility size={24} className="text-[#f43f5e]" />
  }
];

export function Features() {
  return (
    <section className="py-24 bg-[var(--color-brand-surface)] border-y border-[hsla(210,20%,98%,0.05)] relative z-10">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-headline mb-4 text-white">
            Everything you need to be an <span className="text-[var(--color-brand-saffron)]">informed voter.</span>
          </h2>
          <p className="text-subheadline text-[var(--color-brand-muted)]">
            A complete suite of tools designed specifically to simplify the Indian electoral process for first-time and veteran voters alike.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Component = feature.href ? Link : 'div';
            return (
              <Component 
                key={feature.id}
                href={feature.href || ''}
                className={cn(
                  "group glass-panel p-8 rounded-2xl transition-all border border-[hsla(210,20%,98%,0.05)] hover:border-[hsla(210,20%,98%,0.15)]",
                  feature.href ? "hover:bg-[hsla(210,20%,98%,0.03)] hover:-translate-y-1" : ""
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-[hsla(210,20%,98%,0.05)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight flex items-center justify-between">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--color-brand-muted)]">
                  {feature.description}
                </p>
              </Component>
            );
          })}
        </div>
      </div>
    </section>
  );
}
