"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const nextLang = prev === "es" ? "en" : "es";
      localStorage.setItem("lang", nextLang);
      return nextLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
