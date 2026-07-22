/**
 * Harness: Reset Password Offline (Fuera de la web)
 * Usage: node harness/validations/reset-password.js <email> <code> <newPassword>
 */

const email = process.argv[2];
const code = process.argv[3];
const newPassword = process.argv[4];

const API_BASE_URL = "https://7jddb01yw9.execute-api.us-east-1.amazonaws.com";

if (!email || !code || !newPassword) {
  console.log("\n❌ [Harness - Reset Password] Faltan parámetros obligatorios.");
  console.log("Uso correcto:");
  console.log("  node harness/validations/reset-password.js <correo> <código_verificación> <nueva_contraseña>\n");
  process.exit(1);
}

console.log(`🌌 [Harness - Reset Password] Iniciando restablecimiento para: ${email}...`);

async function run() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "confirm_forgot_password",
        email,
        code,
        newPassword
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error desconocido al procesar el cambio.");
    }

    console.log("✅ [Harness - Reset Password] ¡Contraseña actualizada con éxito en AWS Cognito!");
    console.log("Ya puedes intentar iniciar sesión en la web de administración con tu nueva clave.\n");
  } catch (error) {
    console.error(`\n❌ [Harness Error] Falló el restablecimiento: ${error.message}\n`);
    process.exit(1);
  }
}

run();
