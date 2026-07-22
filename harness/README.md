# 🛠️ Harnesses Directory — `harness/`

Esta carpeta contiene scripts de automatización, arneses de pruebas y validadores organizados por procesos para mantener la integridad del desarrollo, el flujo de Git y las verificaciones previas a la integración.

---

## 📋 Lista de Arneses Disponibles

| Proceso　　　　　　| Arnés / Script                          | Propósito                                                                                                 | Comando de Ejecución Directa                 | Comando Corto (npm/pnpm)   |
| :-------------------| :----------------------------------------| :----------------------------------------------------------------------------------------------------------| :---------------------------------------------| :---------------------------|
| 🚀 **Deploy**　　　 | `harness/deploy/deploy-all.js`          | Valida código, compila backend, aplica Terraform, compila frontend Next.js y sube a AWS S3 + CloudFront.  | `node harness/deploy/deploy-all.js`          | `npm run deploy:all`       |
| 🛡️ **Validaciones** | `harness/validations/validate-build.js` | Ejecuta validación estricta de tipos TypeScript, linter de Next.js y la generación estática.              | `node harness/validations/validate-build.js` | `npm run harness:frontend` |
| 🛡️ **Validaciones** | `harness/validations/check-env.ps1`     | Verifica el estado de las dependencias locales, variables de entorno y versiones de Node/Git.             | `.\harness\validations\check-env.ps1`        | `npm run harness:env`      |
| 🛡️ **Validaciones** | `harness/validations/git-prep.ps1`      | Prepara y valida la rama de Git local ejecutando validaciones de código completas antes de hacer commits. | `.\harness\validations\git-prep.ps1`         | `npm run harness:git`      |
| 📝 **Content**　　 | `harness/content/validate-schemas.js`   | Valida que los esquemas JSON y Markdown de contenidos cumplan con las propiedades esperadas.              | `node harness/content/validate-schemas.js`   | `npm run harness:content`  |
| 🔑 **Auth**　　　　 | `harness/validations/reset-password.js` | Permite restablecer contraseñas de Cognito fuera de la web usando el código de verificación del correo.   | `node harness/validations/reset-password.js` | N/A                         |

---

## 🎯 Filosofía de Uso

Cualquier cambio importante en el código, infraestructura o contenidos del monorepo debe pasar por las validaciones antes de ser subido a la rama `main` en GitHub. El arnés `deploy-all.js` abortará el proceso automáticamente si se encuentra alguna falla en los pasos de validación frontend.
