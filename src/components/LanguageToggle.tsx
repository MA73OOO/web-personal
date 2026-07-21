"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label="Toggle Language"
      className={`px-3 py-1 text-xs font-mono tracking-widest uppercase border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 ${className}`}
    >
      🌐 {language.toUpperCase()}
    </button>
  );
}
