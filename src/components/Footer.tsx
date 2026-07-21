import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-900 bg-black py-12 text-neutral-400">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="text-xs font-mono text-neutral-300">
            PERSONAL HUB — NEXT.JS + TERRAFORM + AWS S3
          </p>
          <p className="text-[11px] text-neutral-600">
            Diseño minimalista monocromático • {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://figma.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Figma ↗
          </a>
          <Link
            href="/projects"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Colabb
          </Link>
        </div>
      </div>
    </footer>
  );
}
