# 🛠️ Harnesses Directory — `harness/`

Esta carpeta contiene scripts de automatización, arneses de pruebas y validadores para mantener la integridad del desarrollo, el flujo de Git y las verificaciones previas a la integración.

---

## 📋 Lista de Arneses Disponibles

| Arnés / Script              | Propósito                                                                                         | Uso                              |
| :----------------------------| :--------------------------------------------------------------------------------------------------| :---------------------------------|
| `harness/validate-build.js` | Ejecuta validación estricta de tipos TypeScript, Linter y la compilación estática (`next build`). | `node harness/validate-build.js` |
| `harness/deploy-all.js`     | Valida código, compila backend, actualiza AWS con Terraform, compila frontend y lo sube a S3 + CDN. | `node harness/deploy-all.js`      |
| `harness/check-env.ps1`     | Verifica el estado del entorno (versión de Node, Git remote, dependencias y estado de la bóveda). | `.\harness\check-env.ps1`        |
| `harness/git-prep.ps1`      | Prepara y valida la rama de Git antes de hacer commits o desplegar.                               | `.\harness\git-prep.ps1`         |

---

## 🎯 Filosofía de Uso
Cualquier cambio importante en el código o contenido debe pasar por `node harness/validate-build.js` antes de subirlo a la rama `main` de GitHub.
