"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SubpageHeader from "@/components/SubpageHeader";
import RadioPlayer from "@/components/RadioPlayer";
import defaultPhotos from "@/content/photos.json";
import spotifyConfig from "@/content/spotify.json";
import { useLanguage } from "@/context/LanguageContext";
import { useRadio } from "@/context/RadioContext";
import { fetchPhotos, PhotoType } from "./services";

function GaleriaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { activePlaylistIndex, setActivePlaylistIndex } = useRadio();
  const tabsRef = useRef<HTMLElement | null>(null);

  const currentTab = searchParams.get("tab") === "musica" ? "musica" : "fotos";
  const [selectedYear, setSelectedYear] = useState<string>("TODAS");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Cargar fotos dinámicamente con fallback estático para exportación rápida
  const [photoList, setPhotoList] = useState<PhotoType[]>(defaultPhotos as PhotoType[]);

  useEffect(() => {
    fetchPhotos()
      .then((data) => {
        if (data.length > 0) {
          setPhotoList(data);
        }
      })
      .catch((err) => console.error("Error al cargar fotos de la API de AWS:", err));
  }, []);

  const years = ["TODAS", "2026", "2025", "2024"];

  const setTab = (tab: "fotos" | "musica") => {
    router.push(`/galeria?tab=${tab}`, { scroll: false });
    setTimeout(() => {
      tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const filteredPhotos =
    selectedYear === "TODAS"
      ? photoList
      : photoList.filter((p) => p.year === selectedYear);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8 font-sans text-neutral-900 dark:text-neutral-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500 relative pb-20">
      <SubpageHeader sectionNumber="02" />

      {/* Header section */}
      <section className="space-y-2 text-center md:text-left pt-2 sm:pt-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white uppercase">
          {language === "es" ? "GALERÍA" : "GALLERY"}
        </h1>
        <p className="text-sm md:text-base font-mono text-neutral-600 dark:text-neutral-400">
          {language === "es"
            ? '"La vida sin música ni fotografías no es vida, no hay memoria..."'
            : '"Life without music or photography is no life, there is no memory..."'}
        </p>
      </section>

      {/* Centered Navigation Bar (Fotos | Música) */}
      <section
        ref={tabsRef}
        className="flex justify-center items-center gap-6 font-mono text-sm sm:text-base md:text-lg border-b border-neutral-300 dark:border-neutral-800 pt-4 sm:pt-6 scroll-mt-6"
      >
        <button
          onClick={() => setTab("fotos")}
          className={`pb-1 transition-all ${
            currentTab === "fotos"
              ? "font-bold text-black dark:text-white border-b-2 border-black dark:border-white"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          {language === "es" ? "Fotos" : "Photos"}
        </button>

        <span className="text-neutral-400">|</span>

        <button
          onClick={() => setTab("musica")}
          className={`pb-1 transition-all ${
            currentTab === "musica"
              ? "font-bold text-black dark:text-white border-b-2 border-black dark:border-white"
              : "text-neutral-500 hover:text-black dark:hover:text-white"
          }`}
        >
          {language === "es" ? "Música" : "Music"}
        </button>
      </section>

      {/* Tab Content Container with Min-Height for Smooth Level Transition */}
      <div className="min-h-[70vh] sm:min-h-[750px] transition-all duration-500">
        {/* TAB 1: FOTOS */}
        {currentTab === "fotos" && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Filter Toolbar (Año / Filtro de tiempo) */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-300 dark:border-neutral-800 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mr-1 sm:mr-2">
                  FILTRAR POR AÑO:
                </span>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-2.5 py-1 text-xs font-mono tracking-wider transition-all uppercase ${
                      selectedYear === year
                        ? "bg-black text-white dark:bg-white dark:text-black font-bold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              <span className="text-xs font-mono text-neutral-500">
                MOSTRANDO {filteredPhotos.length} OBRA(S)
              </span>
            </div>

            {/* Masonry / Collage Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {filteredPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className="break-inside-avoid group relative cursor-pointer overflow-hidden border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 transition-all hover:border-black dark:hover:border-white"
                >
                  <div className={`w-full ${photo.aspectRatio} overflow-hidden relative`}>
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                  </div>

                  <div className="p-3 sm:p-4 space-y-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                      <span>{photo.category}</span>
                      <span>{photo.year}</span>
                    </div>
                    <h3 className="text-xs font-bold font-mono text-black dark:text-white uppercase truncate">
                      {photo.title}
                    </h3>
                    <p className="text-[10px] font-mono text-neutral-400 truncate">{photo.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MÚSICA (Exactly matching Wireframe Mockup: Follow row -> Inline RadioPlayer -> Playlist selector pills) */}
        {currentTab === "musica" && (
          <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto pt-2">
            {/* Step 2: "Sígueme en mi spotify" + Green Button "MA73O" */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 py-2 text-center">
              <span className="text-sm sm:text-base md:text-lg font-mono text-neutral-800 dark:text-neutral-200">
                {language === "es" ? "Sígueme en mi Spotify" : "Follow me on Spotify"}
              </span>
              <a
                href="https://open.spotify.com/user/sl1djsjw24juot8wucfg6bqqf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono text-xs sm:text-sm font-black uppercase tracking-wider rounded-2xl shadow-lg transition-transform hover:scale-105"
              >
                MA73O
              </a>
            </div>

            {/* Step 3: Inline Radio Player Widget guaranteed in DOM right here */}
            <RadioPlayer inline />

            {/* Step 4: Playlist selector pills */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 font-mono text-xs pt-4 border-t border-neutral-300 dark:border-neutral-800">
              <span className="text-neutral-500 uppercase w-full sm:w-auto text-center sm:text-left mb-1 sm:mb-0">
                PLAYLISTS:
              </span>
              {spotifyConfig.playlists.map((pl, idx) => (
                <button
                  key={pl.id}
                  onClick={() => setActivePlaylistIndex(idx)}
                  className={`px-3 py-1 font-bold uppercase transition-all ${
                    idx === activePlaylistIndex
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-neutral-500 border border-neutral-300 dark:border-neutral-800 hover:border-black dark:hover:border-white"
                  }`}
                >
                  {pl.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-black border border-neutral-800 p-4 space-y-4 text-white font-mono"
          >
            <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800 pb-2">
              <span>{filteredPhotos[activePhotoIndex].title}</span>
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="hover:text-white text-sm font-bold"
              >
                ✕ CERRAR
              </button>
            </div>
            <img
              src={filteredPhotos[activePhotoIndex].url}
              alt={filteredPhotos[activePhotoIndex].title}
              className="max-h-[75vh] w-full object-contain mx-auto"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>{filteredPhotos[activePhotoIndex].location}</span>
              <span>{filteredPhotos[activePhotoIndex].date}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GaleriaPage() {
  return (
    <Suspense fallback={null}>
      <GaleriaContent />
    </Suspense>
  );
}
