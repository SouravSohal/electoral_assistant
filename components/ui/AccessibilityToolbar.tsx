"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Settings, 
  Type, 
  Contrast, 
  RotateCcw, 
  X, 
  Check, 
  Accessibility 
} from "lucide-react";
import { cn } from "@/lib/utils";

type FontSize = "standard" | "large" | "extra";

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("standard");
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load preferences
  useEffect(() => {
    console.log("AccessibilityToolbar mounted");
    const savedSize = localStorage.getItem("a11y-font-size") as FontSize;
    const savedContrast = localStorage.getItem("a11y-high-contrast") === "true";
    const savedDyslexic = localStorage.getItem("a11y-dyslexic") === "true";

    if (savedSize) handleFontSize(savedSize);
    if (savedContrast) handleContrast(true);
    if (savedDyslexic) handleDyslexic(true);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleFontSize = (size: FontSize) => {
    const html = document.documentElement;
    html.classList.remove("a11y-font-lg", "a11y-font-xl");
    if (size === "large") html.classList.add("a11y-font-lg");
    if (size === "extra") html.classList.add("a11y-font-xl");
    
    setFontSize(size);
    localStorage.setItem("a11y-font-size", size);
  };

  const handleContrast = (enable: boolean) => {
    const html = document.documentElement;
    if (enable) html.classList.add("a11y-high-contrast");
    else html.classList.remove("a11y-high-contrast");
    
    setHighContrast(enable);
    localStorage.setItem("a11y-high-contrast", String(enable));
  };

  const handleDyslexic = (enable: boolean) => {
    const html = document.documentElement;
    if (enable) html.classList.add("a11y-dyslexic");
    else html.classList.remove("a11y-dyslexic");
    
    setDyslexicFont(enable);
    localStorage.setItem("a11y-dyslexic", String(enable));
  };

  const resetAll = () => {
    handleFontSize("standard");
    handleContrast(false);
    handleDyslexic(false);
  };

  return (
    <aside className="fixed bottom-6 left-6 z-[60]" ref={menuRef} aria-label="Accessibility Settings Panel">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
        aria-label="Accessibility Settings"
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-2 z-[70]",
          isOpen 
            ? "bg-[var(--color-brand-saffron)] text-[var(--color-brand-navy)] border-[var(--color-brand-saffron)] scale-110" 
            : "bg-[var(--color-brand-blue)] text-white border-white/20 hover:scale-105 active:scale-95 shadow-blue-500/20"
        )}
      >
        {isOpen ? <X size={24} /> : <Accessibility size={24} />}
      </button>

      {/* Settings Panel */}
      <div
        id="a11y-panel"
        className={cn(
          "absolute bottom-16 left-0 w-72 glass-panel p-6 rounded-3xl transition-all duration-500 origin-bottom-left shadow-2xl",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Accessibility</h2>
          <button 
            onClick={resetAll}
            className="text-[10px] uppercase font-bold text-[var(--color-brand-muted)] hover:text-[var(--color-brand-saffron)] flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        <div className="space-y-8">
          {/* Font Size Selection */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[var(--color-brand-muted)] uppercase tracking-wider flex items-center gap-2">
              <Type size={14} />
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[hsla(210,20%,98%,0.05)] border border-[hsla(210,20%,98%,0.05)]">
              {(["standard", "large", "extra"] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSize(size)}
                  className={cn(
                    "py-1.5 text-xs font-bold rounded-lg transition-all capitalize",
                    fontSize === size 
                      ? "bg-[var(--color-brand-blue)] text-white shadow-md" 
                      : "text-[var(--color-brand-muted)] hover:text-white"
                  )}
                >
                  {size === "standard" ? "100%" : size === "large" ? "125%" : "150%"}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[var(--color-brand-muted)] uppercase tracking-wider flex items-center gap-2">
              <Contrast size={14} />
              High Contrast
            </label>
            <button
              onClick={() => handleContrast(!highContrast)}
              aria-label={`Toggle high contrast mode: currently ${highContrast ? 'enabled' : 'disabled'}`}
              className={cn(
                "w-10 h-5 rounded-full relative transition-colors duration-300",
                highContrast ? "bg-[var(--color-brand-green)]" : "bg-[hsla(210,20%,98%,0.1)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                highContrast ? "left-6" : "left-1"
              )} />
            </button>
          </div>

          {/* Dyslexic Font Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[var(--color-brand-muted)] uppercase tracking-wider flex items-center gap-2">
              <Type size={14} />
              Dyslexic Typography
            </label>
            <button
              onClick={() => handleDyslexic(!dyslexicFont)}
              aria-label={`Toggle dyslexic friendly typography: currently ${dyslexicFont ? 'enabled' : 'disabled'}`}
              className={cn(
                "w-10 h-5 rounded-full relative transition-colors duration-300",
                dyslexicFont ? "bg-[var(--color-brand-green)]" : "bg-[hsla(210,20%,98%,0.1)]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                dyslexicFont ? "left-6" : "left-1"
              )} />
            </button>
          </div>
        </div>

        <p className="mt-8 pt-6 border-t border-[hsla(210,20%,98%,0.05)] text-[10px] text-[var(--color-brand-muted)] italic leading-relaxed">
          Settings are saved to your browser for future visits.
        </p>
      </div>
    </aside>
  );
}
