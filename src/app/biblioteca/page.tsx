"use client";

import { useState, useEffect } from "react";
import SubpageHeader from "@/components/SubpageHeader";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/content/translations";
import { fetchArticles, ArticleType } from "./services";

const defaultArticles: ArticleType[] = [
  {
    id: "art-01",
    title: "Desarrollo Asistido por Agentes e Infraestructura como Código",
    subtitle: "Cómo la orquestación de LLMs y el protocolo MCP transforman el flujo de trabajo de la ingeniería de software.",
    slug: "desarrollo-asistido-por-agentes",
    content: "",
    category: "AI HARNESSING",
    published: true,
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z"
  },
  {
    id: "art-02",
    title: "Compilación Estática de Next.js y Despliegue en AWS con Terraform",
    subtitle: "Principios para exponer sitios SPA sin servidor mediante CloudFront CDN y S3.",
    slug: "compilacion-estatica-nextjs-aws",
    content: "",
    category: "ARQUITECTURA S3",
    published: true,
    createdAt: "2026-07-15T00:00:00Z",
    updatedAt: "2026-07-15T00:00:00Z"
  }
];

export default function BibliotecaPage() {
  const { language } = useLanguage();
  const t = translations[language].bibliotecaPage;

  const [articles, setArticles] = useState<ArticleType[]>(defaultArticles);

  useEffect(() => {
    fetchArticles()
      .then((data) => {
        if (data.length > 0) {
          setArticles(data);
        }
      })
      .catch((err) => console.error("Error al cargar artículos dinámicos de AWS:", err));
  }, []);

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
          {articles.map((art, index) => {
            const formattedDate = new Date(art.createdAt).toLocaleDateString(
              language === "es" ? "es-ES" : "en-US",
              { year: "numeric", month: "long" }
            );

            return (
              <article
                key={art.id}
                className="border border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-black dark:hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">
                    {"DOC-00"}{index + 1}{" // "}{art.category}
                  </span>
                  <h3 className="text-lg font-bold font-mono text-black dark:text-white">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light">
                    {art.subtitle}
                  </p>
                </div>
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap uppercase">
                  {formattedDate} ↗
                </span>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
