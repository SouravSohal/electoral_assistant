"use client";
/**
 * hooks/useChat.ts
 * Client-side chat state + streaming hook.
 */
import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "@/lib/gemini";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text: text.trim() }],
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    // Add empty model message to stream into
    const modelPlaceholder: ChatMessage = {
      role: "model",
      parts: [{ text: "" }],
    };
    setMessages((prev) => [...prev, modelPlaceholder]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error ||
            (response.status === 429
              ? "Too many requests. Please wait a moment."
              : "Failed to get a response. Please try again.")
        );
      }

      if (!response.body) throw new Error("No response stream.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "model") {
            updated[updated.length - 1] = {
              ...last,
              parts: [{ text: last.parts[0].text + chunk }],
            };
          }
          return updated;
        });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      // Remove the empty model placeholder on error
      setMessages((prev) =>
        prev.filter((_, i) => i !== prev.length - 1 || prev[prev.length - 1].parts[0].text !== "")
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
