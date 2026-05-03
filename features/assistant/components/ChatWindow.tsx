"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { useChat } from "@/features/assistant/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { useAuth } from "@/features/profile/hooks/useAuth";
import Link from "next/link";

export function ChatWindow({ initialQuestion }: { initialQuestion?: string }) {
  const { messages, isLoading, error, sendMessage } = useChat();
  const { user, profile, loading: authLoading } = useAuth();
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
        className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth scrollbar-thin scrollbar-thumb-[hsla(210,20%,98%,0.1)] scrollbar-track-transparent"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-full py-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-center tracking-tight bg-gradient-to-r from-[var(--color-brand-blue)] via-[var(--color-brand-saffron)] to-[var(--color-brand-blue)] -webkit-background-clip-text text-transparent bg-clip-text bg-[length:200%_auto] animate-[gradientShift_8s_ease-in-out_infinite]">
              Civic AI Assistant
            </h1>
            <p className="text-sm md:text-[15px] text-[var(--color-brand-muted)] max-w-md text-center mb-8 md:mb-10 leading-relaxed px-4">
              Get instant, verified answers about voter registration, election stages, and polling procedures based on official ECI guidelines.
            </p>
            <SuggestedQuestions onSelect={handleSuggestSelect} />
            
            {/* Personalization Mandatory Alert */}
            {!authLoading && (!user || !profile) && (
              <div className="mt-8 p-4 rounded-2xl bg-[hsla(28,92%,58%,0.05)] border border-[hsla(28,92%,58%,0.2)] max-w-sm md:max-w-md w-full animate-[fade-in-up_0.5s_ease-out] mx-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-[var(--color-brand-saffron)] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-brand-saffron)] mb-1">Improve Personalization</h3>
                    <p className="text-[11px] md:text-xs text-[var(--color-brand-muted)] leading-relaxed mb-3">
                      To get information tailored to your state and constituency, please sign in and complete your voter profile.
                    </p>
                    <Link 
                      href="/login"
                      className="text-[11px] font-bold py-2 px-4 rounded-lg bg-[var(--color-brand-saffron)] text-black hover:opacity-90 transition-opacity inline-block"
                    >
                      Complete Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
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
      <div className="shrink-0 p-3 sm:p-6 pt-2 bg-gradient-to-t from-[var(--color-brand-navy)] via-[var(--color-brand-navy)] to-transparent relative z-20">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center bg-[hsla(222,55%,15%,0.6)] backdrop-blur-xl rounded-2xl border border-[hsla(210,20%,98%,0.1)] focus-within:border-[hsla(215,85%,60%,0.5)] focus-within:bg-[hsla(222,55%,18%,0.8)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all overflow-hidden p-1.5 pl-4 md:p-2 md:pl-5"
          >
            <input
              data-testid="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Indian elections..."
              className="flex-1 bg-transparent border-none text-sm md:text-base text-white placeholder-[hsla(210,20%,98%,0.3)] focus:outline-none focus:ring-0 py-2.5 md:py-3"
              disabled={isLoading}
              aria-label="Ask a question"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[var(--color-brand-blue)] text-white disabled:opacity-50 disabled:bg-[hsla(210,20%,98%,0.1)] disabled:text-[hsla(210,20%,98%,0.3)] hover:bg-[hsla(215,85%,60%,1)] transition-all focus-ring shrink-0 ml-2"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin md:size-20" /> : <Send size={18} className="ml-0.5 md:size-20" />}
            </button>
          </form>
          <p className="text-[10px] text-center text-[var(--color-brand-muted)] mt-3 md:mt-4">
            AI can make mistakes. Verify with <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">official ECI resources</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
