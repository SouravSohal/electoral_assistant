"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { useChat } from "@/features/assistant/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";

export function ChatWindow({ initialQuestion }: { initialQuestion?: string }) {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle initial question from URL
  useEffect(() => {
    if (initialQuestion && messages.length === 0) {
      sendMessage(initialQuestion);
    }
  }, [initialQuestion, messages.length, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleSuggestSelect = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto glass-panel bg-[hsla(222,55%,15%,0.3)] border border-[hsla(210,20%,98%,0.08)] shadow-[0_8px_32px_hsla(222,65%,8%,0.5)] rounded-2xl overflow-hidden relative z-20">
      
      {/* Chat History Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth scrollbar-thin scrollbar-thumb-[hsla(210,20%,98%,0.1)] scrollbar-track-transparent"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full mt-4">
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3 text-center tracking-tight bg-gradient-to-r from-[var(--color-brand-blue)] via-[var(--color-brand-saffron)] to-[var(--color-brand-blue)] -webkit-background-clip-text text-transparent bg-clip-text bg-[length:200%_auto] animate-[gradientShift_8s_ease-in-out_infinite]">
              Civic AI Assistant
            </h1>
            <p className="text-[15px] text-[var(--color-brand-muted)] max-w-md text-center mb-10 leading-relaxed">
              Get instant, verified answers about voter registration, election stages, and polling procedures based on official ECI guidelines.
            </p>
            <SuggestedQuestions onSelect={handleSuggestSelect} />
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:gap-8 pb-4">
            {messages.map((msg, idx) => (
              <MessageBubble 
                key={idx} 
                role={msg.role} 
                content={msg.parts[0].text} 
              />
            ))}
            
            {error && (
              <div className="flex items-center gap-3 p-4 mx-auto w-full max-w-2xl rounded-xl bg-[hsla(348,83%,47%,0.1)] border border-[hsla(348,83%,47%,0.3)] text-[#f43f5e] text-sm animate-[fade-in-up_0.3s_ease-out]">
                <AlertCircle size={18} className="shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}
            
            <div ref={endOfMessagesRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 sm:p-6 pt-2 bg-gradient-to-t from-[var(--color-brand-navy)] via-[var(--color-brand-navy)] to-transparent relative z-20">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center bg-[hsla(222,55%,15%,0.6)] backdrop-blur-xl rounded-2xl border border-[hsla(210,20%,98%,0.1)] focus-within:border-[hsla(215,85%,60%,0.5)] focus-within:bg-[hsla(222,55%,18%,0.8)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all overflow-hidden p-2 pl-5"
          >
            <input
              data-testid="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the Indian elections..."
              className="flex-1 bg-transparent border-none text-[15px] sm:text-base text-white placeholder-[hsla(210,20%,98%,0.3)] focus:outline-none focus:ring-0 py-2 sm:py-3"
              disabled={isLoading}
              aria-label="Ask a question"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-brand-blue)] text-white disabled:opacity-50 disabled:bg-[hsla(210,20%,98%,0.1)] disabled:text-[hsla(210,20%,98%,0.3)] hover:bg-[hsla(215,85%,60%,1)] transition-all focus-ring shrink-0 ml-2"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
            </button>
          </form>
          <p className="text-[11px] text-center text-[var(--color-brand-muted)] mt-4">
            AI can make mistakes. Always verify important information with <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">official ECI resources</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
