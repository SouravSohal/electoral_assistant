"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, Menu, X, Sparkles, LogIn, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
              if ("children" in item) {
                return (
                  <li key={item.id} className="relative group/dropdown">
                    <button
                      className={cn(
                        "focus-ring flex items-center gap-1.5 px-4 py-2 rounded-full text-[15px] font-medium transition-colors duration-200 text-[var(--color-brand-muted)] hover:text-white hover:bg-[hsla(210,20%,98%,0.05)]"
                      )}
                    >
                      {item.label}
                      <ChevronDown size={14} className="group-hover/dropdown:rotate-180 transition-transform duration-200" />
                    </button>
                    
                    {/* Dropdown Menu - Added padding top to bridge the gap and removed mt-2 */}
                    <div className="absolute top-[80%] left-0 pt-4 w-48 opacity-0 translate-y-2 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-200 z-50">
                      <div className="glass-panel border border-[hsla(210,20%,98%,0.1)] p-2 shadow-2xl relative">
                        {/* Invisible bridge to ensure hover is maintained */}
                        <div className="absolute -top-4 left-0 w-full h-4" />
                        
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href}
                            className="block px-3 py-2 rounded-lg text-sm text-[var(--color-brand-muted)] hover:text-white hover:bg-[hsla(210,20%,98%,0.05)] transition-all"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

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

          {/* ── DESKTOP ACTIONS ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <LanguageSwitcher />

            <div className="h-6 w-px bg-[hsla(210,20%,98%,0.1)] mx-1" />

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[hsla(210,20%,98%,0.03)] border border-[hsla(210,20%,98%,0.05)] hover:border-[hsla(215,85%,55%,0.3)] transition-all"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-[hsla(210,20%,98%,0.1)]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-blue)] flex items-center justify-center text-white font-bold">
                      {user.displayName?.[0] || user.email?.[0] || "U"}
                    </div>
                  )}
                  <ChevronDown size={14} className={cn("text-[var(--color-brand-gray-500)] transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-panel border border-[hsla(210,20%,98%,0.1)] p-2 z-50 animate-[fade-in_0.2s_ease-out]">
                    <div className="px-3 py-2 border-b border-[hsla(210,20%,98%,0.05)] mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.displayName || "Citizen"}</p>
                      <p className="text-[10px] text-[var(--color-brand-gray-500)] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-[hsla(0,100%,50%,0.05)] transition-all"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="focus-ring group flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[hsla(210,20%,98%,0.05)] hover:bg-[hsla(210,20%,98%,0.1)] border border-[hsla(210,20%,98%,0.1)] rounded-full transition-all duration-200"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
            )}

            <Link
              href="/assistant"
              className="focus-ring group flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[var(--color-brand-blue)] rounded-full transition-all duration-200 hover:brightness-110 shadow-sm hover:shadow-[0_4px_12px_hsla(215,85%,45%,0.2)] hover:-translate-y-[1px]"
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
              if ("children" in item) {
                return (
                  <li key={item.id} className="flex flex-col">
                    <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-gray-500)] mt-2">
                      {item.label}
                    </div>
                    {item.children.map((child) => {
                      const isActive = pathname === child.href;
                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          tabIndex={isMenuOpen ? 0 : -1}
                          className={cn(
                            "focus-ring flex items-center px-5 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all duration-300",
                            isActive
                              ? "bg-[hsla(215,85%,55%,0.15)] text-[var(--color-brand-blue)] border border-[hsla(215,85%,55%,0.2)]"
                              : "text-[var(--color-brand-muted)] hover:text-white hover:bg-[hsla(210,20%,98%,0.05)] border border-transparent"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </li>
                );
              }

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
