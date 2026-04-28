import { useState, useEffect, useCallback } from "react";
import { SupportedLanguage } from "@/lib/constants";

export function useLanguage() {
  const [lang, setLang] = useState<SupportedLanguage>("en");

  // Helper to trigger the Google Translate script
  const triggerGoogleTranslate = (targetLang: string) => {
    // Set the cookie that Google Translate looks for
    document.cookie = `googtrans=/en/${targetLang}; path=/;`;
    
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event("change"));
    } else {
      // If the script hasn't loaded yet, try again in a bit
      setTimeout(() => {
        const retrySelect = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (retrySelect) {
          retrySelect.value = targetLang;
          retrySelect.dispatchEvent(new Event("change"));
        }
      }, 1000);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("civic-lang") as SupportedLanguage;
    if (saved) {
      setLang(saved);
      document.documentElement.lang = saved;
      if (saved !== "en") {
        triggerGoogleTranslate(saved);
      }
    }
  }, []);

  const changeLanguage = useCallback((newLang: SupportedLanguage) => {
    setLang(newLang);
    localStorage.setItem("civic-lang", newLang);
    document.documentElement.lang = newLang;
    
    triggerGoogleTranslate(newLang);
  }, []);

  return { lang, changeLanguage };
}
