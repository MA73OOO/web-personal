"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "INICIO" },
  { href: "/ma73o", label: "MA73O" },
  { href: "/galeria", label: "GALERIA" },
  { href: "/desarrollo", label: "DESARROLLO" },
  { href: "/biblioteca", label: "BIBLIOTECA" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="font-mono text-xs tracking-widest uppercase text-white font-extrabold flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="w-2 h-2 bg-white animate-ping" />
          <span>MA73O // HUB</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-xs font-mono tracking-widest uppercase transition-all ${
                  isActive
                    ? "bg-white text-black font-bold"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden">
          <Link
            href="/ma73o"
            className="text-xs font-mono px-3 py-1.5 border border-white text-white rounded-none hover:bg-white hover:text-black transition-colors uppercase"
          >
            MA73O
          </Link>
        </div>
      </div>
    </header>
  );
}
