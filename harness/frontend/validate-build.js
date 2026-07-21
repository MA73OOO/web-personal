/**
 * Harness: Frontend Build & TypeScript Types Validator
 * Usage: node harness/frontend/validate-build.js
 */
const { execSync } = require('child_process');

console.log('🎨 [Harness - Frontend] Iniciando validación completa de la SPA...\n');

try {
  console.log('1️⃣ [TypeScript] Verificando tipos...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ [TypeScript] Tipos correctos.\n');

  console.log('2️⃣ [Linter] Verificando sintaxis y reglas...');
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ [Linter] Sintaxis correcta.\n');

  console.log('3️⃣ [Next.js Export] Verificando build estático (out/)...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ [Next.js Export] Build completado exitosamente.\n');

  console.log('🎉 [Harness - Frontend] ¡Todo listo! La app de Next.js pasa todas las validaciones.');
} catch (error) {
  console.error('\n❌ [Harness Error] Se encontraron fallas durante la validación del frontend.');
  process.exit(1);
}
