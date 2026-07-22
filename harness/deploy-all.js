/**
 * Arnés Orquestador: Despliegue Completo de la Aplicación (Monorepo Deployer)
 * Uso: node harness/deploy-all.js
 */
const { execSync } = require('child_process');
const path = require('path');

// Colores para consola
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

console.log(`${YELLOW}🚀 [Harness - Deploy] Iniciando despliegue completo de la infraestructura y el sitio web...${RESET}\n`);

const ROOT_DIR = path.resolve(__dirname, '..');
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const TERRAFORM_DIR = path.join(ROOT_DIR, 'terraform');

try {
  // 1. VALIDAR FRONTEND
  console.log(`${YELLOW}1️⃣ [Frontend] Verificando tipos TypeScript y reglas de estilo (ESLint)...${RESET}`);
  execSync('npx tsc --noEmit', { stdio: 'inherit', cwd: ROOT_DIR });
  execSync('npm run lint', { stdio: 'inherit', cwd: ROOT_DIR });
  console.log(`${GREEN}✅ [Frontend] Código limpio y correcto.${RESET}\n`);

  // 2. COMPILAR BACKEND
  console.log(`${YELLOW}2️⃣ [Backend] Compilando lógica de las funciones AWS Lambda...${RESET}`);
  execSync('pnpm build', { stdio: 'inherit', cwd: BACKEND_DIR });
  console.log(`${GREEN}✅ [Backend] Compilación de Lambdas completada en backend/dist/.${RESET}\n`);

  // 3. APLICAR INFRAESTRUCTURA TERRAFORM (AWS)
  console.log(`${YELLOW}3️⃣ [Terraform] Sincronizando infraestructura en AWS (RDS, Cognito, Lambdas, API Gateway)...${RESET}`);
  // Usamos -auto-approve para que no pida confirmación interactiva en el script automatizado
  execSync('terraform apply -auto-approve', { stdio: 'inherit', cwd: TERRAFORM_DIR });
  console.log(`${GREEN}✅ [Terraform] Infraestructura en AWS sincronizada correctamente.${RESET}\n`);

  // 4. COMPILAR FRONTEND NEXT.JS
  console.log(`${YELLOW}4️⃣ [Next.js] Compilando sitio web estático (out/)...${RESET}`);
  execSync('npx next build', { stdio: 'inherit', cwd: ROOT_DIR });
  console.log(`${GREEN}✅ [Next.js] Generación estática completada con éxito.${RESET}\n`);

  // 5. SUBIR AL BUCKET S3 E INVALIDAR CDN CLOUDFRONT
  console.log(`${YELLOW}5️⃣ [AWS Deploy] Sincronizando sitio estático en S3 e invalidando caché de CloudFront...${RESET}`);
  // Sincronizar S3
  execSync('aws s3 sync out/ s3://ma73o-hub-site-681a6b26 --delete --profile ma730-dev', { stdio: 'inherit', cwd: ROOT_DIR });
  // Invalidad caché
  execSync('aws cloudfront create-invalidation --distribution-id E34VKHZ37TZNOR --paths "/*" --profile ma730-dev', { stdio: 'inherit', cwd: ROOT_DIR });
  console.log(`${GREEN}✅ [AWS Deploy] Sitio en vivo actualizado exitosamente.${RESET}\n`);

  console.log(`${GREEN}🎉 [Harness - Deploy] ¡Éxito absoluto! Tu portafolio web personal y backend están en línea y actualizados en AWS.${RESET}`);
} catch (error) {
  console.error(`\n${RED}❌ [Harness Error] El despliegue falló durante la ejecución. Operación abortada.${RESET}`);
  process.exit(1);
}
