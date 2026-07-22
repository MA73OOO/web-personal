# 🌌 MA73O — Personal Web Hub

Este repositorio contiene la plataforma web personal de **MA73O**, estructurada como una SPA moderna de alto rendimiento con arquitectura híbrida y desacoplada de costo-cero.

---

## 🏗️ Resumen de Arquitectura

El sistema está diseñado para ofrecer máxima velocidad y seguridad reduciendo a cero los costos fijos de servidor:

* **Frontend:** Next.js 16 (React 19 / App Router) exportado como sitio completamente estático (`output: 'export'`). Estilado con Tailwind CSS v4 bajo una estética Brutalista Monocromática.
* **Backend & APIs:** AWS Lambda Functions (Node.js/TypeScript compiladas con `esbuild`) expuestas de forma segura mediante AWS API Gateway v2 (HTTP APIs).
* **Base de Datos:** AWS RDS PostgreSQL persistido por Prisma ORM, con un sistema híbrido de fallbacks locales en archivos JSON (`src/content/`) para garantizar tolerancia a fallos.
* **Autenticación:** AWS Cognito User Pool para el acceso seguro al Panel de Administración.
* **Infraestructura como Código (IaC):** Módulos independientes y versionados en Terraform.
* **Hosting & Entrega:** AWS S3 (Site & Media Buckets) + AWS CloudFront CDN (con SSL mediante ACM).

---

## 📂 Estructura del Proyecto

```text
web-personal/
├── .agents/                    # Bóveda de reglas y contexto para agentes de IA
├── docs/                       # Bitácoras y registro de decisiones de diseño (ADRs)
├── harness/                    # Automatizaciones de despliegue y scripts de validación
│   ├── deploy/                 # Orquestador de publicación en la nube
│   ├── validations/            # Verificadores técnicos (TS, Linter, Git)
│   └── content/                # Validadores de esquemas de datos locales
├── terraform/                  # Configuración de recursos e infraestructura en AWS
├── backend/                    # Backend modular con Prisma, esquemas y Lambda handlers
└── src/                        # Código fuente del Frontend (Next.js SPA)
    ├── app/                    # Rutas, servicios y vistas principales de la aplicación
    ├── components/             # Componentes modulares e interactivos de la interfaz
    ├── content/                # Almacén de contenidos locales y fallbacks (JSON/MD)
    └── context/                # Contextos globales de React (Tema, Idioma, Radio)
```

---

## 🛠️ Comandos de Ejecución y Automatización

Para mantener la calidad y consistencia del proyecto, se han definido scripts y validadores locales en [package.json](file:///c:/Users/PC/Desktop/personal-web/package.json).

### Validaciones Locales (Harnesses)
* **Auditar Entorno Local:** `npm run harness:env` (Verifica versiones de herramientas, Git y variables de entorno).
* **Validar Frontend:** `npm run harness:frontend` (Chequea tipos de TypeScript, sintaxis con ESLint y compila Next.js en `out/`).
* **Verificar Esquemas de Contenido:** `npm run harness:content` (Asegura la integridad de los JSON en `src/content/`).
* **Validación Pre-commit:** `npm run harness:git` (Ejecuta todas las pruebas locales antes de permitir un commit).

### Servidor de Desarrollo
Para correr el frontend localmente en modo desarrollo:
```bash
npm run dev
```

Para interactuar con la base de datos de desarrollo usando Prisma Studio:
```bash
cd backend
npx prisma studio
```

---

## 🚀 Despliegue en AWS

El despliegue está completamente orquestado para compilar el backend, sincronizar la infraestructura con Terraform, compilar la SPA estática y subirla a S3:

```bash
# Despliegue automatizado completo
npm run deploy:all
```
