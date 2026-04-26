import { SUGGESTED_QUESTIONS } from "@/lib/constants";
import { MessageSquarePlus } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-[fade-in-up_0.5s_ease-out]">
      <div className="w-16 h-16 rounded-2xl bg-[hsla(215,85%,55%,0.1)] flex items-center justify-center mb-6 border border-[hsla(215,85%,55%,0.2)]">
        <MessageSquarePlus size={28} className="text-[var(--color-brand-blue)]" />
      </div>
      <h2 className="text-xl font-display font-semibold text-white mb-2 text-center tracking-tight">
        How can I help you vote today?
      </h2>
      <p className="text-[15px] text-[var(--color-brand-muted)] mb-8 text-center max-w-md leading-relaxed">
        Select a question below or type your own to get instant, verified information based on official ECI guidelines.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q.text)}
            className="focus-ring flex items-center justify-between p-4 rounded-xl glass-panel text-left hover:bg-[hsla(210,20%,98%,0.05)] hover:border-[hsla(210,20%,98%,0.15)] transition-colors group"
          >
            <span className="text-sm font-medium text-[var(--color-brand-muted)] group-hover:text-white transition-colors">
              {q.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
