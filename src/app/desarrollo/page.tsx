"use client";

import { useState } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import profile from "@/content/profile.json";
import experience from "@/content/experience.json";
import projects from "@/content/projects.json";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/content/translations";
import { getAssetUrl } from "@/utils/assets";

export default function DesarrolloPage() {
  const { language } = useLanguage();
  const t = translations[language].desarrolloPage;

  // Track expanded items in experience timeline dropdowns (first job expanded by default)
  const [expandedJobs, setExpandedJobs] = useState<Record<number, boolean>>({
    0: true,
  });

  // Track active project modal
  const [activeProject, setActiveProject] = useState<typeof projects[number] | null>(null);

  // Track expanded sections in the project detail modal (why is open by default)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    why: true,
    what: false,
    frontend: false,
    backend: false,
    devops: false,
    roadmap: false,
  });

  const toggleJob = (index: number) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const categories = profile.technicalCategories[language];
  const eduList = profile.education[language];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-16 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500 relative pb-24">
      <SubpageHeader sectionNumber="03" />

      {/* Header section */}
      <section className="space-y-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase title-page">
          {language === "es" ? "DESARROLLO" : "DEVELOPMENT"}
        </h1>
        <p className="text-sm md:text-base font-bold label-mono text-neutral-600 dark:text-neutral-400">
          {t.headerDesc}
        </p>
      </section>

      {/* 1. SECCIÓN: PERFIL PROFESIONAL */}
      <section className="space-y-4 border-l-[3px] border-black dark:border-white pl-4 sm:pl-6 py-1">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight uppercase title-page mt-0.5">
          {profile.name} — {profile.alias}
        </h2>
        <p className="text-sm sm:text-base font-bold label-mono text-neutral-700 dark:text-neutral-300">
          {profile.title} • {profile.location} • ENG: {profile.englishLevel}
        </p>
        <p className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 font-light leading-relaxed max-w-3xl pt-2">
          {profile.bio[language]}
        </p>
      </section>

      {/* 2. SECCIÓN: STACK TECNOLÓGICO */}
      <section className="space-y-6 pt-6 border-t border-neutral-300 dark:border-neutral-800">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase title-section">
            {language === "es" ? "HERRAMIENTAS & ARQUITECTURA" : "TOOLS & ARCHITECTURE"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 border-2 border-black dark:border-white bg-neutral-50/60 dark:bg-neutral-950/60 space-y-4 shadow-sm"
            >
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider pb-2 border-b border-neutral-300 dark:border-neutral-800 label-mono">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 px-3.5 py-2 text-[11px] font-bold uppercase transition-all hover:scale-105 badge-tech"
                  >
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-4.5 h-4.5 object-contain flex-shrink-0"
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

      {/* 3. SECCIÓN: EXPERIENCIA LABORAL (LÍNEA DEL TIEMPO + ACCORDION) */}
      <section className="space-y-8 pt-6 border-t border-neutral-300 dark:border-neutral-800">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase title-section">
            {language === "es" ? "LÍNEA DEL TIEMPO" : "TIMELINE"}
          </h2>
        </div>

        {/* Timeline container */}
        <div className="relative pl-6 sm:pl-8 border-l-[3px] border-black dark:border-white space-y-10">
          {experience.map((exp, idx) => {
            const isExpanded = !!expandedJobs[idx];
            return (
              <article key={idx} className="relative group">
                {/* Timeline node dot (Strict Monochrome) */}
                <div
                  className={`absolute -left-[32px] sm:-left-[41px] top-1.5 w-4.5 h-4.5 rounded-full border-[3px] transition-all duration-300 ${
                    exp.isCurrent
                      ? "bg-black dark:bg-white border-black dark:border-white scale-125 shadow-md animate-pulse"
                      : "bg-neutral-400 dark:bg-neutral-600 border-white dark:border-black"
                  }`}
                />

                {/* Dropdown Card Header */}
                <div
                  onClick={() => toggleJob(idx)}
                  className="p-5 sm:p-6 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 cursor-pointer hover:shadow-lg transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest label-mono opacity-80">
                        {exp.company}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold uppercase mt-0.5 title-sub">
                        {exp.role[language]}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-bold label-mono text-neutral-700 dark:text-neutral-300">
                      <span>{exp.period[language]}</span>
                      <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black font-extrabold uppercase text-[10px] tracking-wider rounded-sm">
                        {isExpanded ? "− OCULTAR" : "+ DETALLES"}
                      </span>
                    </div>
                  </div>

                  {/* Highlights list inside Dropdown */}
                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-neutral-300 dark:border-neutral-800 animate-fadeIn">
                      <ul className="space-y-3 text-sm sm:text-base text-neutral-800 dark:text-neutral-200 font-light">
                        {exp.highlights[language].map((item, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="text-black dark:text-white font-bold font-mono text-xs mt-1">
                              —
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-bold uppercase px-3 py-1 badge-tech"
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

      {/* 4. SECCIÓN: PROYECTOS DESTACADOS */}
      <section className="space-y-8 pt-6 border-t border-neutral-300 dark:border-neutral-800">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase title-section">
            {language === "es" ? "PROYECTOS DESTACADOS" : "FEATURED PROJECTS"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setActiveProject(proj)}
              className="p-6 sm:p-8 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest font-mono bg-black text-white dark:bg-white dark:text-black px-2 py-0.5">
                    {proj.id === "colabb-world"
                      ? (language === "es" ? "PRODUCTO COMERCIAL" : "COMMERCIAL PRODUCT")
                      : (language === "es" ? "INGENIERÍA & DEPLOY" : "ENGINEERING & DEPLOY")}
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight title-page">
                  {proj.title}
                </h3>
                <p className="text-[11px] font-bold label-mono text-neutral-600 dark:text-neutral-400">
                  {proj.slogan[language]}
                </p>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 font-light leading-relaxed">
                  {proj.description[language]}
                </p>
              </div>

              <div className="space-y-4 pt-3 border-t border-neutral-300 dark:border-neutral-800">
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-bold uppercase px-2 py-0.5 badge-tech"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.technologies.length > 4 && (
                    <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase self-center pl-1">
                      + {proj.technologies.length - 4}
                    </span>
                  )}
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity border border-black dark:border-white">
                  <span>{language === "es" ? "DETALLES" : "DETAILS"}</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SECCIÓN: FORMACIÓN & CERTIFICACIONES */}
      <section className="space-y-6 pt-6 border-t border-neutral-300 dark:border-neutral-800">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase title-section">
            {language === "es" ? "ESTUDIOS & CERTIFICADOS" : "STUDIES & CERTIFICATIONS"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Educación */}
          <div className="p-5 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest border-b border-neutral-300 dark:border-neutral-800 pb-2 label-mono">
              {language === "es" ? "EDUCACIÓN ACADÉMICA" : "ACADEMIC EDUCATION"}
            </h3>
            <div className="space-y-5">
              {eduList.map((edu, eIdx) => (
                <div key={eIdx} className="space-y-1">
                  <h4 className="text-base font-bold text-black dark:text-white uppercase tracking-tight">
                    {edu.degree}
                  </h4>
                  <p className="text-xs font-bold label-mono text-neutral-500">{edu.institution} {edu.year ? `(${edu.year})` : ""}</p>
                  {edu.details && (
                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-400 font-light leading-relaxed pt-1">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certificaciones */}
          <div className="p-5 border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest border-b border-neutral-300 dark:border-neutral-800 pb-2 label-mono">
              {language === "es" ? "CERTIFICACIONES DESTACADAS" : "FEATURED CERTIFICATIONS"}
            </h3>
            <ul className="space-y-3">
              {profile.certifications.map((cert, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                  <span className="text-black dark:text-white font-bold text-sm">✓</span>
                  <span className="font-semibold">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN: BOTÓN DESCARGAR CV */}
      <section className="pt-8 border-t border-neutral-300 dark:border-neutral-800 text-center">
        <a
          href={getAssetUrl("/Mateo_Henao_Rangel_CV.pdf")}
          target="_blank"
          rel="noopener noreferrer"

          className="inline-flex items-center justify-center gap-3 px-8 py-4 btn-primary rounded-none shadow-xl hover:scale-105 transition-transform"
        >
          <span>📄 {language === "es" ? "DESCARGAR CURRÍCULUM (PDF)" : "DOWNLOAD RESUME (PDF)"}</span>
          <span>↓</span>
        </a>
      </section>

      {/* PROJECT LIGHTBOX MODAL */}
      {activeProject && (
        <div
          onClick={() => setActiveProject(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-black text-black dark:text-white border-[3px] border-black dark:border-white p-6 sm:p-8 max-w-3xl w-full font-mono text-xs space-y-5 relative cursor-default animate-fadeIn"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b-2 border-black dark:border-white pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono bg-black text-white dark:bg-white dark:text-black px-2 py-0.5">
                  {language === "es" ? "PROYECTO DETALLE" : "PROJECT DETAILS"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight title-page mt-1">
                  {activeProject.title}
                </h2>
                <p className="text-xs font-bold text-neutral-500">
                  {activeProject.slogan[language]}
                </p>
              </div>

              <button
                onClick={() => setActiveProject(null)}
                className="px-3 py-1 btn-primary text-xs uppercase font-extrabold"
              >
                {language === "es" ? "✕ CERRAR" : "✕ CLOSE"}
              </button>
            </div>

            {/* Modal Body Scroll Container with 100% Accordion flow */}
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              
              {/* 1. WHY ACCORDION */}
              <div className="border border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
                <div
                  onClick={() => toggleSection("why")}
                  className="flex justify-between items-center px-4 py-3 cursor-pointer bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest label-mono text-black dark:text-white">
                    💡 {language === "es" ? "¿Por qué lo creé?" : "Why I built it"}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 font-mono">
                    {expandedSections.why ? "[ − ]" : "[ + ]"}
                  </span>
                </div>
                {expandedSections.why && (
                  <div className="p-4 border-t border-neutral-300 dark:border-neutral-800 animate-fadeIn">
                    <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                      {activeProject.why[language]}
                    </p>
                  </div>
                )}
              </div>

              {/* 2. WHAT ACCORDION */}
              <div className="border border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
                <div
                  onClick={() => toggleSection("what")}
                  className="flex justify-between items-center px-4 py-3 cursor-pointer bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest label-mono text-black dark:text-white">
                    ⚙️ {language === "es" ? "¿Qué hace la plataforma?" : "What does it do?"}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 font-mono">
                    {expandedSections.what ? "[ − ]" : "[ + ]"}
                  </span>
                </div>
                {expandedSections.what && (
                  <div className="p-4 border-t border-neutral-300 dark:border-neutral-800 animate-fadeIn">
                    <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                      {activeProject.what[language]}
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Architecture categories map inside Modal */}
              {Object.entries(activeProject.architecture[language]).map(([categoryName, bullets]) => {
                // Generate a unique state key for each dynamic section
                const sectionKey = categoryName.toLowerCase().replace(/[^a-z]/g, "");
                const isSectionExpanded = !!expandedSections[sectionKey];

                return (
                  <div
                    key={categoryName}
                    className="border border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50"
                  >
                    <div
                      onClick={() => toggleSection(sectionKey)}
                      className="flex justify-between items-center px-4 py-3 cursor-pointer bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest label-mono text-black dark:text-white">
                        🏗️ {categoryName}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-500 font-mono">
                        {isSectionExpanded ? "[ − ]" : "[ + ]"}
                      </span>
                    </div>

                    {isSectionExpanded && (
                      <div className="p-4 border-t border-neutral-300 dark:border-neutral-800 animate-fadeIn">
                        <ul className="space-y-3 font-sans text-sm text-neutral-700 dark:text-neutral-300 font-light pl-2">
                          {(bullets as string[]).map((line, lIdx) => (
                            <li key={lIdx} className="flex items-start gap-2.5 leading-relaxed">
                              <span className="text-black dark:text-white font-bold mt-0.5 flex-shrink-0">•</span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 3. TECH STACK (Flat & always visible by default at the bottom of the modal) */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white label-mono border-b border-neutral-300 dark:border-neutral-800 pb-1">
                  🛡️ {language === "es" ? "Stack de Tecnologías" : "Technologies"}
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeProject.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-bold uppercase px-2.5 py-1 badge-tech animate-fadeIn"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Direct Project Link Button (Strict Monochrome utilizing global design system class) */}
            <div className="pt-4 border-t-2 border-black dark:border-white text-center">
              <a
                href={activeProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 btn-primary hover:scale-105 transition-all shadow-md font-mono text-sm font-bold tracking-widest rounded-none"
              >
                <span>
                  {activeProject.id === "colabb-world"
                    ? (language === "es" ? "IR A COLABB.CO" : "VISIT COLABB.CO")
                    : (language === "es" ? "VER CÓDIGO EN GITHUB" : "VIEW CODE ON GITHUB")}
                </span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
