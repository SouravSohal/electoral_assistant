"use client";

import { useState, useRef, useEffect } from "react";
import { Languages, ChevronDown, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/constants";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[hsla(210,20%,98%,0.03)] border border-[hsla(210,20%,98%,0.05)] hover:border-[hsla(215,85%,55%,0.3)] transition-all"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Languages size={18} className="text-[var(--color-brand-blue)]" />
        <span className="text-sm font-bold text-white hidden md:inline">
          {currentLang.native}
        </span>
        <ChevronDown 
          size={14} 
          className={cn("text-[var(--color-brand-gray-500)] transition-transform", isOpen && "rotate-180")} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-panel border border-[hsla(210,20%,98%,0.1)] p-2 z-50 animate-[fade-in_0.2s_ease-out]">
          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  changeLanguage(l.code as SupportedLanguage);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                  lang === l.code 
                    ? "bg-[hsla(215,85%,55%,0.1)] text-[var(--color-brand-blue)] font-bold" 
                    : "text-[var(--color-brand-gray-300)] hover:bg-[hsla(210,20%,98%,0.05)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{l.flag}</span>
                  <div className="text-left">
                    <p className="leading-tight">{l.native}</p>
                    <p className="text-[10px] opacity-50 uppercase tracking-tighter">{l.label}</p>
                  </div>
                </div>
                {lang === l.code && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
