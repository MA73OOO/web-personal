"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/content/translations";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language].home;

  const quadrants = [
    {
      id: "ma73o",
      title: t.ma73o.title,
      description: t.ma73o.description,
      href: "/ma73o",
      buttonText: t.ma73o.buttonText,
    },
    {
      id: "galeria",
      title: t.galeria.title,
      description: t.galeria.description,
      href: "/galeria",
      buttonText: t.galeria.buttonText,
    },
    {
      id: "desarrollo",
      title: t.desarrollo.title,
      description: t.desarrollo.description,
      href: "/desarrollo",
      buttonText: t.desarrollo.buttonText,
    },
    {
      id: "biblioteca",
      title: t.biblioteca.title,
      description: t.biblioteca.description,
      href: "/biblioteca",
      buttonText: t.biblioteca.buttonText,
    },
  ];

  return (
    <div className="w-full h-full bg-transparent text-black dark:text-white relative grid grid-cols-2 grid-rows-2 font-sans select-none overflow-hidden transition-colors duration-500">
      {/* Central Horizontal Crosshair Line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-black/80 dark:bg-white/80 z-20 pointer-events-none transition-colors duration-500" />

      {/* Central Vertical Crosshair Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-black/80 dark:bg-white/80 z-20 pointer-events-none transition-colors duration-500" />

      {quadrants.map((quad) => (
        <Link
          key={quad.id}
          href={quad.href}
          className="group relative flex flex-col items-center justify-center p-3 sm:p-6 md:p-12 text-center transition-colors duration-500 hover:bg-black hover:text-white dark:hover:bg-neutral-100 dark:hover:text-black"
        >
          {/* Main Title — Responsive font size to prevent overlap on mobile */}
          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-[4.5rem] font-extrabold tracking-tight uppercase transition-all duration-500 ease-out group-hover:-translate-y-6 sm:group-hover:-translate-y-8 md:group-hover:-translate-y-12">
            {quad.title}
          </h1>

          {/* Hover Details Container — Absolute to avoid affecting title default position */}
          <div className="absolute bottom-3 sm:bottom-6 md:bottom-12 left-3 right-3 sm:left-6 sm:right-6 flex flex-col items-center gap-2 sm:gap-4 opacity-0 translate-y-4 sm:translate-y-6 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 ease-out">
            <p className="text-xs sm:text-sm md:text-xl lg:text-[1.5rem] font-light leading-tight max-w-[90%] sm:max-w-sm text-neutral-300 dark:group-hover:text-neutral-700">
              {quad.description}
            </p>
            <span className="inline-block px-2.5 sm:px-4 py-1 sm:py-2 bg-white text-black dark:bg-black dark:text-white font-mono text-[9px] sm:text-[11px] font-bold tracking-widest uppercase border border-white dark:border-black hover:bg-neutral-200 dark:hover:bg-neutral-900 transition-colors shadow-lg">
              {quad.buttonText}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
