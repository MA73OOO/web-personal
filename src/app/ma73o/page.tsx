"use client";

import Link from "next/link";
import SubpageHeader from "@/components/SubpageHeader";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/content/translations";

const socialLinks = [
  { name: "INSTAGRAM", url: "https://instagram.com" },
  { name: "TWITTER / X", url: "https://x.com" },
  { name: "LINKEDIN", url: "https://linkedin.com/in/mateo-henao-rangel" },
  { name: "GITHUB", url: "https://github.com/MA73OOO" },
];

export default function Ma73oPage() {
  const { language } = useLanguage();
  const t = translations[language].ma73oPage;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-16 font-sans text-neutral-900 dark:text-neutral-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
      <SubpageHeader sectionNumber="01" />

      {/* Title & Subtitle */}
      <section className="space-y-3">
        <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
          {t.subtitle}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white uppercase">
          MA73O
        </h1>
      </section>

      {/* World Perspective / Personal Vision */}
      <section className="space-y-4 border-l-2 border-black dark:border-white pl-6 py-2">
        <h2 className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
          {t.perspectiveTitle}
        </h2>
        <p className="text-lg md:text-2xl leading-relaxed text-black dark:text-white font-light">
          &quot;{t.perspectiveText}&quot;
        </p>
      </section>

      {/* Introduction to the 3 Sections */}
      <section className="space-y-8 pt-4">
        <h2 className="text-xs font-mono tracking-widest text-neutral-500 uppercase border-b border-neutral-200 dark:border-neutral-900 pb-2">
          {t.sectionsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Intro Galeria */}
          <Link
            href="/galeria"
            className="group p-6 border border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 hover:border-black dark:hover:border-white transition-all space-y-3"
          >
            <span className="text-xs font-mono font-bold text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
              {t.galeriaIntroTitle}
            </span>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
              {t.galeriaIntroDesc}
            </p>
            <span className="inline-block text-[11px] font-mono text-black dark:text-white font-semibold group-hover:translate-x-1 transition-transform">
              VER GALERÍA →
            </span>
          </Link>

          {/* Intro Desarrollo */}
          <Link
            href="/desarrollo"
            className="group p-6 border border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 hover:border-black dark:hover:border-white transition-all space-y-3"
          >
            <span className="text-xs font-mono font-bold text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
              {t.desarrolloIntroTitle}
            </span>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
              {t.desarrolloIntroDesc}
            </p>
            <span className="inline-block text-[11px] font-mono text-black dark:text-white font-semibold group-hover:translate-x-1 transition-transform">
              EXPLORAR PROYECTOS →
            </span>
          </Link>

          {/* Intro Biblioteca */}
          <Link
            href="/biblioteca"
            className="group p-6 border border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 hover:border-black dark:hover:border-white transition-all space-y-3"
          >
            <span className="text-xs font-mono font-bold text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
              {t.bibliotecaIntroTitle}
            </span>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
              {t.bibliotecaIntroDesc}
            </p>
            <span className="inline-block text-[11px] font-mono text-black dark:text-white font-semibold group-hover:translate-x-1 transition-transform">
              LEER ESCRITOS →
            </span>
          </Link>
        </div>
      </section>

      {/* Social Links (Redes Sociales) */}
      <section className="space-y-6 border-t border-neutral-200 dark:border-neutral-900 pt-10">
        <h2 className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
          {t.socialTitle}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
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
