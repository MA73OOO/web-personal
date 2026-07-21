"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`px-3 py-1 text-xs font-mono tracking-widest uppercase border transition-all duration-300 ${
        theme === "dark"
          ? "bg-white text-black border-white hover:bg-neutral-200"
          : "bg-black text-white border-black hover:bg-neutral-800"
      } ${className}`}
    >
      {theme === "light" ? "☾ MODO OSCURO" : "☼ MODO CLARO"}
    </button>
  );
}
