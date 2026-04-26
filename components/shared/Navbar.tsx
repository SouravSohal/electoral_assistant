"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, Menu, X, Sparkles } from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "glass-panel bg-opacity-95 shadow-[0_4px_32px_hsla(0,0%,0%,0.4)] py-4 px-4 sm:px-8 lg:px-12 border-b" 
          : "bg-transparent py-6 px-4 sm:px-8 lg:px-12 border-b border-transparent"
      )}
    >
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between h-10 md:h-12">
          
          {/* ── LOGO ────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-3 md:gap-3 group shrink-0 focus-ring"
            aria-label={`${APP_NAME} — Home`}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--color-brand-blue)] to-[hsla(215,85%,45%,1)] shadow-sm group-hover:shadow-[0_2px_8px_hsla(215,85%,55%,0.4)] transition-all duration-300">
              <Vote size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-lg md:text-xl text-white leading-none">
                {APP_NAME}
              </span>
              <span className="text-[11px] font-medium text-[var(--color-brand-saffron)] mt-0.5">
                Indian Elections
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ─────────────────────────────────────── */}
          <ul className={cn(
            "hidden lg:flex items-center gap-1 p-1 rounded-full transition-all duration-500",
            isScrolled ? "bg-[hsla(210,20%,98%,0.02)] border border-[hsla(210,20%,98%,0.05)]" : ""
          )}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "focus-ring block px-4 py-2 rounded-full text-[15px] font-medium transition-colors duration-200",
                      isActive
                        ? "bg-[hsla(210,20%,98%,0.1)] text-white"
                        : "text-[var(--color-brand-muted)] hover:text-white hover:bg-[hsla(210,20%,98%,0.05)]"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── DESKTOP CTA ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/assistant"
              className="focus-ring group flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[var(--color-brand-blue)] rounded-full transition-all duration-200 hover:bg-[hsla(215,85%,60%,1)] shadow-sm hover:shadow-[0_4px_12px_hsla(215,85%,55%,0.2)] hover:-translate-y-[1px]"
            >
              <Sparkles size={16} />
              <span>Ask AI</span>
            </Link>
          </div>

          {/* ── MOBILE MENU BUTTON ──────────────────────────────── */}
          <button
            type="button"
            className="focus-ring lg:hidden p-2 text-white hover:bg-[hsla(210,20%,98%,0.1)] rounded-full transition-colors"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU DROPDOWN ────────────────────────────── */}
      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!isMenuOpen}
        className={cn(
          "lg:hidden absolute left-2 right-2 top-[calc(100%+0.75rem)] z-40 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top",
          isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}
      >
        <div className="glass-panel border-[hsla(210,20%,98%,0.1)] bg-[hsla(222,65%,8%,0.95)] p-5 shadow-2xl rounded-3xl">
          <ul role="list" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    tabIndex={isMenuOpen ? 0 : -1}
                    className={cn(
                      "focus-ring flex items-center px-5 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all duration-300",
                      isActive
                        ? "bg-[hsla(215,85%,55%,0.15)] text-[var(--color-brand-blue)] border border-[hsla(215,85%,55%,0.2)]"
                        : "text-[var(--color-brand-muted)] hover:text-white hover:bg-[hsla(210,20%,98%,0.05)] border border-transparent"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
