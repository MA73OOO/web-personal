import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { prisma } from "../../utils/prisma";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Configurar las cabeceras CORS para permitir peticiones desde el frontend estático
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Content-Type": "application/json",
  };

  // Manejar la petición Preflight de CORS (OPTIONS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Falta el cuerpo de la petición." }),
      };
    }

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "El email y la contraseña son obligatorios.",
        }),
      };
    }

    const clientId = process.env.COGNITO_CLIENT_ID;
    if (!clientId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: "La variable de entorno COGNITO_CLIENT_ID no está configurada.",
        }),
      };
    }

    // Iniciar la autenticación con Cognito
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const authResponse = await cognitoClient.send(command);

    if (authResponse.AuthenticationResult) {
      const { IdToken, AccessToken, RefreshToken } = authResponse.AuthenticationResult;

      // Opcional: Registrar o sincronizar el usuario en PostgreSQL usando Prisma
      // Para este login simple, retornamos directamente la autenticación exitosa.
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Autenticación exitosa",
          idToken: IdToken,
          accessToken: AccessToken,
          refreshToken: RefreshToken,
        }),
      };
    }

    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: "Inicio de sesión fallido." }),
    };
  } catch (error: any) {
    console.error("Error en handler de login:", error);

    let errorMessage = "Ocurrió un error inesperado al intentar iniciar sesión.";
    if (error.name === "NotAuthorizedException") {
      errorMessage = "El email o la contraseña son incorrectos.";
    } else if (error.name === "UserNotFoundException") {
      errorMessage = "No existe una cuenta registrada con este correo electrónico.";
    }

    return {
      statusCode: error.$metadata?.httpStatusCode || 400,
      headers,
      body: JSON.stringify({ success: false, error: errorMessage }),
    };
  }
};
