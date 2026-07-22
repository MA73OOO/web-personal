import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { prisma } from "../../utils/prisma";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Content-Type": "application/json",
  };

  const method = (event as any).requestContext?.http?.method || event.httpMethod;

  if (method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    switch (method) {
      case "GET":
        return await handleGet(headers);
      case "POST":
        return await handlePost(event, headers);
      case "PUT":
        return await handlePut(event, headers);
      case "DELETE":
        return await handleDelete(event, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: "Método no permitido." }),
        };
    }
  } catch (error: any) {
    console.error("Error en handler de Tracks:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

// 1. Obtener todas las canciones de la radio
async function handleGet(headers: Record<string, string>): Promise<APIGatewayProxyResult> {
  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(tracks),
  };
}

// 2. Agregar una nueva playlist de Spotify
async function handlePost(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el cuerpo." }) };
  }

  const { id, title, description, url } = JSON.parse(event.body);

  if (!id || !title || !description || !url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "El ID de Spotify, el título, la descripción y la URL son obligatorios." }),
    };
  }

  const track = await prisma.track.create({
    data: {
      id,
      title,
      description,
      url,
    },
  });

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({ success: true, track }),
  };
}

// 3. Actualizar una playlist por ID
async function handlePut(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id || event.queryStringParameters?.id;

  if (!id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el ID de la playlist." }) };
  }

  if (!event.body) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el cuerpo." }) };
  }

  const { title, description, url } = JSON.parse(event.body);

  const updatedTrack = await prisma.track.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(url && { url }),
    },
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, track: updatedTrack }),
  };
}

// 4. Eliminar una playlist por ID de Spotify
async function handleDelete(
  event: APIGatewayProxyEvent,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id || event.queryStringParameters?.id;

  if (!id) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Falta el ID de Spotify de la playlist." }) };
  }

  await prisma.track.delete({ where: { id } });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, message: "Playlist eliminada de la radio con éxito." }),
  };
}

