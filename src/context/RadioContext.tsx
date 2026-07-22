"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import spotifyConfig from "@/content/spotify.json";

export interface PlaylistType {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface RadioContextType {
  activePlaylistIndex: number;
  setActivePlaylistIndex: (index: number) => void;
  isMinimized: boolean;
  setIsMinimized: (min: boolean) => void;
  currentPlaylist: PlaylistType;
  playlists: PlaylistType[];
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistType[]>(spotifyConfig.playlists);

  useEffect(() => {
    fetch("https://7jddb01yw9.execute-api.us-east-1.amazonaws.com/tracks")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlaylists(data);
        }
      })
      .catch((err) => console.error("Error al cargar playlists dinámicas de AWS:", err));
  }, []);

  const currentPlaylist = playlists[activePlaylistIndex] || playlists[0] || spotifyConfig.playlists[0];

  return (
    <RadioContext.Provider
      value={{
        activePlaylistIndex,
        setActivePlaylistIndex,
        isMinimized,
        setIsMinimized,
        currentPlaylist,
        playlists,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error("useRadio must be used within a RadioProvider");
  }
  return context;
}
