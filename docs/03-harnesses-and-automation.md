# 03. Bóveda de Arneses y Automatización (Harnesses & Automation)

## 📌 Filosofía
Los arneses (`harnesses`) son herramientas de software, scripts y validadores automatizados diseñados para garantizar la calidad del código, el estado del entorno y la compatibilidad con el pipeline de despliegue antes de realizar cualquier commit o integración.

En este repositorio, los arneses están divididos por **módulos de responsabilidad aislados** para permitir escalabilidad y versionado controlado.

---

## 📂 Estructura Modular (`harness/`)

```text
harness/
├── README.md                           # Guía general e índice de comandos
├── deploy-config/                      # Arneses de Infraestructura, Entorno y Git
│   ├── check-env.ps1                   # Auditoría de Node.js, Git remotos y archivos base
│   └── git-prep.ps1                    # Validador de pre-commit e integración
├── frontend/                           # Arneses del Frontend (Next.js / SPA)
│   └── validate-build.js               # Chequeo estricto de TypeScript, ESLint y next build (out/)
├── content/                            # Arneses de Contenido
│   └── validate-schemas.js             # Validación de esquemas JSON y Markdown
└── backend/                            # Arneses de Backend (Futuras integraciones)
```

---

## 🛠️ Comandos de Ejecución

| Dominio | Comando NPM | Descripción |
| :--- | :--- | :--- |
| **Frontend** | `npm run harness:frontend` | Valida TypeScript sin emitir JS, ESLint y compilación en `out/`. |
| **Entorno** | `npm run harness:env` | Audita versión de Node, rama activa de Git y existencia de docs. |
| **Git Pre-commit** | `npm run harness:git` | Valida todo el proyecto antes de un `git commit`. |
| **Contenido** | `npm run harness:content` | Valida integridad de datos en `src/content/`. |

---

## 🔄 Integración con el Flujo de Trabajo (GitOps)
Antes de subir cambios a la rama `main`, es requisito ejecutar `npm run harness:git` para prevenir fallas en el despliegue estático de AWS S3 + CloudFront.
