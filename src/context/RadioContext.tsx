"use client";

import React, { createContext, useContext, useState } from "react";
import spotifyConfig from "@/content/spotify.json";

interface RadioContextType {
  activePlaylistIndex: number;
  setActivePlaylistIndex: (index: number) => void;
  isMinimized: boolean;
  setIsMinimized: (min: boolean) => void;
  currentPlaylist: (typeof spotifyConfig.playlists)[0];
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const currentPlaylist =
    spotifyConfig.playlists[activePlaylistIndex] || spotifyConfig.playlists[0];

  return (
    <RadioContext.Provider
      value={{
        activePlaylistIndex,
        setActivePlaylistIndex,
        isMinimized,
        setIsMinimized,
        currentPlaylist,
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
