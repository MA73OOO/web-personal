# 03. Bóveda de Arneses y Automatización (Harnesses & Automation)

## 📌 Filosofía
Los arneses (`harnesses`) son herramientas de software, scripts y validadores automatizados diseñados para garantizar la calidad del código, el estado del entorno y la compatibilidad con el pipeline de despliegue antes de realizar cualquier commit o integración en la nube.

En este repositorio, los arneses están divididos por **módulos de responsabilidad aislados** para permitir escalabilidad y versionado controlado, organizados en subcarpetas semánticas por proceso.

---

## 📂 Estructura Modular (`harness/`)

```text
harness/
├── README.md                           # Guía general e índice de comandos rápidos
├── deploy/                             # Arneses de Despliegue e Infraestructura
│   └── deploy-all.js                   # Orquestador del despliegue completo a AWS
├── validations/                        # Arneses de Validación Técnica (TS, ESLint, Env, Git)
│   ├── validate-build.js               # Validación estricta de TypeScript, linter Next.js y compilación
│   ├── check-env.ps1                   # Auditoría de Node.js, Git y variables de entorno locales
│   └── git-prep.ps1                    # Pre-commit hook para asegurar la limpieza antes del commit
└── content/                            # Arneses de Esquemas de Contenido
    └── validate-schemas.js             # Validador de archivos locales JSON y Markdown
```

---

## 🛠️ Comandos de Ejecución

| Dominio | Comando NPM / PNPM | Descripción | Script Ejecutado |
| :--- | :--- | :--- | :--- |
| 🚀 **Deploy Completo** | `npm run deploy:all` | Compila backend, ejecuta Terraform, compila Next.js y sube a S3 + CDN. | `harness/deploy/deploy-all.js` |
| **Validación SPA** | `npm run harness:frontend` | Valida TypeScript sin emitir JS, ESLint y compilación en `out/`. | `harness/validations/validate-build.js` |
| **Entorno** | `npm run harness:env` | Audita versión de Node, rama activa de Git y existencia de variables. | `harness/validations/check-env.ps1` |
| **Git Pre-commit** | `npm run harness:git` | Valida todo el proyecto local antes de realizar un `git commit`. | `harness/validations/git-prep.ps1` |
| **Contenido** | `npm run harness:content` | Valida integridad de esquemas de datos locales en `src/content/`. | `harness/content/validate-schemas.js` |

---

## 🔄 Integración con el Flujo de Trabajo (GitOps)
* **Antes de un commit:** Se recomienda correr `npm run harness:git` (o el alias corto en tu Git pre-commit hook) para evitar subir código con errores de sintaxis o tipos.
* **Para actualizar producción:** Correr `npm run deploy:all` compila, aprovisiona la base de datos RDS, despliega las funciones Lambda, transpila el frontend y lo sirve de inmediato a nivel mundial a través de CloudFront CDN.
