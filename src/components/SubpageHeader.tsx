"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/content/translations";

export default function SubpageHeader({ sectionNumber }: { sectionNumber: string }) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="space-y-6 border-b border-neutral-300 dark:border-neutral-800 pb-8 mb-12 transition-colors duration-500">
      <div className="flex flex-row items-center justify-between gap-4">
        {/* Left: Back Button with Left Arrow */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white uppercase transition-colors group"
        >
          <span className="text-base transition-transform group-hover:-translate-x-1">←</span>
          <span>{t.backToHome}</span>
        </Link>

        {/* Right: Language Toggle + Theme Toggle */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
