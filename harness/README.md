# 🛠️ Bóveda de Harneses Modular — `harness/`

Esta carpeta contiene los arneses de pruebas, herramientas de automatización y esquemas de validación divididos por módulos de la aplicación.

---

## 📂 Estructura de la Bóveda de Harneses

```text
harness/
├── README.md                           # Documentación principal
├── deploy-config/                      # Arneses de Infraestructura, Entorno y Git
│   ├── check-env.ps1                   # Auditoría de Node, Git y bóveda
│   └── git-prep.ps1                    # Pre-commit harness validator
├── frontend/                           # Arneses de Frontend (Next.js / UI)
│   └── validate-build.js               # Validación de tipos, ESLint y static export (out/)
├── content/                            # Arneses de Validación de Contenido
│   └── validate-schemas.js             # Verificación de JSON y Markdown schemas
└── backend/                            # Arneses de Backend (Futuras integraciones)
```

---

## 📋 Lista de Comandos Rápidos

| Arnés | Módulo | Descripción | Comando |
| :--- | :--- | :--- | :--- |
| **Env Check** | `deploy-config` | Audita Node, Git y archivos base. | `npm run harness:env` |
| **Git Prep** | `deploy-config` | Valida antes de commit/push. | `npm run harness:git` |
| **Frontend Build** | `frontend` | Valida TypeScript, ESLint y `next build`. | `npm run harness:frontend` |
| **Content Check** | `content` | Valida esquemas JSON/Markdown. | `npm run harness:content` |

---

## 🎯 Filosofía Modular
Cualquier nuevo módulo (ej. `harness/backend` o una nueva versión de frontend `harness/frontend-v2`) se aísla en su propia subcarpeta para garantizar versionado controlado e independencia de tests.
