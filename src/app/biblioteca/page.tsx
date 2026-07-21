"use client";

import SubpageHeader from "@/components/SubpageHeader";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/content/translations";

export default function BibliotecaPage() {
  const { language } = useLanguage();
  const t = translations[language].bibliotecaPage;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-16 font-sans text-neutral-900 dark:text-neutral-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
      <SubpageHeader sectionNumber="04" />

      {/* Header section */}
      <section className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white uppercase">
          {language === "es" ? "BIBLIOTECA" : "LIBRARY"}
        </h1>
        <p className="text-sm md:text-base font-mono text-neutral-600 dark:text-neutral-400">
          {t.headerDesc}
        </p>
      </section>

      {/* Writings List */}
      <section className="space-y-6">
        <h2 className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
          {t.articlesSection}
        </h2>

        <div className="space-y-4">
          <article className="border border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-black dark:hover:border-neutral-700 transition-colors cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">DOC-001 // AI HARNESSING</span>
              <h3 className="text-lg font-bold font-mono text-black dark:text-white">
                Desarrollo Asistido por Agentes e Infraestructura como Código
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                Cómo la orquestación de LLMs y el protocolo MCP transforman el flujo de trabajo de la ingeniería de software.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">JULIO 2026 ↗</span>
          </article>

          <article className="border border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-black dark:hover:border-neutral-700 transition-colors cursor-pointer">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">DOC-002 // ARQUITECTURA S3</span>
              <h3 className="text-lg font-bold font-mono text-black dark:text-white">
                Compilación Estática de Next.js y Despliegue en AWS con Terraform
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                Principios para exponer sitios SPA sin servidor mediante CloudFront CDN y S3.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">JULIO 2026 ↗</span>
          </article>
        </div>
      </section>
    </div>
  );
}
