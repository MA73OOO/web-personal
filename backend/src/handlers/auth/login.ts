import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
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

    const payload = JSON.parse(event.body);
    const { action, email } = payload;

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

    // ACCIÓN A: Verificación de código MFA (Doble factor)
    if (action === "verify_mfa") {
      const { code, session } = payload;
      if (!email || !code || !session) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Email, código y sesión son obligatorios." }),
        };
      }

      const verifyCommand = new RespondToAuthChallengeCommand({
        ClientId: clientId,
        ChallengeName: "EMAIL_OTP",
        Session: session,
        ChallengeResponses: {
          USERNAME: email,
          EMAIL_OTP_CODE: code,
        },
      });

      const verifyResponse = await cognitoClient.send(verifyCommand);
      if (verifyResponse.AuthenticationResult) {
        const { IdToken, AccessToken, RefreshToken } = verifyResponse.AuthenticationResult;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            idToken: IdToken,
            accessToken: AccessToken,
            refreshToken: RefreshToken,
          }),
        };
      }

      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: "Código de doble factor inválido." }),
      };
    }

    // ACCIÓN B: Confirmar restablecimiento de contraseña (Fuera de la web)
    if (action === "confirm_forgot_password") {
      const { code, newPassword } = payload;
      if (!email || !code || !newPassword) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Email, código y nueva contraseña son obligatorios." }),
        };
      }

      const confirmCommand = new ConfirmForgotPasswordCommand({
        ClientId: clientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      });

      await cognitoClient.send(confirmCommand);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "Contraseña actualizada exitosamente." }),
      };
    }

    // ACCIÓN C: Solicitar recuperación de contraseña (Triggered manually via action)
    if (action === "forgot_password") {
      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "El email es obligatorio." }),
        };
      }

      const forgotCommand = new ForgotPasswordCommand({
        ClientId: clientId,
        Username: email,
      });

      await cognitoClient.send(forgotCommand);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "Código de restauración enviado al correo." }),
      };
    }

    // FLUJO NORMAL: Autenticación por Password
    const { password } = payload;
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

    // Si la contraseña es "recuperar" o "recover", disparamos recuperación sigilosa (Forgot Password)
    if (password === "recuperar" || password === "recover") {
      const forgotCommand = new ForgotPasswordCommand({
        ClientId: clientId,
        Username: email,
      });
      await cognitoClient.send(forgotCommand);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Código de recuperación enviado a tu correo.",
          recoveryInitiated: true,
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

    // Si requiere desafío (Doble Factor - EMAIL_OTP)
    if (authResponse.ChallengeName === "EMAIL_OTP" || authResponse.ChallengeName === "SELECT_MFA_TYPE") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          challengeName: "EMAIL_OTP",
          session: authResponse.Session,
          email: email,
        }),
      };
    }

    // Si inició directamente (por ejemplo, si MFA está apagado o ya completado)
    if (authResponse.AuthenticationResult) {
      const { IdToken, AccessToken, RefreshToken } = authResponse.AuthenticationResult;

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
    } else if (error.name === "CodeMismatchException") {
      errorMessage = "El código ingresado es incorrecto o ya expiró.";
    } else if (error.name === "ExpiredCodeException") {
      errorMessage = "El código ingresado ha expirado.";
    } else if (error.name === "InvalidParameterException") {
      errorMessage = error.message || "Parámetro inválido.";
    }

    return {
      statusCode: error.$metadata?.httpStatusCode || 400,
      headers,
      body: JSON.stringify({ success: false, error: errorMessage }),
    };
  }
};
