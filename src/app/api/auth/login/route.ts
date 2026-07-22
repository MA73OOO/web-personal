import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

// Inicializar el cliente del proveedor de identidad de AWS Cognito
const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "El email y la contraseña son obligatorios." },
        { status: 400 }
      );
    }

    // Configurar los parámetros de autenticación para Cognito
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "5k84st5u4lkpel5upttksapitk", // Client ID entregado por Terraform
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    // Enviar solicitud de autenticación a AWS Cognito
    const response = await client.send(command);

    // Cognito devuelve tokens JWT si el login es exitoso
    if (response.AuthenticationResult) {
      const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

      // Crear respuesta y retornar los tokens de sesión
      return NextResponse.json({
        success: true,
        message: "Autenticación exitosa",
        idToken: IdToken,         // Contiene la información del perfil del usuario (email, nombre)
        accessToken: AccessToken, // Se utiliza para autorizar llamadas a APIs seguras
        refreshToken: RefreshToken, // Se utiliza para renovar la sesión sin volver a loguearse
      });
    }

    return NextResponse.json(
      { success: false, error: "Credenciales inválidas o inicio de sesión fallido." },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Error en login de Cognito:", error);

    // Manejo de errores específicos de Cognito
    let errorMessage = "Ocurrió un error inesperado al intentar iniciar sesión.";
    if (error.name === "NotAuthorizedException") {
      errorMessage = "El email o la contraseña son incorrectos.";
    } else if (error.name === "UserNotConfirmedException") {
      errorMessage = "El usuario no ha sido confirmado en el sistema.";
    } else if (error.name === "UserNotFoundException") {
      errorMessage = "No existe una cuenta registrada con este correo electrónico.";
    } else {
      errorMessage = error.message || errorMessage;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
