# 02. Hoja de Ruta del Proyecto (Project Roadmap)

Este documento detalla las fases de construcción incremental de la web personal.

---

## 🚀 Fases de Desarrollo

### 🟢 Fase 1: Fundamentos del Repositorio y Bóveda (Completado / En progreso)
- [x] Inicialización del repositorio Git local y remoto (`MA73OOO/web-personal`).
- [x] Configuración de la Bóveda de Documentación (`docs/`).
- [x] Configuración del contexto para agentes de IA (`.agents/AGENTS.md`).
- [x] Creación de `.gitignore` base.|

### 🟡 Fase 2: Configuración del Frontend React (Vite)
- [ ] Inicialización de la aplicación React con Vite.
- [ ] Definición del sistema de diseño (paleta de colores, tipografía, reset de estilos CSS).
- [ ] Componente Navbar y Footer base.
- [ ] Integración de animaciones / micro-interacciones.

### 🔵 Fase 3: Esquema de Contenido Git-based
- [ ] Definición del esquema JSON para Proyectos (Colabb, Figma, Links).
- [ ] Componente para renderizar artículos y documentos en Markdown.
- [ ] Vistas principales (Inicio, Showcase Proyectos, Artículos/Escritos, Sobre mí).

### 🟣 Fase 4: Infraestructura con Terraform
- [ ] Módulo Terraform para S3 Bucket estático.
- [ ] Módulo Terraform para CloudFront CDN y Origin Access Control (OAC).
- [ ] Variables y Outputs declarados en Terraform.

### 🟠 Fase 5: Despliegue Automatizado (CI/CD)
- [ ] Configuración del workflow de GitHub Actions.
- [ ] Manejo de secretos en GitHub Secrets.
- [ ] Verificación de despliegue en vivo en S3/CloudFront.
