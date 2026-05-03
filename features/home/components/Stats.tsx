import { INDIA_STATS } from "@/lib/constants";
import { Users, Landmark, MapPin, ShieldCheck } from "lucide-react";

export function Stats() {
  const icons = { 
    Users: <Users size={28} className="text-[var(--color-brand-blue)]" />, 
    Landmark: <Landmark size={28} className="text-[var(--color-brand-saffron)]" />, 
    MapPin: <MapPin size={28} className="text-[var(--color-brand-green)]" />, 
    ShieldCheck: <ShieldCheck size={28} className="text-[#a855f7]" /> 
  };

  return (
    <section className="py-16 bg-[var(--color-brand-navy)] relative z-20">
      <div className="container-max">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 lg:gap-12 md:divide-x divide-[hsla(210,20%,98%,0.05)]">
          {INDIA_STATS.map((stat, i) => (
            <div key={stat.label} className="text-center px-2">
              <div className="flex justify-center mb-4 opacity-80">
                {icons[stat.icon as keyof typeof icons]}
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-2 tracking-tight">
                {stat.value}<span className="text-[var(--color-brand-saffron)]">{stat.suffix}</span>
              </div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-brand-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
