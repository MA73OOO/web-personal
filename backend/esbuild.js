const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const handlers = [
  { name: "login", entry: "src/handlers/auth/login.ts", outdir: "dist/login" },
  { name: "photos", entry: "src/handlers/photos/index.ts", outdir: "dist/photos" },
  { name: "articles", entry: "src/handlers/articles/index.ts", outdir: "dist/articles" },
  { name: "tracks", entry: "src/handlers/tracks/index.ts", outdir: "dist/tracks" },
];

async function build() {
  // Asegurarse de que la carpeta dist exista
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }

  for (const handler of handlers) {
    console.log(`📦 Compilando ${handler.name}...`);

    // Crear la carpeta del handler
    if (!fs.existsSync(handler.outdir)) {
      fs.mkdirSync(handler.outdir, { recursive: true });
    }

    // 1. Compilar el archivo TypeScript
    await esbuild.build({
      entryPoints: [handler.entry],
      bundle: true,
      minify: true,
      sourcemap: true,
      platform: "node",
      target: "node20",
      outfile: `${handler.outdir}/index.js`,
      // Excluir el SDK de AWS ya que viene preinstalado en el runtime de Node.js 20 en AWS Lambda
      external: ["@aws-sdk/*"],
    });

    const engineSource = path.join(
      __dirname,
      "node_modules",
      "prisma",
      "libquery_engine-rhel-openssl-3.0.x.so.node"
    );
    const engineDest = path.join(
      __dirname,
      handler.outdir,
      "libquery_engine-rhel-openssl-3.0.x.so.node"
    );

    if (fs.existsSync(engineSource)) {
      fs.copyFileSync(engineSource, engineDest);
      console.log(`   ✅ Motor de consulta Prisma copiado a ${handler.outdir}`);
    } else {
      console.warn(
        `   ⚠️ Advertencia: No se encontró el motor de consulta en ${engineSource}.\n` +
          `      Asegúrate de correr 'pnpm prisma:generate' antes de compilar.`
      );
    }

    // 3. Copiar el schema.prisma al directorio de la Lambda
    // Prisma Client necesita leer el archivo schema.prisma al inicializarse
    const schemaSource = path.join(__dirname, "prisma", "schema.prisma");
    const schemaDest = path.join(__dirname, handler.outdir, "schema.prisma");

    if (fs.existsSync(schemaSource)) {
      fs.copyFileSync(schemaSource, schemaDest);
    }
  }

  console.log("\n🚀 ¡Compilación completa! Todos los handlers están listos en la carpeta /dist");
}

build().catch((err) => {
  console.error("❌ Falló la compilación:", err);
  process.exit(1);
});
