import { useState, useEffect, useCallback } from "react";
import { SupportedLanguage } from "@/lib/constants";

export function useLanguage() {
  const [lang, setLang] = useState<SupportedLanguage>("en");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("civic-lang") as SupportedLanguage;
    if (saved) {
      setLang(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const changeLanguage = useCallback((newLang: SupportedLanguage) => {
    setLang(newLang);
    localStorage.setItem("civic-lang", newLang);
    document.documentElement.lang = newLang;
    
    // Optional: Refresh page to apply translations if using a static system,
    // or just let the app reactively update if using dynamic translations.
    // For now, we'll let it be reactive.
  }, []);

  return { lang, changeLanguage };
}
