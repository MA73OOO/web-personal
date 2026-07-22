# 02. Hoja de Ruta del Proyecto (Project Roadmap)

Este documento detalla las fases de construcción incremental de la web personal, adaptadas para reflejar la arquitectura serverless desacoplada e híbrida (S3 + RDS + Cognito + Lambdas).

---

## 🚀 Fases de Desarrollo

### 🟢 Fase 1: Fundamentos del Repositorio y Arneses (Completado)
- [x] Inicialización del repositorio Git local y remoto (`MA73OOO/web-personal`).
- [x] Configuración de la Bóveda de Documentación (`docs/01-architecture-overview.md`, `docs/02-project-roadmap.md`, `docs/03-harnesses-and-automation.md`).
- [x] Configuración de la Bóveda de Arneses (`harness/README.md`, `harness/validate-build.js`, `harness/git-prep.ps1`, `harness/check-env.ps1`).
- [x] Estructura de contexto para agentes (`.agents/AGENTS.md`, `task.md`).
- [x] Creación y optimización de `.gitignore` base para omitir dependencias de backend y binarios compilados de Terraform.

### 🟡 Fase 2: Configuración del Frontend Next.js & UI (Completado)
- [x] Inicialización de la aplicación Next.js con TypeScript y Tailwind CSS.
- [x] Configuración de `next.config.js` con `output: 'export'` para alojamiento estático.
- [x] Diseño estético premium (Navbar y Footer base, paleta de colores oscuros).
- [x] Integración de animaciones / micro-interacciones (framer-motion y transiciones CSS).
- [x] Creación de Vistas principales (Inicio, Showcase de Proyectos, Galería, Radio, Biblioteca, Sobre mí).

### 🔵 Fase 3: Integración de Base de Datos y APIs (Completado)
- [x] Configuración de Prisma ORM en la carpeta `/backend` y modelado de datos en `schema.prisma` (`User`, `Photo`, `Article`, `Track`).
- [x] Migración inicial a AWS RDS PostgreSQL (`npx prisma migrate dev`).
- [x] Creación de funciones AWS Lambda independientes (Handlers de `login`, `photos`, `articles`, `tracks`) con empaquetado optimizado en `backend/esbuild.js`.
- [x] Creación de un panel de administrador (`src/app/admin/page.tsx`) con formulario de carga a S3 (Presigned URLs), creación de artículos y playlists de Spotify.
- [x] Conexión dinámica del reproductor de Radio y la Galería en el frontend para leer datos de AWS API Gateway con fallbacks estáticos en JSON locales.

### 🟣 Fase 4: Infraestructura Cloud con Terraform (Completado)
- [x] Alojamiento Estático: Buckets S3 (`site` y `media`) con políticas seguras OAC y CDN CloudFront.
- [x] Seguridad y Usuarios: Configuración de AWS Cognito User Pool, Cognito User Client y creación automática de usuario admin.
- [x] Base de datos: Creación de instancia RDS PostgreSQL con capa gratuita (`db.t4g.micro`) y Security Groups (puerto 5432).
- [x] API Gateway y Computación: Configuración de API Gateway HTTP v2, enrutado de peticiones (`GET/POST/DELETE/PUT`) a las funciones Lambda y asignación de IAM Roles.
- [x] Refactorización de `main.tf` monolítico en archivos separados e independientes (`s3_cloudfront.tf`, `cognito.tf`, `database.tf`, `lambdas.tf`, `api_gateway.tf`).

### 🟠 Fase 5: Despliegue Automatizado (CI/CD) & Producción (En progreso)
- [ ] Configuración del workflow de GitHub Actions para compilar y sincronizar automáticamente `out/` hacia S3.
- [ ] Manejo de secretos en GitHub Secrets (credenciales AWS CLI, CloudFront Invalidation).
- [ ] Implementación de script automatizado para invalidar caché de CloudFront en cada despliegue.
- [ ] Prueba de carga de contenidos real y verificación de SSL/TLS en `ma730.lat`.
