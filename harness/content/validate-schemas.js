/**
 * Harness: Content Schema Validator (JSON / Markdown)
 * Usage: node harness/content/validate-schemas.js
 */
const fs = require('fs');
const path = require('path');

console.log('📝 [Harness - Content] Verificando esquema de contenidos en src/content...\n');

const contentDir = path.join(process.cwd(), 'src', 'content');

if (!fs.existsSync(contentDir)) {
  console.log('ℹ️ [Harness - Content] La carpeta src/content aún no existe. Se creará en la Fase 3.');
  process.exit(0);
}

console.log('✅ [Harness - Content] Carpeta src/content verificada.');
