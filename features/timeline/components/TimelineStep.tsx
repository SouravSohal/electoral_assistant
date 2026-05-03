"use client";

import { useState } from "react";
import Link from "next/link";
import { TimelineStage } from "@/lib/constants";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { 
  ExternalLink, 
  BotMessageSquare, 
  ChevronDown, 
  CheckCircle2, 
  Lightbulb,
  Bell,
  BellRing,
  Loader2,
  Tablet
} from "lucide-react";
import { useAuth } from "@/features/profile/hooks/useAuth";
import { toggleElectionReminder } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface TimelineStepProps {
  stage: TimelineStage;
  isReminderSet?: boolean;
}

export function TimelineStep({ stage, isReminderSet: initialReminderSet }: TimelineStepProps) {
  const { user } = useAuth();
  const [isReminderSet, setIsReminderSet] = useState(initialReminderSet);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleReminder = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to set reminders.");
      return;
    }

    setIsUpdating(true);
    try {
      const added = await toggleElectionReminder(
        user.uid, 
        stage.id, 
        stage.title, 
        stage.duration
      );
      setIsReminderSet(added);
    } catch (err) {
      console.error("Reminder Error:", err);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="relative pl-8 md:pl-12 group mb-10 last:mb-0">
      
      {/* Track Node Indicator */}
      <div className="absolute -left-[17px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-brand-navy)] border-2 border-[hsla(210,20%,98%,0.2)] group-hover:border-[var(--color-brand-saffron)] transition-colors duration-300 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[hsla(210,20%,98%,0.2)] group-hover:bg-[var(--color-brand-saffron)] group-hover:shadow-[0_0_12px_var(--color-brand-saffron)] transition-all duration-300" />
      </div>

      {/* Content Card with Native <details> */}
      <details className="glass-panel rounded-2xl border border-[hsla(210,20%,98%,0.05)] hover:border-[hsla(210,20%,98%,0.15)] transition-colors duration-300 group/details overflow-hidden">
        
        {/* Header / Summary */}
        <summary className="p-5 md:p-8 cursor-pointer focus-ring list-none relative flex flex-col md:flex-row md:items-start justify-between gap-4 select-none">
          {/* Chevron for Details State */}
          <div className="absolute right-5 top-7 md:right-6 md:top-8 text-[var(--color-brand-muted)] group-open/details:rotate-180 transition-transform duration-300">
            <ChevronDown size={18} className="md:size-20" />
          </div>

          <div className="pr-6 md:pr-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-[hsla(28,100%,55%,0.1)] text-[var(--color-brand-saffron)] text-[10px] md:text-xs font-bold">
                {stage.step}
              </span>
              <div className="flex items-center gap-2 text-[var(--color-brand-blue)]">
                <DynamicIcon name={stage.icon} size={14} className="md:size-16" />
                <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase">
                  {stage.duration}
                </span>
              </div>
            </div>
            
            <h3 className="text-xl md:text-2xl font-display font-semibold text-white tracking-tight mb-1 pr-4">
              {stage.title}
            </h3>
            {stage.titleHi && (
              <p className="text-xs md:text-sm font-medium text-[var(--color-brand-saffron)] opacity-80 mb-3">
                {stage.titleHi}
              </p>
            )}
            
            <p className="text-[13px] md:text-[15px] text-[var(--color-brand-muted)] leading-relaxed max-w-2xl">
              {stage.description}
            </p>
          </div>
        </summary>

        {/* Expanded Content */}
        <div className="px-5 md:px-8 pb-6 md:pb-8 pt-0 border-t border-[hsla(210,20%,98%,0.05)] mt-2 md:mt-4 group-open/details:animate-[fade-in-up_0.3s_ease-out]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6">
            
            {/* Key Dates List */}
            <div>
              <h4 className="flex items-center gap-2 text-[12px] md:text-sm font-bold uppercase tracking-wider text-white mb-4">
                <CheckCircle2 size={14} className="text-[var(--color-brand-blue)] md:size-16" />
                Key Events
              </h4>
              <ul className="space-y-2.5 md:space-y-3">
                {stage.keyDates.map((date, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[13px] md:text-[14px] text-[var(--color-brand-muted)]">
                    <span className="shrink-0 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[var(--color-brand-blue)] mt-1.5" />
                    <span>{date}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tips List */}
            <div>
              <h4 className="flex items-center gap-2 text-[12px] md:text-sm font-bold uppercase tracking-wider text-white mb-4">
                <Lightbulb size={14} className="text-[var(--color-brand-saffron)] md:size-16" />
                Voter Tips
              </h4>
              <ul className="space-y-2.5 md:space-y-3">
                {stage.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[13px] md:text-[14px] text-[var(--color-brand-muted)]">
                    <span className="shrink-0 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[var(--color-brand-saffron)] mt-1.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-8 pt-6 border-t border-[hsla(210,20%,98%,0.05)]">
            <Link
              href={`/assistant?q=Tell me more about ${encodeURIComponent(stage.title)} in Indian elections`}
              className="focus-ring flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-[hsla(215,85%,55%,0.1)] border border-[hsla(215,85%,55%,0.3)] rounded-xl sm:rounded-full transition-colors hover:bg-[hsla(215,85%,55%,0.2)]"
            >
              <BotMessageSquare size={16} />
              Ask AI
            </Link>

            {stage.id === "polling-day" && (
              <Link
                href="/ballot"
                className="focus-ring flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-[var(--color-brand-navy)] bg-[var(--color-brand-saffron)] rounded-xl sm:rounded-full transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[hsla(28,100%,55%,0.2)]"
              >
                <Tablet size={16} />
                Try EVM Mockup
              </Link>
            )}

            <button
              onClick={handleToggleReminder}
              disabled={isUpdating}
              className={cn(
                "focus-ring flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-bold rounded-xl sm:rounded-full transition-all duration-300",
                isReminderSet 
                  ? "bg-[hsla(28,92%,58%,0.15)] text-[var(--color-brand-saffron)] border border-[hsla(28,92%,58%,0.4)]" 
                  : "text-[var(--color-brand-gray-300)] bg-[hsla(210,20%,98%,0.03)] border border-[hsla(210,20%,98%,0.1)] hover:border-[hsla(28,92%,58%,0.3)] hover:text-[var(--color-brand-saffron)]"
              )}
            >
              {isUpdating ? <Loader2 size={16} className="animate-spin" /> : isReminderSet ? <BellRing size={16} /> : <Bell size={16} />}
              {isReminderSet ? "Reminder Set" : "Remind Me"}
            </button>
            
            {stage.officialLink && (
              <a
                href={stage.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-[var(--color-brand-muted)] hover:text-white transition-colors group/link"
              >
                Official Resource
                <ExternalLink size={14} className="opacity-50 group-hover/link:opacity-100" />
              </a>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}
