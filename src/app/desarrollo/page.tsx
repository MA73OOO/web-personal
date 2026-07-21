"use client";

import { useState } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import profile from "@/content/profile.json";
import experience from "@/content/experience.json";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/content/translations";

export default function DesarrolloPage() {
  const { language } = useLanguage();
  const t = translations[language].desarrolloPage;

  // Track expanded items in experience timeline dropdowns (first job expanded by default)
  const [expandedJobs, setExpandedJobs] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleJob = (index: number) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const categories = profile.technicalCategories[language];
  const eduList = profile.education[language];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-16 font-sans text-neutral-900 dark:text-neutral-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500 relative pb-24">
      <SubpageHeader sectionNumber="03" />

      {/* Header section */}
      <section className="space-y-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white uppercase">
          {language === "es" ? "DESARROLLO" : "DEVELOPMENT"}
        </h1>
        <p className="text-sm md:text-base font-mono text-neutral-600 dark:text-neutral-400 max-w-2xl">
          {t.headerDesc}
        </p>
      </section>

      {/* 1. SECCIÓN: PERFIL PROFESIONAL */}
      <section className="space-y-4 border-l-2 border-black dark:border-white pl-4 sm:pl-6 py-1">
        <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
          01 // {language === "es" ? "PERFIL PROFESIONAL" : "PROFESSIONAL PROFILE"}
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-black dark:text-white uppercase">
          {profile.name} — {profile.alias}
        </h2>
        <p className="text-sm sm:text-base font-mono text-neutral-600 dark:text-neutral-400 font-medium">
          {profile.title} • {profile.location} • Eng: {profile.englishLevel}
        </p>
        <p className="text-sm sm:text-base text-neutral-800 dark:text-neutral-300 font-light leading-relaxed max-w-3xl pt-2">
          {profile.bio[language]}
        </p>
      </section>

      {/* 2. SECCIÓN: STACK TECNOLÓGICO CON LOGOS E ICONOS */}
      <section className="space-y-6 pt-4 border-t border-neutral-300 dark:border-neutral-800">
        <div className="space-y-1">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
            02 // {language === "es" ? "STACK TECNOLÓGICO" : "TECHNICAL STACK"}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-black dark:text-white uppercase">
            {language === "es" ? "HERRAMIENTAS & ARQUITECTURA" : "TOOLS & ARCHITECTURE"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 border border-neutral-300 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 space-y-3 font-mono"
            >
              <h3 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 border border-neutral-300 dark:border-neutral-800 px-3 py-1.5 text-neutral-800 dark:text-neutral-200 bg-white dark:bg-black text-[11px] font-medium hover:border-black dark:hover:border-white transition-colors"
                  >
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-4 h-4 object-contain flex-shrink-0"
                      />
                    )}
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECCIÓN: EXPERIENCIA LABORAL (LÍNEA DEL TIEMPO + DROPDOWNS ACCORDION) */}
      <section className="space-y-8 pt-4 border-t border-neutral-300 dark:border-neutral-800">
        <div className="space-y-1">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
            03 // {language === "es" ? "TRAYECTORIA LABORAL" : "WORK EXPERIENCE"}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-black dark:text-white uppercase">
            {language === "es" ? "LÍNEA DEL TIEMPO & PROYECTOS" : "TIMELINE & PROJECTS"}
          </h2>
        </div>

        {/* Timeline container */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-neutral-300 dark:border-neutral-800 space-y-10">
          {experience.map((exp, idx) => {
            const isExpanded = !!expandedJobs[idx];
            return (
              <article key={idx} className="relative group">
                {/* Timeline node dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${exp.isCurrent
                    ? "bg-[#1DB954] border-black dark:border-white scale-110"
                    : "bg-neutral-400 dark:bg-neutral-600 border-white dark:border-black"
                    }`}
                />

                {/* Dropdown Card Header */}
                <div
                  onClick={() => toggleJob(idx)}
                  className="p-5 sm:p-6 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 cursor-pointer hover:border-black dark:hover:border-white transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                        {exp.company}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold font-mono text-black dark:text-white uppercase mt-0.5">
                        {exp.role[language]}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      <span>{exp.period[language]}</span>
                      <span className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black font-bold uppercase text-[10px]">
                        {isExpanded ? "[ − MENOS ]" : "[ + VER MÁS ]"}
                      </span>
                    </div>
                  </div>

                  {/* Highlights list inside Dropdown */}
                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 animate-fadeIn">
                      <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 font-light">
                        {exp.highlights[language].map((item, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="text-neutral-400 dark:text-neutral-600 font-mono text-xs mt-0.5">
                              —
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono border border-neutral-300 dark:border-neutral-800 px-2 py-0.5 text-neutral-700 dark:text-neutral-400 bg-white dark:bg-black font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. SECCIÓN: FORMACIÓN & CERTIFICACIONES */}
      <section className="space-y-6 pt-4 border-t border-neutral-300 dark:border-neutral-800">
        <div className="space-y-1">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
            04 // {language === "es" ? "FORMACIÓN & LOGROS" : "EDUCATION & ACHIEVEMENTS"}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-black dark:text-white uppercase">
            {language === "es" ? "ESTUDIOS & CERTIFICADOS" : "STUDIES & CERTIFICATIONS"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Educación */}
          <div className="p-5 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-4 font-mono">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {language === "es" ? "EDUCACIÓN ACADÉMICA" : "ACADEMIC EDUCATION"}
            </h3>
            <div className="space-y-4">
              {eduList.map((edu, eIdx) => (
                <div key={eIdx} className="space-y-1">
                  <h4 className="text-sm font-bold text-black dark:text-white uppercase">
                    {edu.degree}
                  </h4>
                  <p className="text-xs text-neutral-500">{edu.institution} {edu.year ? `(${edu.year})` : ""}</p>
                  {edu.details && (
                    <p className="text-xs font-sans text-neutral-700 dark:text-neutral-400 font-light leading-relaxed">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certificaciones */}
          <div className="p-5 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-4 font-mono">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {language === "es" ? "CERTIFICACIONES DESTACADAS" : "FEATURED CERTIFICATIONS"}
            </h3>
            <ul className="space-y-3">
              {profile.certifications.map((cert, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2.5 text-xs text-neutral-800 dark:text-neutral-300">
                  <span className="text-[#1DB954] font-bold">✓</span>
                  <span className="font-medium">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN: BOTÓN DESCARGAR CV */}
      <section className="pt-6 border-t border-neutral-300 dark:border-neutral-800 text-center space-y-4">
        <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">
          05 // {language === "es" ? "DOCUMENTO OFICIAL" : "OFFICIAL DOCUMENT"}
        </span>
        <a
          href="/Mateo_Henao_Rangel_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-mono text-sm font-bold uppercase tracking-widest border border-black dark:border-white shadow-xl hover:scale-105 transition-transform"
        >
          <span>📄 {language === "es" ? "DESCARGAR CURRÍCULUM (PDF)" : "DOWNLOAD RESUME (PDF)"}</span>
          <span>↓</span>
        </a>
      </section>
    </div>
  );
}
