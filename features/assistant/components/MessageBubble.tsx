import { AIBadge } from "@/components/ui/AIBadge";
import { cn } from "@/lib/utils";
import { User, BotMessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
            "text-[15px] leading-relaxed prose prose-invert max-w-none",
            isUser ? "text-white" : "text-[hsla(210,20%,98%,0.85)]"
          )}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-6 mb-2 tracking-tight" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-[var(--color-brand-saffron)]" {...props} />,
                  a: ({node, ...props}) => (
                    <a 
                      className="text-[var(--color-brand-blue)] hover:underline font-medium underline-offset-4" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      {...props} 
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            )}
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
