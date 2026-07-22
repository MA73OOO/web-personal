"use client";

import Link from "next/link";
import SubpageHeader from "@/components/SubpageHeader";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/content/translations";

const socialLinks = [
  {
    name: "INSTAGRAM",
    url: "https://instagram.com",
    hoverClass: "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent",
  },
  {
    name: "TWITTER / X",
    url: "https://x.com",
    hoverClass: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-black dark:hover:border-white",
  },
  {
    name: "LINKEDIN",
    url: "https://linkedin.com/in/mateo-henao-rangel",
    hoverClass: "hover:bg-[#0077b5] hover:text-white hover:border-transparent",
  },
  {
    name: "GITHUB",
    url: "https://github.com/MA73OOO",
    hoverClass: "hover:bg-[#24292e] hover:text-white hover:border-transparent",
  },
];

export default function Ma73oPage() {
  const { language } = useLanguage();
  const t = translations[language].ma73oPage;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-16 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
      <SubpageHeader sectionNumber="01" />

      {/* Title & Subtitle */}
      <section className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest label-mono text-neutral-500">
          {t.subtitle}
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase title-page">
          MA73O
        </h1>
      </section>

      {/* World Perspective / Personal Vision */}
      <section className="space-y-4 border-l-[3.5px] border-black dark:border-white pl-6 py-2">
        <h2 className="text-xs font-bold uppercase tracking-widest label-mono text-neutral-500">
          {t.perspectiveTitle}
        </h2>
        <p className="text-xl md:text-3xl font-extrabold tracking-tight text-black dark:text-white uppercase leading-tight font-sans">
          &quot;{t.perspectiveText}&quot;
        </p>
      </section>

      {/* Introduction to the 3 Sections */}
      <section className="space-y-8 pt-4 border-t border-neutral-300 dark:border-neutral-800">
        <h2 className="text-sm font-bold uppercase tracking-widest label-mono text-neutral-500 pb-2">
          {t.sectionsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Intro Galeria */}
          <Link
            href="/galeria"
            className="group p-6 border-2 border-black dark:border-white bg-neutral-50/50 dark:bg-neutral-950/50 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all space-y-4 shadow-sm"
          >
            <span className="text-xs font-bold uppercase label-mono tracking-wider">
              {t.galeriaIntroTitle}
            </span>
            <p className="text-xs sm:text-sm font-light leading-relaxed opacity-95">
              {t.galeriaIntroDesc}
            </p>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest border-b-2 border-current pt-1">
              {language === "es" ? "VER GALERÍA →" : "VIEW GALLERY →"}
            </span>
          </Link>

          {/* Intro Desarrollo */}
          <Link
            href="/desarrollo"
            className="group p-6 border-2 border-black dark:border-white bg-neutral-50/50 dark:bg-neutral-950/50 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all space-y-4 shadow-sm"
          >
            <span className="text-xs font-bold uppercase label-mono tracking-wider">
              {t.desarrolloIntroTitle}
            </span>
            <p className="text-xs sm:text-sm font-light leading-relaxed opacity-95">
              {t.desarrolloIntroDesc}
            </p>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest border-b-2 border-current pt-1">
              {language === "es" ? "EXPLORAR PROYECTOS →" : "EXPLORE PROJECTS →"}
            </span>
          </Link>

          {/* Intro Biblioteca */}
          <Link
            href="/biblioteca"
            className="group p-6 border-2 border-black dark:border-white bg-neutral-50/50 dark:bg-neutral-950/50 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all space-y-4 shadow-sm"
          >
            <span className="text-xs font-bold uppercase label-mono tracking-wider">
              {t.bibliotecaIntroTitle}
            </span>
            <p className="text-xs sm:text-sm font-light leading-relaxed opacity-95">
              {t.bibliotecaIntroDesc}
            </p>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest border-b-2 border-current pt-1">
              {language === "es" ? "LEER ESCRITOS →" : "READ ARTICLES →"}
            </span>
          </Link>
        </div>
      </section>

      {/* Social Links (Redes Sociales) */}
      <section className="space-y-6 border-t border-neutral-300 dark:border-neutral-800 pt-10">
        <h2 className="text-xs font-bold uppercase tracking-widest label-mono text-neutral-500">
          {t.socialTitle}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-4 border-2 border-black dark:border-white bg-neutral-50/50 dark:bg-neutral-950/50 hover:scale-105 font-bold transition-all shadow-sm ${link.hoverClass}`}
            >
              <span>{link.name}</span>
              <span>↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
