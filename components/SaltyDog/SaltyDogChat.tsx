"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/lib/chatbot";
import { SALTY_GREETING } from "@/lib/chatbot";

interface SaltyDogChatProps {
  onClose: () => void;
}

export function SaltyDogChat({ onClose }: SaltyDogChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([SALTY_GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef(false);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || debounceRef.current) return;

    // Debounce — block for 300ms
    debounceRef.current = true;
    setTimeout(() => {
      debounceRef.current = false;
    }, 300);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build API payload — exclude the canned greeting
      const allMessages = [...messages, userMessage];
      const apiMessages = allMessages
        .filter((m) => m.id !== "greeting")
        .map(({ role, content }) => ({ role, content }));

      const res = await fetch("/api/saltydog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setError("Couldn't reach SaltyDog. Try again?");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleRetry = useCallback(() => {
    // Find the last user message and re-send
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      setInput(lastUserMsg.content);
      // Remove the last user message so it gets re-added
      setMessages((prev) => prev.filter((m) => m.id !== lastUserMsg.id));
      setError(null);
    }
  }, [messages]);

  // Trigger send after retry sets input
  useEffect(() => {
    if (input && error === null && messages.length > 0) {
      // Only auto-send if this was triggered by retry
    }
  }, [input, error, messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      role="dialog"
      aria-label="SaltyDog Chat"
      aria-modal="true"
      className="flex flex-col h-full rounded-2xl sm:rounded-2xl rounded-b-none sm:rounded-b-2xl bg-card text-card-foreground border border-border shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/50">
        <Image
          src="/images/chatbot/SaltyDog-avatar.png"
          alt="SaltyDog"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <span className="font-semibold text-sm flex-1">SaltyDog 🐾</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <Image
                src="/images/chatbot/SaltyDog-avatar.png"
                alt=""
                width={24}
                height={24}
                className="rounded-full object-cover size-6 mt-1 shrink-0"
              />
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-teal text-white rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <Image
              src="/images/chatbot/SaltyDog-avatar.png"
              alt=""
              width={24}
              height={24}
              className="rounded-full object-cover size-6 mt-1 shrink-0"
            />
            <div className="bg-muted rounded-xl rounded-bl-sm px-4 py-3 text-muted-foreground">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center">
            <p className="text-destructive text-xs mb-1">{error}</p>
            <Button variant="ghost" size="xs" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 px-3 py-3 border-t border-border"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask SaltyDog..."
          aria-label="Message SaltyDog"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="default"
          size="icon-sm"
          disabled={!input.trim() || isLoading}
          className="bg-teal hover:bg-teal-dark text-white rounded-full shrink-0"
        >
          <ArrowUp className="size-4" />
        </Button>
      </form>
    </div>
  );
}
