"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import RadioPlayer from "@/components/RadioPlayer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <main className="w-full h-screen overflow-hidden bg-transparent relative">
        {children}
        <Suspense fallback={null}>
          <RadioPlayer />
        </Suspense>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent text-neutral-900 dark:text-neutral-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black relative">
      {children}
      <Suspense fallback={null}>
        <RadioPlayer />
      </Suspense>
    </main>
  );
}
