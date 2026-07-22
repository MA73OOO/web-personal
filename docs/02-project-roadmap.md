# 02. Hoja de Ruta del Proyecto (Project Roadmap)

Este documento detalla las fases de construcción incremental de la web personal.

---

## 🚀 Fases de Desarrollo

### 🟢 Fase 1: Fundamentos del Repositorio y Bóveda (Completado / En progreso)
- [x] Inicialización del repositorio Git local y remoto (`MA73OOO/web-personal`).
- [x] Configuración de la Bóveda de Documentación (`docs/01`, `docs/02`, `docs/03`).
- [x] Configuración de la Bóveda de Arneses (`harness/frontend`, `harness/deploy-config`, `harness/content`).
- [x] Estructura de contexto para agentes (`.agents/AGENTS.md`, `.agents/gemini/`, `.agents/claude/`, etc.).
- [x] Creación de `.gitignore` base.

### 🟡 Fase 2: Configuración del Frontend Next.js (App Router)
- [x] Inicialización de la aplicación Next.js con TypeScript y Tailwind.|
- [x] Configuración de `next.config.js` con `output: 'export'`.
- [ ] Definición del sistema de diseño (paleta de colores, tipografía, componentes UI base).
- [ ] Componente Layout (Navbar y Footer base).
- [ ] Integración de animaciones / micro-interacciones.

### 🔵 Fase 3: Esquema de Contenido Git-based
- [ ] Definición del esquema JSON para Proyectos (Colabb, Figma, Links).
- [ ] Componente para renderizar artículos y documentos en Markdown.
- [ ] Vistas principales (Inicio, Showcase Proyectos, Artículos/Escritos, Sobre mí).

### 🟣 Fase 4: Infraestructura con Terraform
- [x] Módulo Terraform para S3 Bucket estático (`site`) y S3 Bucket multimedia (`media`).
- [x] Módulo Terraform para CloudFront CDN con Origin Access Control (OAC) y regla `/media/*`.
- [x] Variables, Outputs e IAM Policies declarados en `terraform/main.tf`.

### 🟠 Fase 5: Despliegue Automatizado (CI/CD)
- [ ] Configuración del workflow de GitHub Actions.
- [ ] Manejo de secretos en GitHub Secrets.
- [ ] Verificación de despliegue en vivo en S3/CloudFront.
