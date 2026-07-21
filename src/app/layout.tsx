import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { RadioProvider } from "@/context/RadioContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MA73O — Personal Web",
  description: "Portafolio y Hub personal de proyectos, galería, desarrollo y biblioteca de escritos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <RadioProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </RadioProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
