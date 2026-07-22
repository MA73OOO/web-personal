"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRadio } from "@/context/RadioContext";

export default function RadioPlayer({ inline = false }: { inline?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    activePlaylistIndex,
    setActivePlaylistIndex,
    isMinimized,
    setIsMinimized,
    currentPlaylist,
    playlists,
  } = useRadio();

  const isGaleriaMusicTab =
    pathname === "/galeria" && searchParams.get("tab") === "musica";

  // Hide global floating instance when on music tab
  if (!inline && isGaleriaMusicTab) {
    return null;
  }

  // Hide inline instance when NOT on music tab
  if (inline && !isGaleriaMusicTab) {
    return null;
  }

  const cyclePlaylist = () => {
    setActivePlaylistIndex(
      (activePlaylistIndex + 1) % playlists.length
    );
  };

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        inline || isGaleriaMusicTab
          ? "w-full max-w-2xl mx-auto my-4"
          : "fixed bottom-6 right-0 sm:right-6 z-50 max-w-[calc(100vw-32px)]"
      }`}
    >
      {/* Minimized Pill Button */}
      {isMinimized && !isGaleriaMusicTab && !inline && (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-4 py-3 bg-black text-white dark:bg-white dark:text-black border-y border-l sm:border border-black dark:border-white rounded-l-full sm:rounded-none shadow-2xl font-mono text-xs tracking-wider uppercase hover:-translate-x-2 transition-all duration-300 animate-slideInRight"
          title="Abrir Radio Spotify"
        >
          <span className="text-base animate-pulse">🎵</span>
          <span className="font-bold">RADIO</span>
          <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping ml-1" />
        </button>
      )}

      {/* Main Spotify Widget Box */}
      <div
        className={`bg-black border border-neutral-800 shadow-2xl overflow-hidden font-mono text-xs space-y-1 transition-all duration-300 ${
          isMinimized && !isGaleriaMusicTab && !inline ? "hidden" : "block"
        } ${
          inline || isGaleriaMusicTab
            ? "w-full"
            : "w-full sm:w-[360px] md:w-[380px]"
        }`}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-[10px] text-neutral-400">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm">🎵</span>
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              RADIO // {currentPlaylist.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {playlists.length > 1 && (
              <button
                onClick={cyclePlaylist}
                title="Cambiar Playlist"
                className="hover:text-white uppercase font-bold text-[9px] sm:text-[10px] tracking-wider"
              >
                [ SIG. 🔄 ]
              </button>
            )}

            {!isGaleriaMusicTab && !inline && (
              <button
                onClick={() => setIsMinimized(true)}
                className="hover:text-white uppercase font-bold text-xs"
              >
                [ — ]
              </button>
            )}
          </div>
        </div>

        {/* Persistent Spotify Iframe */}
        <iframe
          style={{ borderRadius: "0px" }}
          src={`https://open.spotify.com/embed/playlist/${currentPlaylist.id}?utm_source=generator&theme=0`}
          width="100%"
          height={inline || isGaleriaMusicTab ? "352" : "152"}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Persistent Radio Player"
        />

        {/* Extended Title, Description & Green Spotify Link Button */}
        {(inline || isGaleriaMusicTab) && (
          <div className="p-4 sm:p-6 bg-white dark:bg-black text-black dark:text-white border-t border-neutral-300 dark:border-neutral-800 space-y-4 font-sans animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight uppercase">
                {currentPlaylist.title}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-xl">
                {currentPlaylist.description}
              </p>
            </div>

            <div className="pt-1">
              <a
                href={currentPlaylist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-md rounded-full text-center"
              >
                <span>ABRIR PLAYLIST EN SPOTIFY</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
