import { AIBadge } from "@/components/shared/AIBadge";
import { cn } from "@/lib/utils";
import { User, BotMessageSquare } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "model";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full gap-4", isUser ? "justify-end" : "justify-start animate-[fade-in-up_0.3s_ease-out]")}>
      
      {/* AI Avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-[hsla(215,85%,55%,0.1)] border border-[hsla(215,85%,55%,0.2)] flex items-center justify-center mt-1">
          <BotMessageSquare size={16} className="text-[var(--color-brand-blue)]" />
        </div>
      )}

      <div 
        className={cn(
          "max-w-[85%] md:max-w-[80%] flex flex-col",
          isUser ? "items-end" : "items-start"
        )}
        data-testid={!isUser ? "ai-response" : undefined}
      >
        <div className={cn(
          "rounded-2xl p-4 md:p-5 shadow-sm",
          isUser 
            ? "bg-[var(--color-brand-blue)] text-white rounded-tr-sm" 
            : "glass-panel border border-[hsla(210,20%,98%,0.05)] rounded-tl-sm w-full"
        )}>
          {!isUser && <AIBadge />}
          <div className={cn(
            "text-[15px] leading-relaxed whitespace-pre-wrap",
            isUser ? "text-white" : "text-[var(--color-brand-white)]"
          )}>
            {content}
            {!isUser && content === "" && (
              <span className="inline-block w-1.5 h-4 bg-[var(--color-brand-blue)] animate-pulse ml-1 align-middle rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-[hsla(210,20%,98%,0.1)] flex items-center justify-center mt-1">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}
